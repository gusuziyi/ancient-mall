let Router = require('koa-router')
let Province = require('../model/Province')
let HotCity = require('../model/HotCity')
let cfg = require('./cfg.js')
let pinyin = require('js-pinyin')
let axios = require('axios')
let sutil=require('../../public/serverUtil')

let router = new Router({
	prefix: '/geo'
})

router.get('/hotcity', async (ctx) => {
	let citys = await HotCity.find()
	if (citys.length > 0) {
		ctx.body = {
			code: 2000,
			hotcity: citys[0].citys,
		}
	} else {
		ctx.body = {
			code: 4004,
			citys: [],
		}
	}

})
router.get('/province', async (ctx) => {
	let provinces = await Province.find()
	if (provinces.length > 0) {
		let province = provinces.map(item => {
			return {
				name: item.name.replace(/[省市]/, ''),
				citys: item.city.map(city => sutil.trimCity(city.name))
			}
		})
		let citys = {},
			onlyProvinces = []
		province.forEach(item => {
			onlyProvinces.push(item.name)
			item.citys.forEach(city => {
				let letterFirst = pinyin.getFullChars(city).charAt(0)
				if (!citys[letterFirst]) {
					citys[letterFirst] = []
				}
				citys[letterFirst].push(city)
			})
		})
		//province letter start with Q  to remove repeat
		citys["Q"] = [...new Set(citys["Q"])]
		let onlyCitys = Object.entries(citys).map(item => {
			return {
				letter: item[0],
				citys: item[1]
			}
		}).sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0))
		ctx.body = {
			code: 2000,
			province,
			onlyProvinces,
			onlyCitys
		}
	} else {
		ctx.body = {
			code: 4004,
			province: [],
			onlyProvinces: [],
			onlyCitys: []
		}
	}
})
router.get('/getCurCity', async (ctx) => {
	let url = `${cfg.GEO_URL}/ip?key=${cfg.GEO_KEY}`
	let {
		status,
		data:{city,province,adcode,info,rectangle}
	} = await axios.get(url)
	if (info == 'OK') {
         /* 
        * transform user's rectangle to user's  geoLocation 
        * */
        let rect= rectangle.split(";")
        let r1= rect[0].split(","),r2=rect[1].split(",")
        let geo=[((+r1[0])+(+r2[0]))/2,((+r1[1])+(+r2[1]))/2]
        
		ctx.body = {
			code: 2000,
			location:{
				city,province,adcode,geo
			}
		}
	} else {
		ctx.body = {
			code: 4004,
			city: 'api错误',
		}
	}
})


module.exports = router
