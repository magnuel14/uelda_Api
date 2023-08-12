const cloudinary = require('cloudinary').v2;

const cloudinaryControl = {};

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

cloudinaryControl.uploadImage = async (filePath) => cloudinary.uploader.upload(filePath, {
  folder: 'ueldaContainer/Fotos_user',
});
cloudinaryControl.uploadFile = async (filePath) => cloudinary.uploader.upload(filePath, {
  folder: 'ueldaContainer/Documentos_user',
});
cloudinaryControl.uploadImagePost = async (filePath) => cloudinary.uploader.upload(filePath, {
  folder: 'ueldaContainer/postAcademico/img',
});
cloudinaryControl.uploadFilePost = async (filePath) => cloudinary.uploader.upload(filePath, {
  folder: 'ueldaContainer/postAcademico/file',
});
cloudinaryControl.deleteFile = async (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = cloudinaryControl;
