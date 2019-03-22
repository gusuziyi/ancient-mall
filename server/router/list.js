/* 2019/3/17 */
let Router = require('koa-router')
let axios = require('axios')
let PayList = require('../model/PayList')
let cfg = require('./cfg.js')

let router = new Router({
	prefix: "/list"
})

router.get('/allPayList', async (ctx) => {
	let {
		username
	} = ctx.request.query
	let lists = []
	if(username.indexOf('gly') == 0 || username.indexOf('管理员') == 0){
		lists = await PayList.find()
	}else{
		lists = await PayList.find({
			username
		})
	}
	if (lists) {
		if (!lists.length) {
			ctx.body = {
				code: 2004,
				msg: 'is empty',
			}
			return
		}
		stateArr = ['create', 'pay', "deliver", "done"]
		stateArr = stateArr.reverse()
		let allLists = {
			"all": [],
			"create": [],
			"pay": [],
			"deliver": [],
			"done": []
		}
		/* check form doneTime to createTime , if exist reletive time ,then exist state*/
		/* return means push into the allLists'option only for once except option all   */
		lists.forEach(list => {
			for (let state of stateArr) {
				let time = list[state + 'Time']
				if (time) {
					allLists[state].push(list)
					break;
				}
			}
			allLists['all'].push(list)
		})
		ctx.body = {
			code: 2000,
			msg: 'ok',
			allLists
		}
	} else {
		ctx.body = {
			code: 4004,
			msg: 'not find'
		}
	}
})

router.post('/payList', async (ctx) => {
	let {
		payList
	} = ctx.request.body
	let newPayList = new PayList(payList)
	let userPayList = await newPayList.save()
	if (userPayList) {
		ctx.body = {
			code: 2000,
			msg: 'ok',
		}
	} else {
		ctx.body = {
			code: 5000,
			msg: 'creat fail'
		}
	}
})

router.post('/payLists', async (ctx) => {
	let {
		payLists
	} = ctx.request.body
	let userPayList = await PayList.insertMany(payLists)
	if (userPayList) {
		ctx.body = {
			code: 2000,
			msg: 'ok',
		}
	} else {
		ctx.body = {
			code: 5000,
			msg: 'creat fail'
		}
	}
})

router.put('/payList', async (ctx) => {
	let {cid,whichTime,value} = ctx.request.body
	let result = {}
	if (whichTime == "payTime") {
		result = await PayList.updateOne({cid}, {$set: {"payTime": value,"state":"pay"}})
	} else if (whichTime == "deliverTime") {
		result = await PayList.updateOne({cid}, {$set: {"deliverTime": value,"state":"deliver"}})
	} else if (whichTime == "doneTime") {
		result = await PayList.updateOne({cid}, {$set: {"doneTime": value,"state":"done"}})
	}
	if (result.n) {
		ctx.body = {
			code: 2000,
			msg: 'ok',
		}
	} else {
		ctx.body = {
			code: 5000,
			msg: 'update fail'
		}
	}
})

router.delete('/payList', async (ctx) => {
	let {
		cid
	} = ctx.request.body
	let result = await PayList.deleteOne({
		cid
	})
	if (result.n) {
		ctx.body = {
			code: 2000,
			msg: 'ok',
		}
	} else {
		ctx.body = {
			code: 5000,
			msg: 'delete error'
		}
	}
})




module.exports = router
