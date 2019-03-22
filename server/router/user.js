let Router = require('koa-router')
let axios = require('axios')
let nodemailer = require('nodemailer')
let Users = require('../model/Users')
let Fav = require('../model/Fav')
let cfg = require('./cfg.js')
let Redis = require('koa-redis')
let redis = new Redis().client
//ejs mudole
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
//local passport
const passport = require('../passport/Local')

let router = new Router({
	prefix: "/user"
})

router.post('/register', async (ctx) => {
	let {
		email,
		name,
		pass
	} = ctx.request.body

	/* admin identify : name start with gly*/
	let identity = ''
	if (name.indexOf('gly') == 0 || name.indexOf('管理员') == 0) {
		identity = 'admin'
	} else {
		identity = 'buyer'
	}
	let newUser = new Users({
		name,
		pass,
		identity,
		img: cfg.OSS_JAS_ME,
		userInfo: {
			money: 100,
			rank: 0,
			experience: 0,
			signedDay: 0,
			ranks: cfg.Ranks,
			lastSignedDay: new Date(0)
		},
		safeInfo: {
			email,
			emailVertify: true,
			QQVertify: false,
		}
	})
	let result = await newUser.save()
	let identityMsg = identity == 'buyer' ? "[普通权限]" : "[管理员权限]"
	if (!result) {
		ctx.body = {
			code: 5003,
			msg: "用户创建失败"
		}
	} else {
		ctx.body = {
			code: 2000,
			msg: identityMsg + "用户" + name + "已创建",
			newUser
		}
	}
})

router.post('/updateUserInfo',async (ctx) => {
  	let {name,QQ,date,url} = ctx.request.body
    let result = {},n=0
    result= await Users.findOne({"name": name})
    if(result){
          if(QQ){
            result= await Users.updateOne({
            	"name": name
            }, {
            	$set: {
            		"safeInfo.0.QQ": QQ,
                    "safeInfo.0.QQVertify": true
            	}
            })
            n+=result.n
        }
         if(date){
            result= await Users.updateOne({
            	"name": name
            }, {
            	$set: {
            		"userInfo.0.birthDay": date,
            	}
            })
            n+=result.n
        }
         if(url){
            result= await Users.updateOne({
            	"name": name
            }, {
            	$set: {
            		"img": url,
            	}
            })
            n+=result.n
        }
        if (n) {
        	ctx.body = {
        		code: 2000,
        	}
        } else{
           ctx.body = {
           	code: 5000,
           } 
        }
    }else{
         ctx.body = {
        	code: 4004,
        } 
    }
  
})
router.get('/checkRepeat', async (ctx) => {
	let {
		name
	} = ctx.request.query
	let user = await Users.findOne({
		name
	})
	if (user) {
		ctx.body = {
			code: 5003,
			msg: "昵称" + name + "已被使用"
		}
	} else {
		ctx.body = {
			code: 2000,
			msg: "ok"
		}
	}
})

router.get('/checkExist', async (ctx) => {
	let {
		name
	} = ctx.request.query
	let user = await Users.findOne({
		name
	})
	if (!user) {
		ctx.body = {
			code: 4004,
			msg: "用户" + name + "不存在"
		}
	} else {
		ctx.body = {
			code: 2000,
			msg: "ok"
		}
	}
})

router.get('/checkCode', async (ctx) => {
	let {
		name,
		code
	} = ctx.request.query
	if (!name) {
		ctx.body = {
			code: 5003,
			msg: "用户名不能为空"
		}
		return
	}
	let redisCode = await redis.hget(`email:${name}`, 'code')
	if (!redisCode) {
		ctx.body = {
			code: 5003,
			msg: "验证码不存在,请发送验证码"
		}
		return
	}
	if (code !== redisCode) {
		ctx.body = {
			code: 5003,
			msg: "验证码错误,请查看邮箱" + redisCode
		}
		return
	}
	let redisCodeStartTime = await redis.hget(`email:${name}`, 'startTime')
	let maxAge = await redis.hget(`email:${name}`, 'max-age')
	let now = new Date().getTime()
	if (now - redisCodeStartTime > maxAge) {
		ctx.body = {
			code: 5003,
			msg: "验证码已过期"
		}
		return
	}
	ctx.body = {
		code: 2000,
		msg: "ok"
	}
})

