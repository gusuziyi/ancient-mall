let mongoose=require('mongoose')
let Schema=mongoose.Schema
let identity=["buyer","admin"]
let userInfo=new Schema({
	money:Number,
	rank:Number,
	experience:Number,
	signedDay:Number,
	ranks:Array,
	lastSignedDay:Date,
    birthDay:String
})
let safeInfo=new Schema({
	email:String,
	emailVertify:Boolean,
	QQ:Number,
	QQVertify:Boolean,
})
let Users=new Schema({
	name:{
		type:String,
		require:true
	},
	pass:{
		type:String,
		require:true
	},
	identity:{
		type:String,
		enum:identity
	},
	img:String,
	fav:Array,
	userInfo:[userInfo],
	safeInfo:[safeInfo]
})

module.exports=mongoose.model("Users",Users,"Users")