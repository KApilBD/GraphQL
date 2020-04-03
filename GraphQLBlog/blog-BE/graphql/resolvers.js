const User = require("../models/user");
const bcrypt = require('bcryptjs');


module.exports = {
    createUser: async function ({ userInput }, req) {
        // const email = args.userInput.email;
        const email = userInput.email;
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