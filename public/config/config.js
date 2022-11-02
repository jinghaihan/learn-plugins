window.selectOptions = [
  {
    label: '合同关键信息提取',
    value: 'contract',
    url: 'http://10.1.60.25:8003/contract_extract/v1.0',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    accept: '.png,.jpg,.jpeg'
  },
  {
    label: '台账账单信息识别',
    value: 'flightrec',
    url: 'http://10.1.60.25:8002/flightrec/v1.0',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    accept: '.png,.jpg,.jpeg,.bmp,.pdf'
  }
]
window.handler = {
  'contract': function (response) {
    let meta = {}
    meta['响应描述'] = response.headers['x-ebapi-desc'] === 'success' ? '检测成功' : '检测失败'

    let data = response.data.result
    meta['甲方公司名称'] = data['member1'] ? data['member1'] : '无'
    meta['乙方公司名称'] = data['member2'] ? data['member2'] : '无'
    meta['是否盖章'] = data['is_seal'] ? '是' : '否'
    return [meta]
  },
  'flightrec': function (response) {
    let result = []

    if (response.headers['x-ebapi-desc'] !== 'success') {
      result.push({
        '响应描述': '检测失败',
        '姓名': '无',
        '航班号': '无',
        '电子客票号码': '无',
        '合计': '无'
      })
    } else {
      let data = response.data.content[0].data
      data.forEach((item, index) => {
        let num = index > 0 ? index + 1 : ''
        let meta = {}
        meta['响应描述' + num] = '检测成功'
        meta['姓名' + num] = item['name'] ? item['name'] : '无'
        meta['航班号' + num] = item['flight'] ? item['flight'] : '无'
        meta['电子客票号码' + num] = item['number'] ? item['number'] : '无'
        meta['合计' + num] = item['total'] ? item['total'] : '无'
        result.push(meta)
      })
    }

    return result
  }
}
window.copyright = 'jinghaihan'
