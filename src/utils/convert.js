export function base64ToBlob (base64) {
  let arr = base64.split(',')
  let data = window.atob(arr[1])
  let mime = arr[0].match(/:(.*?);/)[1]
  let ia = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  return new Blob([ia], { type: mime })
}

export function base64ToArrayBuffer (base64) {
  let arr = base64.split(',')
  var binaryString = window.atob(arr[1])
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export function blobToFile (blob, name) {
  return new File([blob], name, { type: blob.type })
}

export function blobToArrayBuffer (blob) {
  return new Promise((resolve, reject) => {
    let newBlob = new Blob([blob], { type: 'text/plain' })
    let file = new FileReader()
    file.onload = function (e) {
      resolve(e.target.result)
    }
    file.readAsArrayBuffer(newBlob)
  })
}

export function readAsText (blob, encode) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      resolve(e.target.result)
    }
    reader.onerror = e => reject(e)
    reader.readAsText(blob, 'utf-8')
  })
}
