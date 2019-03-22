let mongoose=require('mongoose')
let Schema=mongoose.Schema
let Fav=new Schema({
		username:String,
		last3: Array,
		likesType: [Schema.Types.Mixed],
		favArr:[Schema.Types.Mixed]
})

module.exports=mongoose.model("Fav",Fav,"Fav")