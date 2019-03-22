let mongoose=require('mongoose')
let Schema=mongoose.Schema
let Goodses=new Schema({
	 id :String,
	cid : Number,
	name : String,
	department : String,
	Category : String,
	price : Number,
	oriPrice:Number,
	restTime : Number,
	sellNum : Number,
	attrs : Schema.Types.Mixed,
	sattrs : Schema.Types.Mixed,
	imgs : Schema.Types.Mixed,
	shopName : String,
	shopCid : String,
	vars : [Schema.Types.Mixed],
	fav:Boolean
})

module.exports=mongoose.model("Goodses",Goodses,"Goodses")