const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require ('body-parser')
const AlbumModel = require ('./mongoose');

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({extended:false}))

app.get("/", function(req, res, next){
  res.render("index")
})

app.get("/albums", function(req,res,next){
  AlbumModel.find().sort({
    releaseDate:-1
  })
    .then(function(searchResults){
      res.render("album",{
        albums: searchResults
      })
    })
    .catch(function(error){
      res.render ('album')
    })
})


app.post ('/albums', function(req,res,next){
  var data = {
    albumName: req.body.albumName,
    bandName: req.body.bandName,
    releaseDate: req.body.releaseDate,
    recordLabel: {
      labelName: req.body.labelName,
      labelAddress: req.body.address
    },
    topHits: req.body.topHits,
    pictureURL: req.body.pictureURL
  }
  var album = new AlbumModel(data)
  album.save()
    .then(function(){
      res.redirect('/albums')
    })
    .catch(function(error){
      res.redirect("/")
    })
})


app.get ('/edit/:albumName', function(req,res,next){
  AlbumModel.findOne({albumName:req.params.albumName })  // deleted db. as it was not defined
    .then(function(searchResults){
      console.log(searchResults)
      res.render("edit",{
        _id: searchResults._id,
        albumName: searchResults.albumName,
        bandName: searchResults.bandName,
        releaseDate: searchResults.releaseDate,
        recordLabel: {
          labelName: searchResults.recordLabel.labelName,
          labelAddress: searchResults.recordLabel.labelAddress
        },
        topHits: searchResults.topHits,
        pictureURL: searchResults.pictureURL

      })
    })
    .catch(function(error){
      res.render ('index')
    })
})

app.post('/edit', function(req,res,next){
console.log (req.body)
var query = {"_id":req.body._id}
var updateDB = {
  "$set": {
    "albumName":req.body.albumName,    // can I use the same name (albumName)?
    "bandName": req.body.bandName,
    "releaseDate": req.body.releaseDate,
    "recordLabel":{
      "labelName": req.body.labelName,
      "labelAddress": req.body.address
    },
    "topHits": req.body.topHits,
    "pictureURL": req.body.pictureURL
  }
};
  console.log (updateDB)
  AlbumModel.update(query, updateDB)
  .then(function(albumModel){
    res.redirect("/albums")
  })
  .catch(function(error){
    console.log ('AHH, real monsters')
  })
})

app.post('/delete', function(req,res,next){
  var query = {"_id":req.body._id}
  AlbumModel.remove(query)
  .then(function(){
    res.redirect('/albums')
  })
  .catch(function(){
    console.log ('not good!')
  })
})

app.post("/", function(req,res,next){
  res.redirect('/')
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})