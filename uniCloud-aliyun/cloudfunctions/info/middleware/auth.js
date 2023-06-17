const uniID = require('uni-id-common')
const db = uniCloud.database(); 
module.exports = () => {
  // 返回中间件函数
  return async function auth(ctx, next) {
	const uniIDIns = uniID.createInstance({ // 创建uni-id实例
		context: ctx
	})
    const auth = await uniIDIns.checkToken(ctx.event.uniIdToken);
    if (auth.code) {
      // 校验失败，抛出错误信息
      throw { code: auth.code, message: auth.message };
    }    	
	ctx.auth = auth // 设置当前请求的 auth 对象
	const user = await db.collection('uni-id-users').where({_id:auth.uid}).get();//查询当前用户的openid
	ctx.auth.openid = user.data[0].wx_openid.mp	//在auth中插入openid
	if(user.data[0].vasusage_ids){
		ctx.auth.vasusage_ids = user.data[0].vasusage_ids
	}
	if(user.data[0].inviter_uid){
		ctx.auth.inviter_uid = user.data[0].inviter_uid[0]
	}
    await next(); // 执行后续中间件
  };
};