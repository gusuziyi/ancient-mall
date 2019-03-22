/* 2019/3/12 */
let Router = require('koa-router')
let axios = require('axios')
let Shops = require('../model/Shops')
let Goodses=require('../model/Goodses')
let Inventory=require('../model/Inventory')
let cfg = require('./cfg.js')

let router = new Router({
	prefix: "/shop"
})

router.get('/shop', async (ctx) => {
	let {shopCid}=ctx.request.query
	let shop=await Shops.findOne({cid:shopCid})
	if(shop){
		ctx.body={
			code:2000,
			msg:'ok',
			shop
		}
	}else{
		ctx.body={
			code:4004,
			msg:'not find'
		}
	}
})
router.get('/goodses', async (ctx) => {
	let {shopCid}=ctx.request.query
	let goodses=await Goodses.find({shopCid})
	if(goodses){
		ctx.body={
			code:2000,
			msg:'ok',
			goodses
		}
	}else{
		ctx.body={
			code:4004,
			msg:'not find'
		}
	}
})
router.get('/inventorys', async (ctx) => {
	let {shopCid}=ctx.request.query
	let inventorys=await Inventory.find({shopCid})
	if(inventorys){
		ctx.body={
			code:2000,
			msg:'ok',
			inventorys
		}
	}else{
		ctx.body={
			code:4004,
			msg:'not find'
		}
	}
})
	
	


module.exports = router
