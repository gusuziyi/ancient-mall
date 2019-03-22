let Router = require('koa-router')
let axios = require('axios')
let cfg = require('./cfg.js')
let OSS = require("ali-oss")
let Chat = require('../model/Chat')
let RealManChat = require('../model/RealManChat')

let router = new Router({
	prefix: "/jas"
})
router.post('/helloJas', async (ctx) => {
	let {
		text,
		type
	} = ctx.request.body
	// typeCode 0 means text , 1 means pic
	let typeCode = 0,
		userText = '',
		url = ''
	if (type == 'text') {
		typeCode = 0
		userText = text
	} else if (type == 'image') {
		typeCode = 1
		url = text
	}
	let helloJas = {
		"reqType": typeCode,
		"perception": {
			"inputText": {
				"text": userText
			},
			"inputImage": {
				"url": url
			},
		},
		"userInfo": {
			"apiKey": cfg.JAS_KEY,
			"userId": cfg.JAS_ID
		}
	}
	let {
		status,
		data: {
			intent,
			results
		}
	} = await axios.post(cfg.JAS_URL, JSON.stringify(helloJas))
	let {
		code
	} = intent
	if (results.length) {
		let answers = results.map(item => {
			let value = ''
			if (item.resultType == 'text') {
				value = item.values.text
			} else if (item.resultType == 'image') {
				value = item.values.image
			}
			return {
				speaker: 'jas',
				type: item.resultType,
				value
			}
		})
		ctx.body = {
			code: 2000,
			answers
		}
	} else {
		ctx.body = {
			code: 4004,
		}
	}
})

router.post('/callJasMan', async (ctx) => {
	let {
		text,
		type
	} = ctx.request.body
	ctx.body = {
		code: 2000,
		msg: "ok"
	} 
})

router.post('/getChat', async (ctx) => {
	let {
		name,
		isRealMan
	} = ctx.request.body
	let ChatModel = isRealMan ? RealManChat : Chat
	let userChat = await ChatModel.findOne({
		name
	})
	if (!userChat) {
		ctx.body = {
			code: 4004,
			msg: "用户不存在"
		}
		return
	}
	if (userChat.chat.length == 0) {
		ctx.body = {
			code: 2001,
			msg: "聊天记录为空"
		}
	} else {
		ctx.body = {
			code: 2000,
			msg: "ok",
			chatsArr: userChat.chat
		}
	}
})
router.post('/setChat', async (ctx) => {
	let {
		name,
		chat,
		isRealMan
	} = ctx.request.body
	let ChatModel = isRealMan ? RealManChat : Chat
	let userChat = await ChatModel.findOne({
		name
	})
	let result = ''
	// if exsit user then update ,otherwise add new chat
	if (userChat) {
		result = await ChatModel.updateOne({
			name
		}, {
			chat
		})
	} else {
		let newChat = new ChatModel({
			name,
			chat
		})
		result = await newChat.save()
	}
	if (!result) {
		ctx.body = {
			code: 5003,
			msg: "聊天记录存储失败"
		}
	} else {
		ctx.body = {
			code: 2000,
			msg: "ok",
		}
	}
})

router.post('/removeChat', async (ctx) => {
	let {
		name,
		isRealMan
	} = ctx.request.body
	let ChatModel = isRealMan ? RealManChat : Chat
	let delInfo = await ChatModel.deleteOne({
		name
	})
	if (delInfo.n == 0) {
		ctx.body = {
			code: 4004,
			msg: "用户不存在"
		}
	} else {
		ctx.body = {
			code: 2000,
			msg: "ok",
		}
	}
})

router.get('/initOSS', async (ctx) => {
	let OSS_INFO = {
		region: cfg.OSS_region,
		accessKeyId: cfg.OSS_accessKeyId,
		accessKeySecret: cfg.OSS_accessKeySecret,
		bucket: cfg.OSS_bucket
	}
	ctx.body = {
		code: 2000,
		msg: "ok",
		OSS_INFO
	}
})
module.exports = router
