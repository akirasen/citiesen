const { Service } = require("uni-cloud-router");
const uniID = require('uni-id-common')
const UniSubscribemsg = require('uni-subscribemsg');
const moment = require('moment'); 
// 引入uni-sec-check公共模块
const UniSecCheck = require('uni-sec-check');
const db = uniCloud.database(); //代码块为cdb

module.exports = class AppService extends Service {
	makeRandomPassword(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
		  result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
		}
		return result;
	}
	/**
	 * 获取2个字符串的相似度
	 * @param {string} str1 字符串1
	 * @param {string} str2 字符串2
	 * @returns {number} 相似度 
	 */
	getSimilarity(str1,str2) {
		let sameNum = 0
		//寻找相同字符
		for (let i = 0; i < str1.length; i++) {
			for(let j =0;j<str2.length;j++){
				if(str1[i]===str2[j]){
					sameNum ++ 
					break
				}
			}
		}
		// console.log(str1,str2);
		// console.log("相似度",(sameNum/str1.length) * 100);
		//判断2个字符串哪个长度比较长
		let length = str1.length > str2.length ? str1.length : str2.length
		return ((sameNum/length) * 5).toFixed(1) || 0
	}
	async CompareText(ctx){
		const userid = ctx.auth.uid;
		const id = ctx.data.id
		const text = ctx.data.text		
		const vasinfo = await db.collection('vasusage').where({'current_owner':ctx.auth.uid}).get()
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
					console.log("vasusageUpdate::",vasusageUpdate)
				}
			}
			else if(vasusage[0].type == 'vip2'){
				if(vasusage[0].expiration_time<new Date()){
					return {succeed:false,reason:'会员已过期，请升级'}
				}
			}
		}
		// console.log("vasusage::",vasusage)
		const taskinfo = await db.collection('translatetask').where({'_id':id}).get()
		const task = taskinfo.data[0]
		// const task = await strapi.entityService.findOne('api::translatetask.translatetask',id,{})
		const compare = this.getSimilarity(task.translated.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
		''),text.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
		''))
		let compareScore = compare
		// console.log('compare',task.translated,text,compareScore)		
		// if(compareScore>2&&compareScore<4){
		// 	//加分，修正
		// 	compareScore = compareScore + 1
		// }
		const score = await db.collection('readingscore').where({'taskid':id,'user':userid}).get()
		// console.log('comparescore',score)
		
		if(score.data.length == 0){
			const newscore = await db.collection('readingscore').add({
				translate_task: id,
				user:userid,
				taskid: id,
				score: "0",
				create_date:new Date(),
				last_update_date:new Date()
			})
			
			return {succeed:true,reason:'当前分数···',compare:compareScore,currentCompare:compareScore}
		}else{
			// return {succeed:false,reason:'测试',score,compareScore}
			// console.log('Delete',await strapi.service('api::translatetask.translatetask').AliOSSDelete(filename))
			if(parseFloat(score.data[0].score)<parseFloat(compareScore)||!score.data[0].score){
				const updatescore = await db.collection('readingscore').where({'_id':score.data[0]._id}).update({
					score:compareScore,
					last_update_date:new Date()
				})
				return {succeed:true,reason:'当前分数···',compare:compareScore,currentCompare:compareScore}
			}else{
				return {succeed:true,reason:'当前分数··',compare:score[0].data[0].score,currentCompare:compareScore}
			}
		}
	}
	async multTransDel(ctx){
		 const userid = ctx.auth.uid;
		 ctx.data.transList.forEach(async (item,index)=>{
			 const updatescore = await db.collection('readingscore').where({'_id':item}).update({
				user:null,
			 	last_update_date:new Date()
			 })
		 })
		 return {succeed:true,reason:'已删除相关翻译',delList:ctx.data.transList}
	}
	async translate(ctx){
	    const userid = ctx.auth.uid;
	    const body = ctx.data	
		const taskinfo = await db.collection('translatetask').where({'source_text':body.text}).get()	
		const task = taskinfo.data
		const vasinfo = await db.collection('vasusage').where({'current_owner':ctx.auth.uid}).get()
		let vasusage = vasinfo.data
		// return {succeed:false,reason:"测试",userid,body,taskinfo,task,vasinfo,vasusage}//
	    if(vasusage.length > 0){
	        if(vasusage[0].type == 'vip1' || vasusage[0].type == 'trial'){
	            if(vasusage[0].available_limit<=0){
	                return {succeed:false,reason:'体验点不足，请升级会员',vasusage:vasusage[0]}
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
	    // console.log("vasusage::",vasusage)
	    if(task.length>0){
	        const ownersIndex = task[0].owners.findIndex((item) => {return item === userid})			
	        if(ownersIndex==-1){
	            let newOwners = []
	            task[0].owners.forEach(item=>{
	                newOwners.push(item)
	            })
	            newOwners.push(userid)
				const updateTask = await db.collection('translatetask').where({'_id':task[0]._id}).update({
					owners:newOwners,
					last_update_date:new Date()
				})
				// return {succeed:false,reason:"测试",ownersIndex,task,vasusage,updateTask}
	            // delete updateTask.data[0].owners	
				const newscore = await db.collection('readingscore').add({
					translate_task: task[0]._id.toString(),
					user:userid,
					taskid: task[0]._id.toString(),
					create_date:new Date(),
					score: "0",
					last_update_date:new Date()
				})
	            return {succeed:true,reason:'匹配到其他人翻译过的',translate:task[0],vasusage:vasusage[0],score:newscore}
	        }
	        else{
				// 				
	            delete task[0].owners            
				const score = await db.collection('readingscore').where({'taskid':task[0]._id,'user':userid}).get()
				// return {succeed:true,reason:'score',score:score.data}
	            if(score.data.length>0){
					const updatescore = await db.collection('readingscore').where({'_id':score.data[0]._id}).update({
						last_update_date:new Date()
					})
	                return {succeed:true,reason:'匹配到你翻译过的',translate:task[0],vasusage:vasusage[0],score:score.data}
	            }else{
					const newscore = await db.collection('readingscore').add({
						translate_task: task[0]._id.toString(),
						user:userid,
						taskid: task[0]._id.toString(),
						create_date:new Date(),
						score: "0",
						last_update_date:new Date()
					})					
	                const score = await db.collection('readingscore').where({'_id':newscore.id}).get()
	                return {succeed:true,reason:'匹配到你翻译过的',translate:task[0],vasusage:vasusage[0],score:score.data}
	             }
	        }
	    }else{
	        // const t2t = await strapi.service('api::translatetask.translatetask').TranslateGeneral(body.text,body.source,body.target)
	        let newData = {
	            source_text:body.text,
	            source_language:body.source,
	            target_language:body.target,
	            owners:[userid],
	            translated:body.translated,
	            word_count:body.wordCount,
				show_source_text:true,
				create_date:new Date(),
				last_update_date:new Date()
	        }
			 
			const taskAdd = await db.collection('translatetask').add(newData)			
			const taskinfo = await db.collection('translatetask').where({'_id':taskAdd.id}).get()
			const newscore = await db.collection('readingscore').add({
				translate_task: taskAdd.id.toString(),
				user:userid,
				taskid: taskAdd.id.toString(),
				create_date:new Date(),
				score: "0",
				last_update_date:new Date()
			})	
	        return  {succeed:true,reason:'新翻译',translate:taskinfo.data[0],vasusage:vasusage[0],score:newscore}
	    }
	}
	async verifiGiftCard(ctx){
		const userid = ctx.auth.uid;
		const findGiftCard = await db.collection('gift_card').where({code:ctx.data.code}).get();		
		if(findGiftCard.data.length>0){
			if(!findGiftCard.data[0].create_date){
				if(findGiftCard.data[0].expiration_time<new Date()){
					// console.log({succeed:false,reason:'礼品卡已过期',info:findGiftCard.data[0]})
					return {succeed:false,reason:'礼品卡已过期'}
				}
				else{
					const updateGiftCard = await db.collection('gift_card').where({_id:findGiftCard.data[0]._id}).update({
						owner:userid,
						create_date:new Date(),
						state:1
					});
					let vasusage_ids = []
					if(ctx.auth.vasusage_ids){
						vasusage_ids = ctx.auth.vasusage_ids
					}
					const vasIntial =  await this.valueAddedServicesIntial(ctx.auth.uid,vasusage_ids,findGiftCard.data[0].level)
					// const vasIntial =  await this.valueAddedServicesIntial(ctx,findGiftCard.data[0].level)
					console.log({succeed:true,reason:'礼品卡已激活',info:updateGiftCard,vas:vasIntial})
					return {succeed:true,reason:'礼品卡已激活',info:updateGiftCard,vas:vasIntial}
				}
			}else{
				console.log( {succeed:false,reason:'礼品卡已被使用过',info:findGiftCard[0]})
				return {succeed:false,reason:'礼品卡已被使用过'}
			}
		}else{
			console.log({succeed:false,reason:'礼品卡号有误',info:findGiftCard[0]})
			return {succeed:false,reason:'礼品卡号有误'}
		}
	}
	async userinfo(ctx){
		const userid = ctx.auth.uid;
		const user = await db.collection('uni-id-users').where({_id:userid}).get();
		delete user.data[0].third_party
		return {succeed:true,user:user.data[0]}
	}
	async sponsorRefresh(ctx){
		const userid = ctx.auth.uid;
		const openid = ctx.auth.openid;
		const appinfo = await uniCloud.callFunction({name: 'http',data: {action: 'http/appinfo',data: {}}})
		const promotionToGiftcardCount = appinfo.result.data.membership.general.rewardValue
		let invitercount = {total:0}
		if(ctx.auth.inviter_uid){
			invitercount = await db.collection('uni-id-users').where({inviter_uid:ctx.auth.inviter_uid}).count()
			if(invitercount.total % promotionToGiftcardCount === 0){
				const codes = await this.GenerateGiftCard(ctx.auth.inviter_uid,"vip1",1,new Date(moment().add(6, 'months')),"橙事英语黄金VIP","邀请好友送的礼品卡")
				const inviterOpenid = await db.collection('uni-id-users').where({_id:ctx.auth.inviter_uid}).get()
				let uniSubscribemsg = new UniSubscribemsg({
					dcloudAppid: "__UNI__1C80008",
					provider: "weixin-mp", // 注意，这里是weixin-mp
				});
				// 发送订阅消息
				let res = await uniSubscribemsg.sendSubscribeMessage({
					touser: inviterOpenid.data[0].wx_openid.mp,
					template_id: "k356yYwYq9SfZfbe-vtNWDqzf7Wk0_70Nj0enm_z9b4",
					page: "pages/index/index?showme=true", // 小程序页面地址
					miniprogram_state: "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
					lang: "zh_CN",
					data: {
			            "thing10": {
			              "value": "橙事英语黄金VIP"
			            },
			            "thing1": {
			              "value": "和"+promotionToGiftcardCount+"位好友组队获得的礼品卡密见温馨提示"
			            },
			            "date4": {
			              "value": moment().add(6, 'months').format("YYYY.MM.DD HH:mm:ss")
			            },
			            "thing9": {
			              "value": codes.toString()
			            }
			        }
				});
				return {succeed:true,reason:"发券成功",res}
			}			
		}
		else{
			return {succeed:true,reason:"非被邀请用户"}
		}
	}
	async GenerateGiftCard(issuer,level,limit,ExpirationTime,desc,memo){		
		let codes = []
		for(let i = 0;i < limit; i++){
			let randomPass = this.makeRandomPassword(10);
			const createGiftCard = await db.collection('gift_card').add({
				code:randomPass,
				level:level,
				desc:desc,
				memo:memo,
				expiration_time:ExpirationTime,
				issuer:issuer
			});
			codes.push(randomPass)
			if(codes.length == limit){
				console.log(codes)
				return codes
			}
		}
	}
	
	async valueAddedServicesIntial(owner,vasusage_ids,level){//ctx,level)
		//开会员逻辑，礼品卡、充值共用
		// const owner = ctx.auth.uid		
		// let vasusage_ids = []
		// if(ctx.auth.vasusage_ids){
		// 	vasusage_ids = ctx.auth.vasusage_ids
		// }
		let vas = {
			level,
			owner
		}
		vas.current_owner = owner
		if(level=="trial"){
			vas.expiration_time = new Date(moment().add(3, 'months'))
			vas.type = "trial"
			vas.level = "0"
			vas.create_date = new Date()
			vas.available_limit = 1000
			vas.totallimit = 1000
		}
		else if(level=="vip1"){
			vas.expiration_time = new Date(moment().add(1, 'months'))
			vas.type = "vip1"
			vas.level = "1"
			vas.create_date = new Date()
			vas.available_limit = 1000
			vas.totallimit = 1000
		}
		else if(level=="vip2"){
			vas.expiration_time = new Date(moment().add(1, 'months'))
			vas.type = "vip2"
			vas.level = "2"
			vas.create_date = new Date()
			vas.available_limit = null
			vas.totallimit = null
		}
		else if(level=="vip3"){
			vas.expiration_time = null
			vas.type = "vip3"
			vas.level = "3"
			vas.create_date = new Date()
			vas.available_limit = null
			vas.totallimit = null
		}
		const createVas = await db.collection('vasusage').add(vas);
		vasusage_ids.push(createVas.id)
		const profileChange = await db.collection('uni-id-users').where({_id:owner}).update({
			current_vasusage_level:level,
			current_vasusage_id:createVas.id,
			vasusage_ids:vasusage_ids
		});
		return createVas
	}
	async nicknameSet(ctx){
		const body = ctx.data
		const userid = ctx.auth.uid;
		const openid = ctx.auth.openid;
		if(openid){//若用户已绑定微信
			// 初始化实例
			const uniSecCheck = new UniSecCheck({
				provider: 'mp-weixin',
				requestId: ctx.context.requestId,// 云函数内则写 context.requestId 云对象内则写 this.getUniCloudRequestId()
			});
			const checkRes = await uniSecCheck.textSecCheck({
				content: body.nickname, // 文本内容，不可超过500KB
				openid: openid, // 用户的小程序openid
				scene: 1, // 场景值
				version: 2, // 接口版本号
			});
			 if(checkRes.result.suggest=='pass'){
				// console.log("AI内容审核建议为放行PASS::")
				const profileChange = await db.collection('uni-id-users').where({_id:userid}).update({
					avatar:body.avatar,
					nickname:body.nickname
				});
				return {succeed:true}
			}
			else{//若未审核通过
				let labelReason = ""
				if(checkRes.result.label == 10001){
					labelReason = "广告"
				}
				else if(checkRes.result.label == 20001){
					labelReason = "时政"
				}
				else if(checkRes.result.label == 20002){
					labelReason = "色情"
				}
				else if(checkRes.result.label == 20003){
					labelReason = "辱骂"
				}
				else if(checkRes.result.label == 20006){
					labelReason = "违法犯罪"
				}
				else if(checkRes.result.label == 20008){
					labelReason = "欺诈"
				}
				else if(checkRes.result.label == 20012){
					labelReason = "低俗"
				}
				else if(checkRes.result.label == 20013){
					labelReason = "版权"
				}
				else if(checkRes.result.label == 21000){
					labelReason = "其他"
				}
				return {succeed:false,reason:"因涉及"+labelReason+",微信审核未通过"}
			}

		}    
		else{//若用户未绑定微信
			return {succeed:false,reason:"请先绑定微信"}
		}
	}
	async avatarSetWithOutCheck(ctx){
		const body = ctx.data
		const userid = ctx.auth.uid;
		const profileChange = await db.collection('uni-id-users').where({_id:userid}).update({
			avatar:body.avatar,
			avatar_in_pending:null
		});
		return {succeed:true,reason:"头像设置成功"}
	}
	async avatarSet(ctx){
		const body = ctx.data		
		const userid = ctx.auth.uid;
		const openid = ctx.auth.openid;
		const appinfo = await uniCloud.callFunction({
				name: 'http',
				data: {
					action: 'http/appinfo',
					data: {}
				}
		})
		const randomAvators = appinfo.result.data.randomAvators
		// const randomAvators = this.appinfo().data.randomAvators
		const avatarIndex = randomAvators.findIndex((item) => {return item === body.avatar})		
		if(avatarIndex > -1){//如果是随机头像的一员，无需审核
			const profileChange = await db.collection('uni-id-users').where({_id:userid}).update({
				avatar:body.avatar,
				avatar_in_pending:null
			});
			return {succeed:true,reason:"头像设置成功"}
		}
		else{//不是随机头像，进入审核流程
			if(openid){//若用户已绑定微信
				// 初始化实例
				const profileChange = await db.collection('uni-id-users').where({_id:userid}).update({
					avatar_in_pending:body.avatar
				});
				const uniSecCheck = new UniSecCheck({
					provider: 'mp-weixin',
					// requestId:this.getUniCloudRequestId()
					requestId: ctx.context.requestId, // 云函数内则写 context.requestId 云对象内则写 this.getUniCloudRequestId()
				});
				const checkRes = await uniSecCheck.imgSecCheck({
					image: body.avatar, // 图片文件url或图片cloudID
					openid: openid, // 用户的openid
					scene: 1, // 场景值
					version: 2 // 接口版本号
				});
				const addCheckMission = await db.collection('citiesen-wechat-media-check').add({
					trace_id:checkRes.trace_id,
					innerscene:"avatar",
					connection_id:userid,
					wxscene:1,
					openid: openid,
					media_url:body.avatar
				});
				return {succeed:true,reason:"新头像已提交审核",checkRes,addCheckMission}
			}
			else{//若用户未绑定微信
				return {succeed:false,reason:"请先绑定微信"}
			}
		}
	}
};