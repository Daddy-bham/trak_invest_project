const mongoose = require("mongoose")

const RecordsSchema = mongoose.Schema({
	name: String,
	email: String,
})

module.exports = mongoose.model("Records", RecordsSchema)
