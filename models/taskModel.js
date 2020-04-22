const mongoose = require('mongoose')
const { Schema } = mongoose

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please fill in all fields.']
    },
    description: {
        type: String,
        required: [true, 'Please fill in all fields.']
    },
    status: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    division: {
        type: String,
        required: [true, 'Please fill in all fields.']
    }
},
{
    timestamps: true
})

const task = mongoose.model('Task', taskSchema)

module.exports = task