const express = require('express');
const router = express.Router();
const ALLFeeds = require('../../models/all-model');
const DCFeeds = require('../../models/all-model');
const FBFeeds = require('../../models/all-model');

// 맞는지 모르겠지만... 스태틱 변수 생성.. 크롤링해오는 데이터 중 최신 피드의 생성 시간을 저장한다.
let mostRecentlyData = (function() {
  let staticVar = 0;
  return staticVar;
})();

// 데이터베이스의 모든 피드들을 가져 온다.
router.get('/allfeeds', (req, res) => {
  ALLFeeds.find({}).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("all feeds sent");
    mostRecentlyData = docs[0].created_time; // 페이지 업로드 시, 가장 최신 데이터의 시간을 저장한다.
    res.json(docs);
  });
});
// 페북만 가져옴
router.get('/fbfeeds', (req, res) => {
  FBFeeds.find({ from: 1 }).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("facebook feeds sent");
    res.json(docs);
  });
});
// 디시인사이드만 가져옴
router.get('/dcfeeds', (req, res) => {
  DCFeeds.find({ from: 2 }).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("dcinside feeds sent");
    res.json(docs);
  });
});
// 메인 페이지에서 setInterval을 사용하여 주기적으로 피드가 업데이트 되었는지 확인한다.
router.get('/updatefeeds', (req, res) => {
  ALLFeeds.find({}).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) throw err;
    // 저장되어있는 최신 생성 시간으로 정보가 업데이트 되어있는지 아닌지를 확인하는 구문
    let arr = [];
    console.log('mostRecentlyData: ', mostRecentlyData); //
    for(let i in docs) {
      if(docs[i].created_time > mostRecentlyData) {
        arr.push(docs[i]); // 최신 피드만 따로 저장한다.
      } else {
        mostRecentlyData = docs[0].created_time;
        console.log("End point of Updated Data");
        break; // 최신 피드 순으로 정렬되기 때문에, 오래된 피드를 만나면 함수 종료
      }
    }
    if(arr.length) {
      console.log(`${arr.length} new feeds updated!!`);
      res.json(arr);
    } else {
      console.log('feeds not updated');
      res.json({ hasUpdate: 'no' });
    }
  });
});


module.exports = router;
