const User = require("../models/user");
const bcrypt = require('bcryptjs');
const validator = require("validator");


module.exports = {
    createUser: async function ({ userInput }, req) {
        // const email = args.userInput.email;
        const errors = []
        const email = userInput.email;
        if (!validator.isEmail(email)) {
            errors.push({ message: "Email is invalid!" });
        }
        if (
            validator.isEmpty(userInput.password) ||
            validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: "Password is invalid!" });
        }

        if (errors.length > 0) {
            const error = new Error("Invalid input.")
            throw error;
        }
        const existingUser = await User.findOne({ email: email });
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
    }
}