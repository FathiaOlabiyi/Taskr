const userModel = require("../auth/auth.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const mongoose = require("mongoose");


const getUserProfile = async(userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid member ID format");
    }

    const profile = await userModel.findById(userId);

    if(!profile || profile.deletedAt !== null){
        throw new Error("User not found")
    };

    return {firstname: profile.firstname, lastname: profile.lastname, email_address: profile.email, profile_picture: profile.profilePicture};
};

const getProfilePicture = async (userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid member ID format");
    }

  const getProfile = await userModel.findById(userId);

  if (!getProfile || getProfile.deletedAt !== null) {
    throw new Error("User not found");
  }

  const profilePicture = getProfile.profilePicture;

  return {profile_picture: profilePicture};
};


const updateProfilePicture = async(userId, profilePicture) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid member ID format");
    }

  const getProfile = await userModel.findById(userId);

  if (!getProfile || getProfile.deletedAt !== null) {
    throw new Error("User not found");
  };

  const options = {
    folder: "tpm-user-profile-pictures",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  if(getProfile.profilePicture.publicId !== null) {
    await cloudinary.uploader.destroy(getProfile.profilePicture.publicId);
  };

  const upload = await cloudinary.uploader.upload(profilePicture.path, options);
  fs.unlinkSync(profilePicture.path);

  getProfile.profilePicture = {url:upload.secure_url, publicId: upload.public_id};
  await getProfile.save();
   return {profile_picture: getProfile.profilePicture};
};

const removeProfilePicture = async(userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid member ID format");
    }
    ;
  const getProfile = await userModel.findById(userId);

  if (!getProfile || getProfile.deletedAt !== null) {
    throw new Error("User not found");
  };

  await cloudinary.uploader.destroy(getProfile.profilePicture.publicId);

  getProfile.profilePicture = {url: "https://res.cloudinary.com/djlroslfh/image/upload/v1756226223/default-admin_kevzdt.png", publicId: null};
    await getProfile.save();
};

module.exports = {
  getUserProfile,
  getProfilePicture,
  updateProfilePicture,
  removeProfilePicture
};

