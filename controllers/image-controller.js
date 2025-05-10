const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const Image = require('../models/Image');
const cloudinary = require('../config/cloudinary')


const uploadImage = async (req, res) => {
    try {
        console.log("Request Headers:", req.headers);
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        console.log("Request User Info:", req.userInfo);
        // Check if file is missing in request obj
        if (!req.file) {
            console.log('No file uploaded!');
            return res.status(400).json({
                success: false,
                message: 'file missing'
            });
        }

        // Log file path before uploading to Cloudinary
        console.log('File path:', req.file.path);

        // Upload the file to Cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);
        console.log('Uploaded to Cloudinary:', url);

        // Store img url and public id along with user id in DB
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newlyUploadedImage.save();
        res.status(201).json({
            success: true,
            message: 'file uploaded',
            data : newlyUploadedImage
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        });
    }
};

const fetchImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page-1)*limit
        
        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        const totalImages = await Image.countDocuments()
        const totalPages = Math.ceil(totalImages / limit)

        const sortObj = {}
        sortObj[sortBy] = sortOrder

        const images = await Image.find().sort(sortObj).skip().limit(limit)

        if(images){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages, 
                data : images
            })
        }
    }catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        });
    }
}

const deleteImages = async (req, res) =>{
    try{
        //get image id
        const imageToBeDeletedID = req.params.id
        //get user id
        const currentUserId = req.userInfo.userId
        //find current image
        const imageInfo = await Image.findById(imageToBeDeletedID)
        //make sure image is present
        if(!imageInfo){
            return res.status(404).json({
                success : false,
                message : "image not found"
            })
        }
        //must be admin and must be same admin 
        if(imageInfo.uploadedBy.toString() !== currentUserId){
            return res.status(403).json({
                success : false,
                message : "image was uploaded by different admin"
            })
        }
        //delete from cloudinary
        await cloudinary.uploader.destroy(imageInfo.publicId)
        //delete from mongodb
        await Image.findByIdAndDelete(imageToBeDeletedID)

        res.status(200).json({
            success : true,
            message : 'image deleted successfully'
        })

    }catch(e){
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'something went wrong'
        });
    }
}

module.exports = {
    uploadImage, 
    fetchImages,
    deleteImages
}
