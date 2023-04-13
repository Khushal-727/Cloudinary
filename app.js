const express = require("express");
const app = express();
const { uploadImage, getImage } = require("./upload.controller");
const { upload } = require("./upload.service");

const port = 8594;
app.use(express.json());

app.get("/img/get", getImage);
app.post("/img/put", upload.single("image"), uploadImage);

app.listen(port, () => {
    console.log("Server is listening on port http://localhost:8594/");
});
