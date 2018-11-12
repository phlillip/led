var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'PlantNation' });
  res.sendFile(path.join(__dirname + '/index.html'));
});

// app.get requests on /connection loads new page
router.get('/connection', function(req, res){
res.sendFile(path.join(__dirname + '/views/connection.html'));
});

// app.get requests on /connection loads new page
router.get('/recipes', function(req, res){
res.sendFile(path.join(__dirname + '/views/recipes.html'));
});

module.exports = router;
