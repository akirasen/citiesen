'use strict';
const db = uniCloud.database(); //代码块为cdb
const platform = 'citiesenbaidubce'
const client_id = 'XXXXXXXXXX'
const client_secret = 'XXXXXXXXXX'
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let apiUrl = 'https://aip.baidubce.com/oauth/2.0/token?client_id='+client_id+'&client_secret='+client_secret+'&grant_type=client_credentials'
	let res = await uniCloud.httpclient.request(apiUrl, {
		method: 'POST',
		data: {
		},  
		dataType: 'json' // 指定返回值为json格式，自动进行parse  
	});
	const tokeninfo = await db.collection('auth-data').where({'platform':platform}).get()
	if(tokeninfo.data.length > 0){
		//返回数据给客户端		
		const tokenupdate = await db.collection('auth-data').where({'platform':platform}).update({
			refresh_token:res.data.refresh_token,
			expires_in:res.data.expires_in,
			session_key:res.data.session_key,
			access_token:res.data.access_token,
			scope:res.data.scope,
			session_secret:res.data.session_secret,
			platform:platform,
			detail:res.data,
			last_update_date:new Date()
		})
		return tokenupdate
	}else{
		const tokenadd = await db.collection('auth-data').add({
			refresh_token:res.data.refresh_token,
			expires_in:res.data.expires_in,
			session_key:res.data.session_key,
			access_token:res.data.access_token,
			scope:res.data.scope,
			session_secret:res.data.session_secret,
			platform:platform,
			detail:res.data,
			last_update_date:new Date()
		})
		return tokenadd
	}
};
