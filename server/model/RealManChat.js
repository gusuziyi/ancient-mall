let mongoose=require('mongoose')
let Schema=mongoose.Schema
let RealManChat=new Schema({
	name:{
		type:String,
		require:true
	},
	chat:Array,
})

module.exports=mongoose.model("RealManChat",RealManChat,"RealManChat")