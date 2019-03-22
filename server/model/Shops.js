let mongoose=require('mongoose')
let Schema=mongoose.Schema
let Shops=new Schema({
		id: String,
		cid: String,
		shopName: String,
		storeCId: Array,
		department:String,
		star: Number,
		address: Schema.Types.Mixed,
		location:Array,
		area:String
})

module.exports=mongoose.model("Shops",Shops,"Shops")