router.post('/sendEmail', async (ctx) => {
	let {
		email,
		name
	} = ctx.request.body

	let transporter = nodemailer.createTransport({
		service: 'qq',
		port: 465, // SMTP 端口
		secureConnection: true, // 使用了 SSL
		auth: {
			user: `${cfg.QQ}@qq.com`,
			pass: cfg.STMP_CODE,
		}
	})
	//ejs inside template
	const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../views/email.ejs'), 'utf8'));
	let code = Math.random().toString().slice(2, 6)
	const html = template({
		name,
		code,
		date: new Date().toLocaleDateString()
	});

	let mailOptions = {
		from: `美妆小铺古风版  ${cfg.QQ}@qq.com`,
		to: email,
		subject: 'Hello',
		html,
		attachments: [{
			filename: 'welcome.jpg',
			path: path.resolve(__dirname, '../views/welcome.jpg'),
			cid: 'welcome',
		}]
	}
	let err = ''
	await transporter.sendMail(mailOptions, (error, info) => {
		err = error
	});

	if (err) {
		ctx.body = {
			code: 4004,
			msg: err
		}
	} else {
		redis.hmset(`email:${name}`, 'name', name, 'code', code, 'max-age', 600000, 'startTime', new Date().getTime())
		ctx.body = {
			code: 2000,
			msg: "邮件已发送,验证码十分钟内有效"
		}
	}

})

router.post('/login', (ctx, next) => {
	return passport.authenticate('local', function(err, user, info, status) {
		if (err) {
			ctx.body = {
				code: 5003,
				msg: "认证模块错误" + err
			}
		} else {
			if (user) {
				ctx.body = {
					code: 2000,
					msg: '登录成功',
					user
				}
				return ctx.login(user)
			} else {
				ctx.body = {
					code: 4004,
					msg: info
				}
			}
		}
	})(ctx, next)
})

router.get('/logout', (ctx, next) => {
	ctx.logout()
	if (!ctx.isAuthenticated()) {
		ctx.body = {
			code: 2000
		}
	} else {
		ctx.body = {
			code: 4003
		}
	}
})

router.post('/signDay', async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		let {
			name
		} = ctx.request.body
		let user = await Users.findOne({
			name
		})
		if (!user) {
			ctx.body = {
				code: 4004,
				msg: '查询失败',
				newUserInfo: {}
			}
			return
		}
		let {
			experience,
			ranks,
			rank,
			signedDay,
			money,
			lastSignedDay
		} = user.userInfo[0]
		if (lastSignedDay.toLocaleDateString() == new Date().toLocaleDateString()) {
			ctx.body = {
				code: 5002,
				msg: '一天只能签到一次哦',
			}
			return
		} else if (lastSignedDay > new Date()) {
			ctx.body = {
				code: 5000,
				msg: '时间格式错误',
			}
			return
		}
		experience += 30
		money += 20
		//is level up
		let levelUp = false
		if (experience >= ranks[rank]) {
			rank++
			levelUp = true
		}
		signedDay >= 7 ? '' : signedDay++
		let newUserInfo = {
			experience,
			rank,
			signedDay,
			money,
			ranks,
			lastSignedDay: new Date()
		}
		//userInfo is an array with many Object which include signedDay
		let result = await Users.updateOne({
			"name": name
		}, {
			$set: {
				"userInfo": newUserInfo
			}
		})
		if (result.n) {
			ctx.body = {
				code: 2000,
				msg: '签到成功',
				newUserInfo,
				levelUp
			}
		} else {
			ctx.body = {
				code: 4004,
				msg: '查询失败',
				newUserInfo: {}
			}
		}
	} else {
		ctx.body = {
			code: 5003,
			msg: '请先登录',
			newUserInfo: {}
		}
	}
})

