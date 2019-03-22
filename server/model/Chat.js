let mongoose=require('mongoose')
let Schema=mongoose.Schema
let Chat=new Schema({
	name:{
		type:String,
		require:true
	},
	chat:Array,
})

module.exports=mongoose.model("Chat",Chat,"Chat")