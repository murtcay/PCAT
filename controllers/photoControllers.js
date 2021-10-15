const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const pageNum = req.query.page || 1;
  const photosPerPage = 2;

  const totalPhotosCount = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((pageNum - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    photos: photos,
    current: pageNum,
    pages: Math.ceil(totalPhotosCount / photosPerPage)
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo: photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  req.files.image.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  let filePath = __dirname + '/../public' + photo.image;

  fs.unlinkSync(filePath);

  await Photo.findByIdAndDelete(req.params.id);

  res.redirect('/');
};
