const mongoose = require('mongoose');

const cathedraScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    headman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null,  
    }
});

cathedraScheme.virtual('getHeadman', {
    'localField': 'headman',
    'foreignField': '_id',
    'ref': 'Teacher',
})

const Cathedra = new mongoose.model('Cathedra', cathedraScheme);
module.exports = Cathedra;