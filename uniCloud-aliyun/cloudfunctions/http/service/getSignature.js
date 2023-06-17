const crypto = require('crypto')
//用于微信推送消息鉴权计算，此token参与计算需要与微信提供的signature一致
const wxPushToken = "XXXXXXXXXXXX"
const wxPushEncodingAESKey = "XXXXXXXXXXXX"

function getSignature (token, timestamp, nonce, msgEncrypt) {
	const str = [token, timestamp, nonce, msgEncrypt].sort().join('')
	return crypto.createHash('sha1').update(str).digest("hex")
}

function PKCS7Decode(buf) {
	let padSize = buf[buf.length - 1]
	return buf.slice(0, buf.length - padSize)
}
function decryptMsg (encodingAESKey, msgEncrypt) {
	const key = Buffer.from(encodingAESKey + '=', 'base64')
	const iv = key.slice(0, 16)
		
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	decipher.setAutoPadding(false)

	let deciphered = Buffer.concat([decipher.update(msgEncrypt, 'base64'), decipher.final()])

	deciphered = PKCS7Decode(deciphered)

	const content = deciphered.slice(16)
	const length = content.slice(0, 4).readUInt32BE(0)

	return {
		message: JSON.parse(content.slice(4, length + 4).toString()),
		appId: content.slice(length + 4).toString()
	}
}
module.exports = function (event, context) {
	const {msg_signature: msgSignature} = event.queryStringParameters
	const body = JSON.parse(event.body)
	console.log('event:',event)
	let result = body
	// 消息解密
	if (body.Encrypt) {
		const signature = getSignature(wxPushToken, '1666095834', '43829373', body.Encrypt)

		if (signature !== msgSignature) {
				return 'signature error'
		}

		const decrypt = decryptMsg(wxPushEncodingAESKey, body.Encrypt)
		
		result = decrypt.message
	}
	
	// 只接收内容安全事件通知
	if (result.Event !== 'wxa_media_check') {
		return 'success'
	}
	
	if (result.result.suggest !== 'pass') {
		// 执行删除操作
	}
}