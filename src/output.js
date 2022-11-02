import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import XLSX from 'xlsx'

const JSZip = require('jszip')
const saveAs = require('file-saver')

const output = {
  getPdf (html, vm) {
    return new Promise((resolve, reject) => {
      html2Canvas(html, {
        allowTaint: false,
        taintTest: false,
        logging: false,
        useCORS: true,
        dpi: window.devicePixelRatio * 2,
        scale: 2,
        height: html.scrollHeight,
        windowHeight: html.scrollHeight
      }).then(canvas => {
        vm.startLoading('download')
        let pdf = new JsPDF('p', 'mm', 'a4')
        let ctx = canvas.getContext('2d')
        let a4w = 190; let a4h = 277
        let imgHeight = Math.floor(a4h * canvas.width / a4w)
        let renderedHeight = 0
        let image
        while (renderedHeight < canvas.height) {
          let page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight)
   
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width))
   
          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) {
            pdf.addPage()
          }
        }
        resolve({
          pdf: pdf.output('dataurlstring').substring(28),
          png: canvas.toDataURL('image/png').split(';base64,')[1]
        })
      })
    })
  },
  getJson (data) {
    return new Promise(async (resolve, reject) => {
      let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json,charset=utf-8;' })
      let json = await output.blobToBase64(blob)
      resolve({ json })
    })
  },
  getXlsx (data) {
    let header = ['文件名']
    let content = []
    let colWidths = []
    
    data.forEach(item => {
      item.meta.forEach(meta => {
        Object.keys(meta).forEach(key => {
          if (!header.includes(key)) header.push(key)
        })
      })
    })
    data.forEach(item => {
      item.meta.forEach(meta => {
        let arr = []
        header.forEach((key, index) => {
          if (!colWidths[index]) colWidths[index] = []
          if (key === '文件名') {
            arr.push(item.name)
            colWidths[index].push(getCellWidth(item.name))
            return
          }
          arr.push(meta[key] ? meta[key] : '')
          colWidths[index].push(getCellWidth(meta[key] ? meta[key] : ''))
        })
        content.push(arr)
      })
    })

    let _data = []
    _data.push(header)
    content.forEach(item => {
      _data.push(item)
    })
    
    const ws = XLSX.utils.aoa_to_sheet(_data)
    ws['!cols'] = []
    colWidths.forEach((widths, index) => {
      widths.push(getCellWidth(header[index]))
      ws['!cols'].push({ wch: Math.max(...widths) })
    })

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    const xlsx = XLSX.write(wb, {
      type: 'base64',
      bookType: 'xlsx'
    })
    return { xlsx }
  },
  downloadZip (title, data) {
    let zip = new JSZip()
    Object.keys(data).forEach(suffix => {
      zip.file(`${title}.${suffix}`, data[suffix], { base64: true })
    })

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, `${title}.zip`)
    })
  },
  blobToBase64 (blob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        resolve(e.target.result.split(';base64,')[1])
      }
      fileReader.readAsDataURL(blob)
    })
  }
}

function getCellWidth (value) {
  if (value == null) {
    return 10
  } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
    const len = value.match(/[\u4e00-\u9fa5]/g).length
    const otherLength = value.length - len
    return len * 2.1 + otherLength * 1.1
  } else {
    return value.toString().length * 1.1
  }
}
 
export default output
