// 'use strict';
// exports.main = async (event, context) => {
// 	//event为客户端上传的参数
// 	console.log('event : ', event)
	
// 	//返回数据给客户端
// 	return event
// };
// index.js (通常无需改动)做
const Router = require("uni-cloud-router").Router; // 引入 Router
const router = new Router(require("./config.js")); // 根据 config 初始化 Router
exports.main = async (event, context) => {
  return router.serve(event, context); // 由 Router 接管云函数
};