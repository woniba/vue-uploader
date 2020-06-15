<template>
  <el-upload
    ref="upload"
    :style="params.style || { width: '600px' }"
    :action="params.url?params.url:'upload-server-url'"
    :disabled="params.disabled"
    :on-preview="handlePreview"
    :before-upload="beforeUpload"
    :http-request="handleUpload"
    :on-remove="handleRemove"
    multiple
    :limit="params.limit"
    :show-file-list="params.showFileList"
    :on-exceed="handleExceed"
    :file-list="params.fileList"
  >
    <el-button size="small" type="primary" icon="el-icon-upload">{{ params.btnName ? params.btnName : '点击上传' }}</el-button>
    <div
      v-if="!params.hideTip"
      slot="tip"
      class="el-upload__tip"
    >
      <!--type==null 不限制格式-->
      <template v-if="params.type">
        只能上传 {{ params.type.join('，') }} 文件,
      </template>
      单个文件不超过 {{ params.limitSize }}（最多{{ params.limit }}个文件）
    </div>
    <el-progress v-show="showProgress" :percentage="uploadPercent" />
  </el-upload>
</template>

<script>
import { getOssSignReq } from '../utils/common'
import { replaceURL } from '../utils/utils'

export default {
  name: 'UploadFile',
  props: ['params'],
  data() {
    return {
      showProgress: false,
      uploadPercent: 0
    }
  },
  mounted() {
    this.showProgress = this.params.showProgress ? this.params.showProgress : false
  },
  methods: {
    // 上传之前校验格式和大小
    beforeUpload(file) {
      var fileType = false
      if (!this.params.type) {
        fileType = true
      } else {
        for (var t of this.params.type) {
          if (file.name.endsWith(t)) {
            fileType = true
          }
        }
      }
      var isLimit = false
      var arrKb = ['KB', 'Kb', 'kb', 'kB']
      var arrMb = ['MB', 'Mb', 'mb', 'mB', 'M']
      for (var k of arrKb) {
        if (this.params.limitSize.indexOf(k) > 0) {
          isLimit = file.size / 1024 <= Number(this.params.limitSize.slice(0, this.params.limitSize.indexOf(k)))
        }
      }
      for (var m of arrMb) {
        if (this.params.limitSize.indexOf(m) > 0) {
          isLimit = file.size / 1024 / 1024 <= Number(this.params.limitSize.slice(0, this.params.limitSize.indexOf(m)))
        }
      }
      if (!fileType) {
        this.$message.error('上传文件格式错误!')
      }
      if (!isLimit) {
        this.$message.error(`上传文件大小不能超过${this.params.limitSize}!`)
      }
      return fileType && isLimit
    },
    getOssSign() {
      return new Promise((resolve, reject) => {
        // 从服务端获取签名
        getOssSignReq().then(response => {
          resolve(response.data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /** 上传 **/
    handleUpload(file) {
      getOssSignReq().then(data => {
        const key = data.dir + data.key + '_${filename}'
        var ossData = new FormData()
        // key 一定要放在表单域前
        ossData.append('Filename', '${filename}')
        ossData.append('key', key)
        ossData.append('policy', data.policy)
        ossData.append('OSSAccessKeyId', data.OSSAccessKeyId)
        ossData.append('success_action_status', 200)
        ossData.append('signature', data.signature)
        ossData.append('file', file.file, replaceURL(file.file.name))
        this.$http
          .post(data.host, ossData, {onUploadProgress: this.progressFunction})
          .then(() => {
            // 这里是生成一个Image标签来判断是否符合大小
            if (this.params.width && this.params.height) {
              var image = new Image()
              image.src = `${data.host}/${key.replace(
                '${filename}',
                replaceURL(file.file.name)
              )}`
              image.onload = () => {
                if (
                  image.width !== this.params.width ||
                  image.height !== this.params.height
                ) {
                  this.$message.error('请上传合适尺寸的图片！')
                  return false
                } else {
                  this.params.imgUrl = `${data.host}/${key.replace(
                    '${filename}',
                    replaceURL(file.file.name)
                  )}`
                  // 触发父组件中的方法，将上传的数据给到父组件
                  this.$emit(this.params.fn, this.params.imgUrl)
                  this.$message({
                    type: 'success',
                    message: '上传完成'
                  })
                }
              }
            } else {
              this.params.imgUrl = `${data.host}/${key.replace(
                '${filename}',
                replaceURL(file.file.name)
              )}`
              // 触发父组件中的方法，将上传的数据给到父组件
              this.$emit(this.params.fn, this.params.imgUrl)
              this.$message({
                type: 'success',
                message: '上传完成'
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    progressFunction(event) {
      if(!this.showProgress) {
        return
      }
      // 设置进度显示
      if (event.lengthComputable) {
        // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        // 如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        var percent = Math.floor(event.loaded / event.total * 100)
        if (percent > 100) {
          percent = 100
        }
        this.uploadPercent = percent
      }
      this.showProgress = true
    },
    handleRemove(file, fileList) {
      for (var i = 0; i < this.params.fileList.length; i++) {
        if (this.params.fileList[i].uid === file.uid) {
          this.params.fileList.splice(i, 1)
        }
      }
      this.$emit(this.params.fn, this.params.fileList)
    },
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '超过最大数量'
      })
    },
    handlePreview(file) {
      window.open(file.url)
    },
    clearFile() {
      this.$refs['upload'].clearFiles()
      this.params.fileList = []
    }
  }
}
</script>

<style scoped>
</style>
