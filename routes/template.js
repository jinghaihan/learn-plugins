var express = require('express');
var router = express.Router();

var Mock = require('mockjs');
var Random = Mock.Random;

// 列表查询
router.get('/', (request, response) => {
  response.json(
    Mock.mock({
      success: true,
      desc: '查询成功',
      data: {
        count: Random.integer(10, 20),
        "rows|10-20": [
          {
            "id": "@guid()",
            "time": "@datetime()",
            "createTime": "@datetime()",
            "creatorName": "@cname()",
            "creator": "@word()"
          }
        ]
      }
    })
  )
})

// 新增
router.post('/', (request, response) => {
  response.json(
    {
      success: true,
      desc: '新增成功'
    }
  )
})

// 修改
router.put('/:id', (request, response) => {
  response.json(
    {
      success: true,
      desc: '修改成功'
    }
  )
})

// 删除
router.delete('/:id', (request, response) => {
  response.json(
    {
      success: true,
      desc: '删除成功'
    }
  )
})

// 查看
router.get('/:id', (request, response) => {
  response.json(
    Mock.mock({
      success: true,
      desc: '查询成功',
      data: {
        "id": "@guid()",
        "time": "@datetime()",
        "createTime": "@datetime()",
        "creatorName": "@cname()",
        "creator": "@word()"
      }
    })
  )
})

module.exports = router;
