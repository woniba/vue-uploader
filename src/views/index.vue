<template>
  <div class="index-page">
    <upload-file :params="params" @solutionFile="solutionFile" />
  </div>
</template>

<script>
import uploadFile from '../components/uploadFile'
export default {
  name: 'Index',
  components: { uploadFile },
  data () {
    return {
        // 批量导入模板数据
        params: {
          url: 'upload-server-url', // 上传的服务器地址,暂用upload-server-url表示
          limitSize: '100M',
          fn: 'solutionFile',
          type: ['doc','docx','ppt','zip','rar'],
          limit: 1,
          fileList: [],
          showProgress: false,
          btnName: '上传图片'
        }
    }
  },
  mounted() {

  },
  methods: {
    /** 上传文件 **/
    solutionFile(val) {
        console.log(val)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
