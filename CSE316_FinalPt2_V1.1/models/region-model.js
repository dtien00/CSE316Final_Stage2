const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id:{
			type: Number,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		capital: {
			type: String,
			required: true
		},
		leader: {
			type: String,
			required: true
		},
		flag: {
			type: String,
			required: true
		},
		parent:{
			type: ObjectId,
			required: true
		},
		landmarks: [String]
	}
);

const Region = model('Region', regionSchema);
module.exports = Region;