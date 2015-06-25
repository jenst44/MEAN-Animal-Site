var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animals');

var AnimalSchema = new mongoose.Schema({
	name: String,
	description: String,
	created_at: Number,
	updated_at: Number
});

var Animal = mongoose.model('animal', AnimalSchema);

app.use(express.static(__dirname + '/client'));

app.set('views', (__dirname + '/client/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	Animal.find({}, function(err, animals) {
		if(err) {
			console.log('errors!!!');
			res.render('index');
		}
		else {
			res.render('index', {animals:animals});
		}
	})
})

app.get('/mongooses/new', function(req, res) {
	res.render('new_animal')
})

app.get('/mongooses/:id/edit', function(req, res) {
	Animal.findOne({_id: req.params.id}, function(err, animal) {
		if(err) {
			console.log('errrrrra errrra errooooorr');
		}
		else {
			res.render('edit_animal.ejs', {animal:animal});
		}
	})
})

app.get('/mongooses/:id/destroy', function(req, res) {
	Animal.remove({_id: req.params.id}, function(err, animal) {
		res.redirect('/');
	})
})

app.post('/mongooses', function(req, res) {
	console.log(req.body);
	var animal = new Animal({name: req.body.name, description: req.body.description, created_at: Date.now(), updated_at: Date.now()});

	if(req.body.name == "" || req.body.description == "") {
		res.redirect('/mongooses/new');
	}
	else {
		animal.save(function(err) {
			if(err) {
				console.log('something went wrong');
			}
			else {
				console.log('successfully added a user!');
				res.redirect('/');
			}
		})
	}
})

app.post('/mongooses/:id', function(req, res) {
	Animal.update({_id:req.params.id}, {name:req.body.name, description: req.body.description}, function(err, animal) {
		console.log('here');
		res.redirect('/');
	})
})


app.listen(8000, function() {
	console.log('8000 animals are happier now');
})