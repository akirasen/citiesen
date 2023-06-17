#介绍
橙事英语-使用uniapp-uniCloud Serverless打造的英语学习微信小程序源码
开源地址：https://github.com/akirasen/citiesen
寻求帮助：微信公众号“造件师”或橙事英语小程序右下角提交客服消息
设计思路：
之前使用uniapp+koa2+graphql做了一个叫橙事粤语的微信小程序，我媳妇很喜欢，但那个小程序还是得用服务器来做后端。最近刚好在学习Serverless，于是就用Serverless为我媳妇重构了一下这个微信小程序，把学粤语改成了学英语。
Serverless是一种高弹性、分布式、低成本的架构，很适合屌丝全栈开发者，用过都说香，强烈推荐。我这个项目开发时图方便，是直接用了Hbuilder X集成的uniCloud-aliyun服务（本质上是阿里云EMASserverless）。
橙事英语的开发中，还做了一些橙事粤语没有的功能，比如考研英语刷题很实用的生词本。做阅读题遇到许多不认识的单词，直接拍照识别，并调用词典查询含义。将生词加入生词本，朗读生词读音。同时，还提供了生词练习功能，随机挑选生词本单词，在答案中选择中文含义帮助记忆。
而橙事粤语中本就有的功能也很好玩，比如点击右下角问号按钮随机学英语、比如按住说话按钮讲普通话，可以自动翻译为英语语音，之后可以练习英语发音，按住跟读按钮说英语，我自己做的打分算法会为您的跟读准确度打分。
账户体系沿用了橙事粤语的授权手机号就免费用三个月，付费可以升级黄金会员、白金会员等免广告等政策。用户转发分享可以邀请用户，每邀请一定数量的用户会自动发送推送通知，用户可以免费获得一个月黄金会员卡密。
相比于橙事粤语，橙事粤语也优化了AI数字人动画，不过因为微信视频自动播放限制，这边只能把视频转为GIF动画，在AI朗读时，AI头像播放数字人动画。
因为做生词本的时候需要词典，但大厂的API基本上都断供了，某道词典收30万一年，于是只好自己搜集做了一个词典数据库，共收集76814条词条，也部署了一个API供开发者调用：https://citiesen.bashe.cc/api/http/translate?word=city&limit=5，word字段填写单词进行模糊匹配，limit字段填写返回的条数。
此API需要在headers中传入Authorization:Bearer JWT参数，JWT密钥请在橙事英语小程序-我的页面复制。调用会消耗体验点数，规则与小程序会员规则一致。
这边也感谢fxsjy、skywind3000大佬的搜集，我这边对原始数据进行了处理，优化后的词典数据库也一并进行了开源。


#提前准备
1.uniapp-uniCloud云服务空间（阿里云）：Dcloud优化过的阿里云EMASserverless服务。获得云服务空间、地址，在小程序开发管理中绑定request合法域名:https://aip.baidubce.com;https//api.bspapp.com;https://api.next.bspapp.com;https://tcb-api.tencentcloudapi.com
2.微信小程序，需要认证，准备好KEY，阿里云服务请求地址等进行绑定；
3.微信商户号，与小程序绑定，申请V3证书；
4.在百度大脑申请OCR通用识别，新建应用，获得KEY

#相关文档
https://uniapp.dcloud.net.cn/uniCloud
https://ai.baidu.com/ai-doc/OCR/zk3h7xz52
https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html

#其他操作
1.uniCloud-aliyun/database 目录下所有DB Schema需要上传到云端；
2.在uniCloud网页端的dict-ec数据库，需要导入根目录的ecdictv2.csv数据库
3.uniCloud-aliyun/info添加公共模块：uni-subscribemsg、uni-sec-check、uni-id-common、uni-cloud-router
4.uniCloud-aliyun/info目录下npm i moment
5.uniCloud-aliyun/http添加公共模块：uni-id-common、uni-cloud-router
6.小程序的类目需要包括办公、信息查询。
7.申请以下两个模板，获取模板ID：
7.1 奖励到账通知：模板编号6913，字段包括：奖品名称{{thing10.DATA}}、活动主题{{thing1.DATA}}、过期时间{{date4.DATA}}、温馨提示{{thing9.DATA}}；
7.2 每日佳句通知：模板编号23947，字段包括：更新内容{{thing1.DATA}}、更新时间{{time2.DATA}}

