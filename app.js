const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');

const app = express();
const port = 3000;

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TEMPALATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['GET', 'POST'],
  })
);

// ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');

  res.render('index', {
    photos: photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add-photo', (req, res) => {
  res.render('add-photo');
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  req.files.image.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo: photo,
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', {
    photo: photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  let filePath = __dirname + '/public' + photo.image;

  fs.unlinkSync(filePath);

  await Photo.findByIdAndDelete(req.params.id);

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}... `);
});
