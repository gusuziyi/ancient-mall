let mongoose = require('mongoose')
let Schema = mongoose.Schema
let goodses = new Schema({
	cid: String,
	name: String,
	department: String,
	imgs: String,
	num: Number,
	sku:Schema.Types.Mixed,
	inventorys:[Schema.Types.Mixed],
	time:Number
})
let carts = new Schema({
	shopName: String,
	shopCid: String,
	department: String,
	area: String,
	goodses: [goodses]
})
let UserCart = new Schema({
	username: String,
	email: String,
	identity: String,
	fav: Array,
	carts: [carts]
})
module.exports = mongoose.model("UserCart", UserCart, "UserCart")