#配置
## /pages/index/index.vue
第174行：XXXXXX为小程序订阅消息模板ID
```
 <view @tap="shares?shares=false:shares=true;giftcardShow=false;InvitationCount();subscribeMessage(['XXXXXXXXXXXXXXXXXXXXXX','XXXXXXXXXXXXXXXXXXXXXX'])" style="font-size: 22rpx;color:#FFA800;font-weight: 300;">
```
第1083行：修改默认介绍
```
 translated: "Hello everyone, I am English assistant Jenny. You can press and hold the 'Speak' button below and speak to me in Chinese. I will help you translate it into English."
```
## /manifest.json
第3行：uni-app应用标识
```
 "appid" : "__UNI__6DC00D1",
```
第53行：小程序id
```
"appid" : "wx9xxxxxxxxxx2e",
```
## uniCloud-aliyun/cloudfunctions/auth-token-db/index.js
第3-5行：以下改为百度大脑OCR应用KEY
```
 const platform = 'citiesenbaidubce'
 const client_id = 'XXXXXXXXXX'
 const client_secret = 'XXXXXXXXXX'
```
## uniCloud-aliyun/cloudfunctions/common/uni-config-center/uni-id/config.json
第9-10行：以下改为自定义加密用随机字符串
```
  "tokenSecret": "xxxxxxxxx", 
  "requestAuthSecret": "xxxxxxxxx", 
```
第54-61行：dcloudAppid改为manifest.json中的uni-app应用标识，"appid"、"appsecret"改为微信小程序KEY
```
  "dcloudAppid": "__UNI__XXXXXXXX", 
  "mp-weixin": {
    "tokenExpiresIn": 259200,
    "tokenExpiresThreshold": 86400,
    "oauth": {
      "weixin": {
		"appid": "xxxxxxxxx",
		"appsecret": "xxxxxxxxx"
		
      }
    }
  },
```
## uniCloud-aliyun/cloudfunctions/common/uni-config-center/uni-open-bridge/config.json
第3行：以下改为manifest.json中的uni-app应用标识
```
  "__UNI__xxxxxxxxx": {
```
## uniCloud-aliyun/cloudfunctions/common/uni-config-center/uni-pay/config.json

第5-9行：notifyUrl是支付成功后的服务空间和回调地址，需要绑定空间后绑定域名，再来填写。notifyKey自行填写随机字符串。
```
"notifyUrl": {		
	"mp-XXXXXX-XXXXXX-XXXXX-XXXXX-XXXXXXXX": "https://xxxxx.xxxxx.cn/uni-pay-co",
},
"notifyKey":"XXXXXXXXXXXXXXXXXXXXXXX", 

```
第14-24行：填写小程序KEY和商户id，需要在商户平台申请下载V3 KEY证书放置在相应目录
```
"mp": {
	"appId": "XXXXXXXXXXXXXXXXXXXXXXX", // 小程序的appid 
	"secret": "XXXXXXXXXXXXXXXXXXXXXXX", // 小程序的secret
	"mchId": "1600000000", // 商户id 
	"key": "XXXXXXXXXXXXXXXXXXXXXXX", // v2的api key
	"pfx": fs.readFileSync(__dirname + '/wxpay/apiclient_cert.p12'), // v2需要用到的证书
	"v3Key": "XXXXXXXXXXXXXXXXXXXXXXX", // v3的api key 
	"appCertPath": path.join(__dirname, 'wxpay/apiclient_cert.pem'), // v3需要用到的证书
	"appPrivateKeyPath": path.join(__dirname, 'wxpay/apiclient_key.pem'), // v3需要用到的证书
	"version": 3, // 启用支付的版本 2代表v2版本 3 代表v3版本
},
```
## uniCloud-aliyun/cloudfunctions/uni-pay-co/notify/appleiap.js
这里写了充值后执行的逻辑，一般无需修改。里面会引用前端共用的售价配置文件，在：
## uniCloud-aliyun/cloudfunctions/http/service/http.js
第53行起：
hundred是百句系列，可以预设一些英语常用句子，前端点右下角的问号会自动随机输入。
membership是售价设置，可自行修改。单位是分。
membership.general.rewardValue是邀请多少的用户送会员参数。
yingyuAds是随机出现的广告，可自行修改。
randomAvators是随机头像，需要自行准备并上传到云存储，链接填在这里。
randomNames是随机昵称的三段元素。
aiAvatar是随机AI头像及对应的GIF动画
setting是全局调用的皮肤设置，理论上为了减小包或是换多套皮肤，可以把前端的元素都用参数配置

