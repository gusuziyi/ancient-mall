const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../model/Users')
let CryptoJs=require('crypto-js')

// 用户名密码验证策略
passport.use(new LocalStrategy(
   async (username, password, done)=> {
	   let where={name:username}
       let user=await Users.findOne(where)
            if (user) {
                if (user.pass ==  CryptoJs.MD5(password).toString()) {
                    return done(null, user)
                } else {
                    return done(null, false, '密码错误')
                }
            } else {
                return done(null, false, '用户不存在')
            }
    }
))

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser(function (user, done) {
    done(null, user)
})

// deserializeUser 在每次请求的时候将从 session 中读取用户对象
passport.deserializeUser(function(user, done) {
    return done(null, user)
  
});
module.exports = passport