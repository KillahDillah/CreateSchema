
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// Replace "test" with your database name.
mongoose.connect('mongodb://localhost:27017/albumdatabase');

const recordSchema = new mongoose.Schema ({
    albumName: {type: String, required: true, unique: true},
    bandName : {type: String, required: true},
    releaseDate: {type: String},
    recordLabel: {
        labelName: {type: String},
        labelAddress: {type: String}
    },
    topHits: {type: String, default: 1}
})



// create model

const AlbumModel = mongoose.model('albums', recordSchema)

module.exports = AlbumModel

