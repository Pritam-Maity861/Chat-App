import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { secretKey } from "../index.js";




//register user...
export const registerUser = asyncHandler(async (req, res) => {
    let { username, email, password, gender, bio, role } = req.body;
    username = username?.trim().toLowerCase();
    email = email?.replace(/\s+/g, "").toLowerCase();
    password = password?.trim();

    if (
        [username, email, gender, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarType = gender === "male" ? "boy" : "girl";
    const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;

    const genSalt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, genSalt);

    const newUser = await User.create({
        username,
        email,
        password: hashPassword,
        gender,
        avatar,
        bio,
        role
    })

    const createdUser = await User.findById(newUser._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));

})



//Login user ...
export const LoginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    email = email?.replace(/\s+/g, "").toLowerCase();
    password = password?.trim();

    if (!email) {
        throw new ApiError(400, "email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = jwt.sign(
        {
            userId: user._id,
            username: user.username,
            role: user.role
        },
        secretKey,
        { expiresIn: "1h" }
    )

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }

    return res.status(201).cookie("accessToken", accessToken, options).json(
        new ApiResponse(201, {
            user: loggedInUser, accessToken
        },
            "user loggedIn successfully."
        )
    )

}
)


//Logout user...
export const LogOutUser = asyncHandler(async (req, res) => {
    res.status(200).cookie("accessToken", "", { expiresIn: 0 }).json(new ApiResponse(200,
        "user logOut successfully."
    ))
})

//verification route controller..
export const getme=asyncHandler((req,res) => {
  res.status(200).json(new ApiResponse(201,{data:req.userId},"user data fetched"))
})
