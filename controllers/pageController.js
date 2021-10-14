const Photo = require('../models/Photo');

exports.getAboutPage = (req, res) => {
  res.render('about');
};

exports.getPhotoAddPage = (req, res) => {
  res.render('add-photo');
};

exports.getPhotoEditPage = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('edit', {
    photo: photo
  });
};
