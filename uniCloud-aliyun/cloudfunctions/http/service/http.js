const { Service } = require("uni-cloud-router");
const uniID = require('uni-id-common')
const db = uniCloud.database();
module.exports = class httpService extends Service {
	async translate(ctx){
		if(!ctx.event.headers.authorization){
			return {succeed:false,reason:'此API需要在headers中传入Authorization:Bearer JWT参数，JWT密钥请在橙事英语小程序-我的页面复制。调用会消耗体验点数，规则与小程序会员规则一致。'}
		}		
		const uniIDIns = uniID.createInstance({ // 创建uni-id实例
			context: ctx
		})
		const auth = await uniIDIns.checkToken(ctx.event.headers.authorization.split(' ')[1]);
		if (auth.code) {
		  // 校验失败，抛出错误信息
		  throw { code: auth.code, message: auth.message };
		}else{
			const word = ctx.event.queryStringParameters.word
			const limit = parseInt(ctx.event.queryStringParameters.limit)
			const user = await db.collection('uni-id-users').where({_id:auth.uid}).get();
			if(!user.data[0].current_vasusage_id){
				return {succeed:false,reason:'需要至少授权体验会员'}
			}
			const vasinfo = await db.collection('vasusage').where({_id:user.data[0].current_vasusage_id}).get();
			const vasusage = vasinfo.data
			if(vasusage.length > 0){
				if(vasusage[0].type == 'vip1' || vasusage[0].type == 'trial'){
					if(vasusage[0].available_limit<=0){
						return {succeed:false,reason:'体验点不足，请升级会员'}
					}
					else if(vasusage[0].expiration_time<new Date()){
						return {succeed:false,reason:'会员已过期，请升级'}
					}
					else{
						const vasusageUpdate = await db.collection('vasusage').where({'_id':vasusage[0]._id}).update({
							available_limit:vasusage[0].available_limit - 1,
							last_update_date:new Date()
						})					
					}
				}
				else if(vasusage[0].type == 'vip2'){
					if(vasusage[0].expiration_time<new Date()){
						return {succeed:false,reason:'会员已过期，请升级'}
					}
				}
			}
			const dict = await db.collection('dict-ec').where({en: new RegExp('^'+word, 'i')}).limit(limit).get()			
			return {succeed:true,reason:'匹配到相关单词',word,words:dict.data}
		}
	}
	appinfo() {
		return {
			data: {
				hundred:[
					"天才只意味着终身不懈地努力",
					"凡是决心取得胜利的人是从来不说‘不可能的’",
					"没有伟大的意志力，便没有雄才大略。",
					"生命不止，奋斗不息。",
					"强者能同命运的风暴抗争。",
					"生活没有目标，犹如航海没有罗盘。",
					"过一种高尚而诚实的生活。当你年老时回想起过去，你就能再一次享受人生。",
					"接受过去和现在的模样，才会有能量去追寻自己的未来。",
					"每个成功者的后面都有很多不成功的岁月。",
					"充实今朝，昨日已成过去，明天充满神奇。",
					"成功的秘密在于始终如一地忠于目标。"
				],
				membership:{
				  vip1: {
					"desc": "黄金VIP：1.有效期1个月；2.体验点上限1000，使用小程序消耗体验点，到期需再次兑换黄金VIP，点数耗尽需兑换白金VIP才能继续用；3.将不再插播广告，若有需要请说“领取福利”",
					"name": "黄金VIP",
					"goods": "2",
					"nexttype": "vip2",
					"currentprice": 300,
					"price": 500,
					"nextbtn": "5元升级白金VIP",
					"orderdesc": "橙事英语白金VIP/月",
					"market_price": 500,
					"nextshortdesc": "每月无限体验点"
				  },
				  vip2: {
					"desc": "白金VIP：1.有效期1个月；2.无体验点上限，到期需再次兑换黄金VIP才能继续用；3.将不再插播广告，若有需要请说“领取福利”",
					"name": "白金VIP",
					"goods": "3",
					"nexttype": "vip3",
					"currentprice": 500,
					"price": 29900,
					"nextbtn": "299元升终身白金VIP",
					"orderdesc": "橙事英语终身白金VIP会员",
					"market_price": 29900,
					"nextshortdesc": "升级送爱奇艺黄金或芒果PC年卡"
				  },
				  vip3: {
					"desc": "终身白金VIP：1.无有效期和体验点限制，只要小程序在就能一直用；2.赠送一年爱奇艺黄金VIP或芒果PC，下单后将会发送礼品链接，选好并填写平台绑定手机号后自动充值；4.将不再插播广告，若需要请说“领取福利”",
					"currentprice": 29900,
					"name": "终身白金VIP会员",
					"nextbtn": "商业合作",
					"nextshortdesc": "若有需要请联系"
				  },
				  trial: {
					"desc": "体验会员：1.有效期3个月注册即送；2.体验点上限1000使用功能时消耗，到期或点数耗尽需兑换黄金VIP才能继续用；3.为维持免费体验而插播了外卖代金券、消费红包等广告，使用后能帮忙分担研发运营成本",
					"name": "体验会员",
					"goods": "1",
					"nexttype": "vip1",
					"price": 300,
					"nextbtn": "3元升级黄金VIP",
					"orderdesc": "橙事英语黄金VIP/月",
					"market_price": 300,
					"nextshortdesc": "尊享去广告、额度月清等特权"
				  },
				  general: {
					"freeUpgrade": "免费升级",
					"rewardValue": 20,
					"upgradeNotice": [
					  "邀请好友一起学习，每",
					  "人送您黄金VIP/月"
					],
					"currenciesNotice": [
					  "您的小队已有",
					  "人"
					],
					"giftcardRedemption": "礼品卡兑换"
				  }
				},
				yingyuAds:[
				  {
					"desc": "因重大更新跟读功能上线，6月1日前的翻译记录已清空，同时，所有老用户的体验点数将重置为1000次",
					"title": "跟读AI评分学英语",
					"picurl": "../../../../static/ad1.jpg",
					"actived": true,
					"showpic": true,
					"showtitle": true,
					"onetime": true,
					"sn":"yueyu1.0.5",
					"color":"#78b65f"
				  },
				  {
					"desc": "广告收入用于研发运营成本",
					"title": "截图识别领取福利",
					"picurl": "../../../../static/ad2.jpg",
					"actived": true,
					"showpic": true,
					"showtitle": true,
					"onetime": false,
					"sn":"general001",
					"color":"#1a46fe"
				  },
				  {
					"desc": "广告收入用于研发运营成本",
					"title": "截图识别领取福利",
					"picurl": "../../../../static/ad3.jpg",
					"actived": true,
					"showpic": true,
					"showtitle": true,
					"onetime": false,
					"sn":"general002",
					"color":"#f87d10"
				  },
				  {
					"desc": "广告收入用于研发运营成本",
					"title": "截图识别领取福利",
					"picurl": "../../../../static/ad4.jpg",
					"actived": true,
					"showpic": true,
					"showtitle": true,
					"onetime": false,
					"sn":"general002",
					"color":"#344b7a"
				  },
				  {
					"desc": "广告收入用于研发运营成本",
					"title": "截图识别领取福利",
					"picurl": "../../../../static/ad5.jpg",
					"actived": true,
					"showpic": true,
					"showtitle": true,
					"onetime": false,
					"sn":"general002",
					"color":"#e14d25"
				  }
				],
				randomAvators:[
				  "https://mp-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.cdn.bspapp.com/cloudstorage/xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.jpg"
				],
				randomNames:{
					  theAnd: [
						"的",
						"の",
						"之",
						"滴",
						"的"
					  ],
					  fristName: [
						"挑战神话",
						"至尊奶爸",
						"圣光之力",
						"斑驳夜色",
						"天爱不哭",
						"黎明祈愿",
						"亡魂之曲",
						"指尖浪漫",
						"星星少女",
						"神圣戒律",
						"摩西祷言",
						"圣光之愿",
						"银月漫步",
						"清水静香",
						"超级奶霸",
						"神圣审判",
						"黑暗之光",
						"救赎之魂",
						"血仍未冷",
						"孤寂精灵",
						"回憶僅此",
						"情已饋爛",
						"年輕伏筆",
						"变身派对",
						"洪荒少女",
						"感性诗人",
						"獨一無二",
						"耳边搁浅",
						"几折荒年",
						"隐隐作痛",
						"鱼死海枯",
						"空巷旧梦",
						"梦悔匆匆",
						"此生不遇",
						"曲散人离",
						"孤伤未赏",
						"夙兴夜寐",
						"一纸荒凉",
						"怪我多虑",
						"自欺欺人",
						"走过孤独",
						"習慣假裝",
						"寄信给風",
						"梦该遗忘",
						"命里缺你",
						"易燃物品",
						"发呆想你",
						"草莓网友",
						"想哭就笑",
						"手黑群众",
						"浪漫因子",
						"我保护你",
						"月色入户",
						"人间春色",
						"平安经年",
						"风月佳人",
						"风月醉心",
						"懒得取名",
						"佛系少男",
						"佛系心情",
						"佛系喜欢",
						"佛系玩家",
						"熊猫妹妹"
					  ],
					  secondaryName: [
						"背叛者",
						"卷帘人",
						"瞎掺和",
						"醉成瘾",
						"薄春衫",
						"旧胡同",
						"艳遇记",
						"深拥着",
						"爱片段",
						"酒半尊",
						"清风酿",
						"扰清闲",
						"沙场战",
						"饮风骨",
						"叩重门",
						"烈酒伴",
						"旧戏书",
						"盼还乡",
						"将进酒",
						"衣衫酒",
						"路尽头",
						"别惹我",
						"冷邀月",
						"韩冰轩",
						"冰智轩",
						"算你狠",
						"伊人梦",
						"井中月",
						"欢乐多",
						"诉衷情",
						"戲孓噫",
						"梦成真",
						"不遇海",
						"忆失彼",
						"两颗心",
						"海于咸",
						"小少年",
						"念心安",
						"末尾曲",
						"呓语声",
						"泣鱼念",
						"小低调",
						"雪莲花",
						"半粒糖",
						"蔚蓝心",
						"小澎湃",
						"小疯狂",
						"浅浮伤",
						"红颜殆",
						"小情操",
						"萎缩胖",
						"花满蹊",
						"醉冷秋",
						"泪如雪",
						"竹林风",
						"凉笙歌",
						"梦沫惜",
						"梵音暖",
						"雪舞兮",
						"天涯逸",
						"苍瑾忧",
						"师千舞",
						"兰晓曦",
						"终成空",
						"绝里花",
						"夜琴灵",
						"桐木琴",
						"雪霓裳",
						"川芙蓉"
					]
				},
				aiAvatar:[
					["../../static/avatar01.png","../../static/avatar01.gif"],
					["../../static/avatar02.png","https://mp-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.cdn.bspapp.com/cloudstorage/xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.gif"],
					["../../static/avatar03.png","https://mp-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.cdn.bspapp.com/cloudstorage/xxxxx-xxxxx-xxxxx-xxxxx-xxxxx.gif"]
				],
				setting:{
					mainColor: "#014c46",
					secondColor: "#FFA800",
					avatarMaskColor: "rgba(255,255,255,0.7)",
					editBtnLinearGradient: "to right,rgba(34,60,82,0.8), rgba(34,79,82,0.8)",
					btnBackgroundColor:"rgba(255,168,0,0.3)"
				}
			}
		};
	}
}