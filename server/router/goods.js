let Router = require('koa-router')
let axios = require('axios')
let cfg = require('./cfg.js')
// let OSS = require("ali-oss")
let Goodses = require('../model/Goodses')
let Last = require('../model/Last')
let Inventory = require('../model/Inventory')
let UserCart = require('../model/UserCart')

let router = new Router({
	prefix: "/goods"
})
router.post('/getHotGoods', async (ctx) => {
	/* find hot goods by sellNum ,for index show */
	let hotGoodses = await Goodses.find().sort({
		sellNum: -1
	})
	if (hotGoodses.length) {
		ctx.body = {
			code: 2000,
			hotGoodses
		}
	}
})
router.get('/getOneGoods', async (ctx) => {
	/* find a goods ,for show detail*/
	let {
		cid
	} = ctx.request.query
	let goods = await Goodses.findOne({
		cid
	})
	if (goods) {
		ctx.body = {
			code: 2000,
			goods
		}
	} else {
		ctx.body = {
			code: 4004,
			goods: {}
		}
	}
})

router.get("/inventorys", async (ctx) => {
	let findSku = ctx.request.query.sku
	let shopCid = ctx.request.query.shopCid
	let inventorys = []
	let results = await Inventory.find({
		shopCid
	})
	/* the inventorys of shop which has checked sku */
	if (results.length) {
		results.forEach(inventory => {
			inventory.vars.forEach(sku => {
				if (sku.sku == findSku) {
					let t = {
						targetSku: sku.sku,
						targetNum: sku.quantity,
						vars: [],
						id: inventory.id,
						storeName: inventory.storeName,
						cid: inventory.cid,
						shopName: inventory.shopName,
						shopCid: inventory.shopCid,
						location: inventory.location,
						locationCity: inventory.locationCity,
					}
					inventorys.push(t)
				}
			})
		})
		ctx.body = {
			code: 2000,
			inventorys
		}
	} else {
		ctx.body = {
			code: 4004,
			inventorys: []
		}
	}
})

/* 2019/3/10 */
/* recently i has studied  RESTful Api design, i like this standard and will use it in the fature */
router.get('/userCart', async (ctx) => {
	if (!ctx.isAuthenticated()) {
		ctx.body = {
			code: 401,
			msg: '查看购物袋,请先登录'
		}
	}
	/* find  UserCart by username*/
	let {
		username
	} = ctx.request.query
	let userCarts = await UserCart.findOne({
		username
	})
	if (userCarts) {
		ctx.body = {
			code: 2000,
			userCarts,
			msg: 'ok'
		}
	} else {
		ctx.body = {
			code: 4004,
			userCarts: {},
			msg: 'not find'
		}
	}
})
router.get('/userCart', async (ctx) => {
	if (ctx.isAuthenticated()) {
		ctx.body = {
			code: 401,
			msg: '查看购物袋,请先登录'
		}
		return
	}
	/* find  UserCart by username*/
	let {
		username
	} = ctx.request.query
	let userCarts = await UserCart.findOne({
		username
	})
	if (userCarts) {
		ctx.body = {
			code: 2000,
			userCarts,
			msg: 'ok'
		}
	} else {
		ctx.body = {
			code: 4004,
			userCarts: {},
			msg: 'not find'
		}
	}
})
router.post('/userCart', async (ctx) => {
	/* 2019/3/10 */
	/* find the UserCart ,cheak if repeat
	 * if no username, create new
	 * if has username but no shopCid , update carts's  shopCid and  shopCid's oodses
	 * if has username and shopCid but no goodses ,update  shopCid's goodses 
	 * if has username and shopCid and goodses ,update  goodses's num
	 */
	let {
		userInfo,
		shopInfo,
		goodsesInfo
	} = ctx.request.body
	let {
		username
	} = userInfo, {
		shopCid
	} = shopInfo, {
		cid,
		num,
		sku: {
			skuCid
		}
	} = goodsesInfo
	let hasUserCarts = await UserCart.findOne({
		username
	})
	let result = null
	if (hasUserCarts) {
		let newCarts = hasUserCarts.carts
		let searchState = 'noShopCid'
		newCarts.forEach(shop => {
			if (shop.shopCid == shopCid) {
				searchState = 'noGoodses'
				shop.goodses.forEach(goods => {
					if (goods.sku.skuCid == skuCid) {
						searchState = 'hasSku'
						goods.num += num
					}
				})
				if (searchState == 'noGoodses') {
					shop.goodses.push(goodsesInfo)
				}
			}
		})
		if (searchState == 'noShopCid') {
			newCarts.push(Object.assign(shopInfo, {
				"goodses": [goodsesInfo]
			}))
		}
		result = await UserCart.updateOne({
			username
		}, {
			$set: {
				"carts": newCarts
			}
		})
		result = result.n > 0 ? Object.assign(userInfo, {
			"carts": [newCarts]
		}) : null
	} else {
		let oneShop = Object.assign(shopInfo, {
			"goodses": [goodsesInfo]
		})
		let oneCart = Object.assign(userInfo, {
			"carts": [oneShop]
		})
		let newUserCart = new UserCart(oneCart)
		result = await newUserCart.save()
	}

	if (result) {
		ctx.body = {
			code: 2000,
			result
		}
	} else {
		ctx.body = {
			code: 5000,
			result: null
		}
	}
})
router.delete('/userCart', async (ctx) => {
	/* 2019/3/10
	 * find the UserCart by username,cheak if the sku is exist
	 * if sku is exist, delete it ,else return false
	 * after delete sku ,if shop is empty delete shop 
	 * */
	let {
		userInfo,
		shopInfo,
		goodsesInfo
	} = ctx.request.body
	let {
		username
	} = userInfo, {
		shopCid
	} = shopInfo, {
		cid,
		num,
		sku: {
			skuCid
		}
	} = goodsesInfo
	let hasUserCarts = await UserCart.findOne({
		username
	})
	let result = null
	if (hasUserCarts) {
		let newCarts = hasUserCarts.carts
		let searchState = 'noGoodses'
		newCarts.forEach((shop, sidx) => {
			if (shop.shopCid == shopCid) {
				shop.goodses.forEach((goods, idx) => {
					if (goods.sku.skuCid == skuCid) {
						delete shop.goodses[idx]
						if (shop.goodses.length == 0) {
							delete newCarts[sidx]
						}
						searchState == 'isDeleted'
					}
				})
			}
		})
		if (searchState == 'noGoodses') {
			result = null
		}
		result = await UserCart.updateOne({
			username
		}, {
			$set: {
				"carts": newCarts
			}
		})
		result = result.n > 0 ? Object.assign(userInfo, {
			carts: [newCarts]
		}) : null
	}
	if (result) {
		ctx.body = {
			code: 2000,
			result
		}
	} else {
		ctx.body = {
			code: 5000,
			result: null
		}
	}
})

