let mongoose = require('mongoose')
let Schema = mongoose.Schema
let Province = new Schema({
	name: {
		type: String,
		require: true
	},
	city: {
		type: Array,
		require: true
	}
})

module.exports = mongoose.model("Province", Province,"Province")
