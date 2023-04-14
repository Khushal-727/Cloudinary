/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const id = sails.config.custom.uuid;
const validate = sails.config.custom.validate;
const bcrypt = sails.config.custom.bcrypt;

module.exports = {
    signup: async function (req, res) {
        validate(req);
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ Failed: errors.array()[0].msg });
        }

        const { name, userName, email, password, mobile } = req.body;

        let user = await Users.findOne({ email: email });
        if (user) {
            console.log("Email Already Exists");
            return res.status(409).json({ Message: "Email Already Exists" });
        }

        user = await Users.findOne({ userName: userName });
        if (user) {
            console.log("Username is already used");
            return res
                .status(409)
                .json({ Message: "Username is already used" });
        }

        const hashPwd = await bcrypt.hash(password, 13);
        let pic = await sails.helpers.fileUpload(req, "user", "pic");

        let data = {
            id: id(),
            name: name,
            userName: userName,
            profilePic: pic,
            email: email,
            password: hashPwd,
            mobile: mobile,
        };

        user = await Users.create(data).fetch();
        console.log("User signup successful");
        return res.status(201).json({
            msg: "Signup successful",
            created_data: user,
        });
    },

    login: async function (req, res) {
        let { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(401)
                .json({ Message: "Enter email-id and password" });
        }

        const oldUser = await Users.findOne({ email: email });
        if (!oldUser) {
            console.log("Email is not Found");
            return res.status(401).json({ Message: "Email is not Found" });
        }

        const cmpPwd = await bcrypt.compare(password, oldUser.password);
        if (!cmpPwd) {
            console.log("User Password is Invalid");
            return res
                .status(401)
                .json({ Message: "User Password is Invalid" });
        }

        const token = await sails.helpers.jwt(oldUser);

        const updatedUser = await Users.updateOne({ email: email }).set({
            token: token,
        });
        if (updatedUser) {
            console.log("User Login successful");
            return res.status(200).json({
                Message: "User Login successful",
                User_id: oldUser.id,
                Token: token,
            });
        }
    },

    logout: async function (req, res) {
        let user = req.userData.userId;

        const updatedUser = await Users.updateOne({ id: user }, { token: "" });
        console.log("User Logout successful");
        return res.status(200).json({
            User_id: updatedUser.id,
            Message: "User Logout successful",
        });
    },
};
