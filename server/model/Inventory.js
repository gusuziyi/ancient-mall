let mongoose=require('mongoose')
let Schema=mongoose.Schema
let Inventory=new Schema({
	id: String,
	storeName: String,
	cid: String,
	shopName: String,
	shopCid: String,
	location: [Number],
	locationCity: String,
	vars: [Schema.Types.Mixed]
})

module.exports=mongoose.model("Inventory",Inventory,"Inventory")