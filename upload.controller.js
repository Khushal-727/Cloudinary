const { uploadToCloudinary } = require("./upload.service");
const { ErrorHandler } = require("./errorHandler");
const { bufferToDataURI } = require("./file");
const cloudinary = require("cloudinary");

const uploadImage = async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) return res.status(400).send("Image is required");

        const fileFormat = file.mimetype.split("/")[1];
        const { base64 } = bufferToDataURI(fileFormat, file.buffer);

        const imageDetails = await uploadToCloudinary(base64, fileFormat);

        res.json({
            status: "success",
            message: "Upload successful",
            data: imageDetails,
        });
    } catch (error) {
        next(new ErrorHandler(error.statusCode || 500, error.message));
    }
};

const getImage = async (req, res, next) => {
    const { filename } = req.body;
    try {
        if (filename != null) {
            filename = "dev/" + filename;
            const ui1 = cloudinary.url("dev/img2.jpg");
            return res.send(ui1);
        }
    } catch (error) {
        next(new ErrorHandler(error.statusCode || 500, error.message));
    }
};

module.exports = {
    uploadImage,
    getImage,
};
