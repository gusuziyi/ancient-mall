let mongoose = require('mongoose')
let Schema = mongoose.Schema
let PayList = new Schema({
	cid:String,
	state:String,
	
	username:String,
	userInfo:Schema.Types.Mixed,
	goods:Schema.Types.Mixed,
	imgs:String,
	num: Number,
	totalPrice:Number,
	sku: Schema.Types.Mixed,
	inventorys: [Schema.Types.Mixed],

	createTime:String,
	payTime:String,
	deliverTime:String,
	doneTime:String,
})

module.exports = mongoose.model("PayList", PayList,"PayList")