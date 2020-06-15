/** 去除对象空值 */
export const deleteEmptyObject = (object) => {
    for (var i in object) {
      if (object[i] === '' || object[i] === undefined || object[i] === null) {
        delete object[i]
      }
    }
    return object
  }
  
  /** 去除url特殊符号 **/
  export const replaceURL = (url) => {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]")
    var rs = ''
    for (var i = 0; i < url.length; i++) {
      rs = rs + url.substr(i, 1).replace(pattern, '')
    }
    return rs
  }
  
  /** 去除url部分特殊符号 **/
  export const replaceURLElse = (url) => {
    var pattern = new RegExp("[`!@#$^*=|{}':;',\\[\\]<>/?！@#￥……&*|{}【】‘；：”“'。，、？%]")
    var rs = ''
    for (var i = 0; i < url.length; i++) {
      rs = rs + url.substr(i, 1).replace(pattern, '')
    }
    return rs
  }
  