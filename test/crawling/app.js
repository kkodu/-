var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mg_config = require('./config/mg-config.json');
var router = require('./routes/index');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

var run = http.createServer(app);

// Facebook dev에서 커스텀한 포트 연결을 위한 30000 포트 지정
run.listen(30000, function(error) {
  console.log("Express server listening on port 30000");
});

// mongoose 커넥션 객체 사용
var conn = mongoose.connection;
mongoose.Promise = global.Promise;

// 이벤트 드리븐.. 연결 시 오류가 발생할 시 이벤트 호출
conn.on("error", console.error.bind(console, "mongoose connection error:"));
// 사용자 db로 접속..
conn.openUri(`mongodb://${mg_config.userId}:${mg_config.userPass}@${mg_config.userLocal}/${mg_config.db}`);

// 디비 연결이 성공적으로 연결될 시 한 번만 실행된다.
conn.once("open", function() {
  console.log("mongoose connect successfully..");
});

app.set('view engine', 'ejs');
app.use(router);