router.get("/curUser", (ctx, next) => {
	if (ctx.isAuthenticated()) {
		ctx.body = {
			code: 2000,
			user: ctx.state.user
		}
	} else {
		ctx.body = {
			code: 401,
			user: ''
		}
	}
})


router.get("/fav", async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		let {
			username
		} = ctx.request.query
		let userfav = await Fav.findOne({
			username
		})
		if (userfav) {
			ctx.body = {
				code: 2000,
				userfav
			}
		} else {
			ctx.body = {
				code: 4004,
				msg: '未找到收藏夹'
			}
		}
	} else {
		ctx.body = {
			code: 401,
			msg: '查看收藏夹请先登录'
		}
	}
})
/*  2019/3/14
 *	update or create user's fav 
 *  @param last3 : array at most has 3 department of goods
 * 	@param likesType : array's element like  {type:"写真",num:1} , num show the like level
 * 	@param favArr: goodses list
 * */
router.post("/fav", async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		let {
			username,
			goods
		} = ctx.request.body
		let userfav = await Fav.findOne({
			username
		})
		if (userfav) {
			let {
				last3,
				likesType,
				favArr
			} = userfav
			last3.push(goods.department)
			while (last3.length > 3) {
				last3.shift()
			}
			let isRepeat = false
			likesType.forEach(type => {
				if (type.type == goods.department) {
					type.num++
					isRepeat = true
				}
			})
			if (!isRepeat) {
				likesType.push({
					type: goods.department,
					num: 1
				})
			}
			favArr.push(goods)
			let result = await Fav.updateOne({
				username
			}, {
				$set: {
					last3,
					likesType,
					favArr
				}
			})
			if (result.n) {
				ctx.body = {
					code: 2000,
					userfav: {
						username,
						last3,
						likesType,
						favArr
					},
					msg: '修改成功'
				}
			}
		} else {
			let newFav = new Fav({
				username,
				last3: [goods.department],
				likesType: [{
					type: goods.department,
					num: 1
				}],
				favArr: [goods]
			})
			let result = newFav.save()
			if (result) {
				ctx.body = {
					code: 2001,
					msg: '新建收藏夹成功'
				}
			}
		}
	} else {
		ctx.body = {
			code: 401,
			msg: '查看收藏夹请先登录'
		}
	}
})
router.post("/delfav", async (ctx, next) => {
	if (ctx.isAuthenticated()) {
		let {username,goods} = ctx.request.body
		let userfav = await Fav.findOne({
			username
		})
		if (userfav) {
			let {
				last3,
				likesType,
				favArr
			} = userfav
			last3.forEach((type, idx) => {
				if (type == goods.department) {
					last3.splice(idx, 1)
				}
			})
			likesType.forEach((type, idx) => {
				if (type.type == goods.department) {
					type.num--
					if (type.num == 0) {
						likesType.splice(idx, 1)
					}
				}
			})
			favArr.forEach((goods, idx) => {
				if (goods.name == goods.name) {
					favArr.splice(idx, 1)
				}
			})
			let result = await Fav.updateOne({
				username
			}, {
				$set: {
					last3,
					likesType,
					favArr
				}
			})
			if (result.n) {
				ctx.body = {
					code: 2000,
					userfav: {
						username,
						last3,
						likesType,
						favArr
					},
					msg: "删除成功"
				}
			}
		} else {
			ctx.body = {
				code: 4004,
				userfav
			}
		}
	} else {
		ctx.body = {
			code: 401,
			msg: '查看收藏夹请先登录'
		}
	}
})
module.exports = router
