const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// TEMPALATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add-photo', (req, res) => {
  res.render('add-photo');
});

app.post('/photos', (req, res) => {
  console.log(req.body);
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Server is listening on ${port}... `);
});
