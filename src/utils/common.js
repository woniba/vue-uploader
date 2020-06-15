import jsonp from 'jsonp'

/**
 * 阿里云签名获取
 * getAutographUrl: 获取签名接口地址
 */
export function getOssSignReq() {
  return new Promise((resolve, reject) => {
    jsonp('getAutographUrl', null, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

