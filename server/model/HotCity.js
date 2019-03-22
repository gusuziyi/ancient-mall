let mongoose = require('mongoose')
let Schema = mongoose.Schema 
let HotCity = new Schema({
	citys: {
		type: Array,
		require: true
	}
})
module.exports = mongoose.model("HotCity", HotCity,"HotCity")
