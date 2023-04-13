const cloudinary = require("cloudinary").v2;

module.exports = {
    friendlyName: "File upload",

    description: "File upload in cloud",

    inputs: {
        req: {
            type: "ref",
        },
        fld: {
            type: "string",
        },
        file: {
            type: "string",
        },
    },

    exits: {
        success: {
            description: "All done.",
        },
    },

    fn: async function (inputs) {
        let file = inputs.req.file(inputs.file);

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
        });

        let data = new Promise(async (Resolve, Reject) => {
            await file.upload(
                {
                    saveAs: function (file, cb) {
                        cb(null, file.filename);
                        // cb(null, inputs.req.body.userName);
                    },
                },

                async (err, detail) => {
                    if (detail.length === 0) {
                        url = " ";
                        return Resolve(url);
                    } else if (err) {
                        return Reject(err);
                    } else {
                        try {
                            const option = {
                                folder: inputs.fld,
                                public_id: `${inputs.req.body.userName}`,
                            };

                            await cloudinary.uploader.upload(
                                detail[0].fd,
                                option,
                                (err, result) => {
                                    let url = result.secure_url;
                                    return Resolve(url);
                                }
                            );
                        } catch (err) {
                            return Reject(err);
                        }
                    }
                }
            );
        });
        return data;
    },
};
