/*
 * @Date: 2021-01-31 13:18:23
 * @LastEditors: kanoyami
 * @LastEditTime: 2021-01-31 21:02:55
 */
var express = require('express');
var router = express.Router();
const gitfModel = require("../../models/gitf")
const moment = require("moment")
const ONE_DAY = 24 * 60 * 60 * 1000;


/* GET home page. */
//'w.Write([]byte(`{"version": " + BackendVersion + ", "config": {"enableTranslate":  + strconv.FormatBool(EnableTranslate) + }}))'
router.get('/totalDaliy', function (req, res, next) {
  const start = req.query.start || new Date(new Date().toLocaleDateString()).getTime();
  const end = req.query.end || new Date(new Date().toLocaleDateString()).getTime() + ONE_DAY - 1
  const daliyGift = gitfModel.daliyGiftByType(start, end, Number(req.query.roomId))
  res.json(daliyGift)
});

router.get('/totalByDate', function (req, res, next) {
  let start = req.query.start ? new Date(new Date(req.query.start).toLocaleDateString()).getTime() : new Date(new Date().toLocaleDateString()).getTime() - ONE_DAY * 7;
  const end = req.query.end ? new Date(new Date(req.query.end).toLocaleDateString()).getTime() + ONE_DAY - 1 : new Date(new Date().toLocaleDateString()).getTime() + ONE_DAY - 1

  const days = parseInt((end - start) / (ONE_DAY))

  //const daliyGift = gitfModel.daliyGiftByType(start, end, Number(req.query.roomId))
  const result = { days: [], value: [] }
  for (let i = 1; i <= days; i++) {
    let tmp = gitfModel.daliyGiftByType(start + i * ONE_DAY, start + (i + 1) * ONE_DAY, Number(req.query.roomId))
    result.days.push(moment(start + i * ONE_DAY).format("YYYY-MM-DD"))
    result.value.push(tmp.allTotalRMB)
  }
  res.json(result)
});

router.get('/all', function (req, res, next) {
  let start = req.query.start || new Date(new Date().toLocaleDateString()).getTime();
  const end = req.query.end || new Date(new Date().toLocaleDateString()).getTime() + ONE_DAY - 1
  const result = gitfModel.findAllbetweenTimestampByRoomId(start, end, Number(req.query.roomId))
  res.json(result)
});

module.exports = router;
