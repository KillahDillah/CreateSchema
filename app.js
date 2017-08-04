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
  AlbumModel.find()
    .then(function(searchResults){
      res.render("album",{
        albums: searchResults
      })
    })
    .catch (function(error){
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
    topHits: req.body.hits
  }
  console.log (data)
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
  db.AlbumModel.findOne({albumName:req.param.albumName })
    .then(function(searchResults){
      res.render("edit",{
        albumName: searchResults.albumName,
        bandName: searchResults.bandName,
        releaseDate: searchResults.releaseDate,
        recordLabel: {
          labelName: searchResults.labelName,
          labelAddress: searchResults.labelAddress
        },
        topHits: searchResults.topHits
      })
    })
    .catch (function(error){
      res.render ('index')
    })
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})