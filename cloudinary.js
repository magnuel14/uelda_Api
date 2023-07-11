
const cloudinary = require('cloudinary').v2;

const cloudinaryControl = {};

// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

cloudinaryControl.uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'ueldaContainer/Fotos_user'
  })
}
cloudinaryControl.uploadFile = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'ueldaContainer/Documentos_user'
  })
}
cloudinaryControl.deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}

module.exports = cloudinaryControl;