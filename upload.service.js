// upload.service.js

const multer = require("multer");
const cloudinary = require("cloudinary");
const { ErrorHandler } = require("./errorHandler");

cloudinary.config({
    cloud_name: "dbhci8pfa",
    api_key: "528669657513615",
    api_secret: "BzV8abcG9dOBmOw1LoOrEGKljn8",
});

const memoryStorage = multer.memoryStorage();

const upload = multer({
    storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
    try {
        const { uploader } = cloudinary;

        const res = await uploader.upload(
            `data:image/${format};base64,${fileString}`
        );

        return res;
    } catch (error) {
        throw new ErrorHandler(500, error);
    }
};

module.exports = {
    upload,
    uploadToCloudinary,
};