router.put('/userCart', async (ctx) => {
	let {
		carts,
		username
	} = ctx.request.body
	let hasUserCarts = await UserCart.findOne({
		username
	})
	let result = null
	if (hasUserCarts) {
		result = await UserCart.updateOne({
			username
		}, {
			$set: {
				"carts": carts
			}
		})
	}
	if (result.n) {
		ctx.body = {
			code: 2000,
		}
	} else {
		ctx.body = {
			code: 5000,
		}
	}
})
/* 2019/3/11
 * get the recently two goods
 * */
router.get('/LastGoodsInCart', async (ctx) => {
	if (ctx.isAuthenticated()) {
		let {
			username
		} = ctx.request.query
		let lastGoods = await Last.findOne({
			username
		})
		if (lastGoods) {
			ctx.body = {
				code: 2000,
				lastGoodses:lastGoods.lastCart,
				msg: 'ok'
			}
		} else {
			ctx.body = {
				code: 4004,
				lastGoods: {},
				msg: 'not find'
			}
		}
	}else{
		ctx.body = {
			code: 401,
			msg: '查看购物袋,请先登录'
		}
	}
})

router.post('/changeFav', async (ctx) => {
	if (ctx.isAuthenticated()) {
		let {
			id,
			isFav
		} = ctx.request.body
		let targetGoods = await Goodses.find({
			id
		})
		if (targetGoods) {
			let result = await Goodses.updateOne({
				id
			}, {
				$set: {
					fav: isFav
				}
			})
			if (result.n) {
				ctx.body = {
					code: 2000,
					msg: 'ok',
					updateView: true
				}
			} else {
				ctx.body = {
					code: 5000,
					msg: 'server error'
				}
			}
		} else {
			ctx.body = {
				code: 4004,
				msg: 'not find'
			}
		}
	} else {
		ctx.body = {
			code: 401,
			msg: '收藏商品,请先登录'
		}
	}
})

router.post('/last', async (ctx) => {
	let {userInfo,shopInfo,goodsesInfo} = ctx.request.body
	let {username} = userInfo, {cid,num,sku: {skuCid}} = goodsesInfo
	let result = await Last.findOne({
		username
	})
	if (result) {
		let {
			lastCart
		} = result
		let isrepeat = false
		lastCart.forEach(cart => {
			if (cart.goodsesInfo.sku.skuCid == skuCid)
				isrepeat = true
		})
		if (!isrepeat) {
			lastCart.unshift({
				userInfo,
				goodsesInfo,
				shopInfo,
				time: new Date().getTime()
			})
			while (lastCart.length > 2) {
				lastCart.pop()
			}
			let r = await Last.updateOne({username}, {$set: {lastCart}})
			if (r.n) {
				ctx.body = {
					code: 2000,
					msg:"已加入"
				}
			}
		}else{
			ctx.body = {
				code: 2004,
				msg:"加入商品重复"
			}
		}
	} else {
		let newLast = new Last({
			username,
			lastCart: [{
				userInfo,
				goodsesInfo,
				shopInfo,
				time: new Date().getTime()
			}]
		})
		let r = await newLast.save()
		if (r) {
			ctx.body = {
				code: 2000
			}
		}
	}
})

router.get('/all', async (ctx) => {
	let allGoods = await Goodses.find().sort({sellNum: -1})
	if(allGoods.length){
		ctx.body = {
			code: 2000,
			allGoods
		}
	}else{
		ctx.body = {
			code: 4004,
			msg: 'not find'
		}
	}
})
module.exports = router
