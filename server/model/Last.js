let mongoose=require('mongoose')
let Schema=mongoose.Schema
let Last=new Schema({
	username:String,
	lastCart:[Schema.Types.Mixed],
})

module.exports=mongoose.model("Last",Last,"Last")