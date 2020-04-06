const User = require("../models/user");
const bcrypt = require('bcryptjs');
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async function ({ userInput }, req) {
        // const email = args.userInput.email;
        const errors = []
        const email = userInput.email;
        console.log("email", email, userInput)
        if (!validator.isEmail(email)) {
            errors.push({ message: "Email is invalid!" });
        }

        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            console.log("ABD1")
            errors.push({ message: "Password is invalid!" });
        }

        if (errors.length > 0) {
            console.log("ABD2")
            const error = new Error("Invalid input.");
            error.data = errors;
            error.code = 422;
            console.log("ABD2")
            throw error;
        }
        console.log("ABD3")
        const existingUser = await User.findOne({ email: email });
        console.log("ABD", existingUser)
        if (existingUser) {
            const error = new Error(" User Exist already !");
            throw error
        }
        const hashedPwd = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: email,
            name: userInput.name,
            password: hashedPwd
        })
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() }
    },

    login: async function ({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("User Not Fount !!!");
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Password Doesn't match !!!");
            error.code = 401;
            throw error;
        }
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, "somesupersecretstring", { expiresIn: '1h' })

        return { token: token, userId: user._id.toString() };
    }
}