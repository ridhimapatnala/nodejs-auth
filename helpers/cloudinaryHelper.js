const cloudinary = require('../config/cloudinary')

const uploadToCloudinary = async (filepath) => {
    try{
        const result = await cloudinary.uploader.upload(filepath)
        return {
            url : result.secure_url,
            publicId : result.public_id
        }
    }catch(error){
        console.error('error uploading to cloudinary:', error)
        throw new Error('error uploading to cloudinary')
    }
}

module.exports = {
    uploadToCloudinary
}