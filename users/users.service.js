const userModel = require("../auth/auth.model");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


const getUserProfile = async(userId) => {
    const profile = await userModel.findById(userId);

    if(!profile || profile.deletedAt != null){
        throw new Error("User not found")
    };

    return [profile.firstname, profile.lastname, profile.email, profile.profilePicture];
};

const getProfilePicture = async (userId) => {
  const getProfile = await userModel.findById(userId);

  if (!profile || profile.deletedAt != null) {
    throw new Error("User not found");
  }

  const profilePicutre = getProfile.profilePicture;

  return profilePicture;
};


const updateProfilePicture = async(userId, profilePicture) => {
  const getProfile = await userModel.findById(userId);

  if (!profile || profile.deletedAt != null) {
    throw new Error("User not found");
  };

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  const upload = await cloudinary.uploader.upload(profilePicture.path, options, { folder: "tpm-user-profile-pictures"});
  fs.unlinkSync(profilePicture.path);
  console.log(upload);

  getProfile.profilePicture = upload.secure_url;
  await getProfile.save();
   return [upload.public_id, getProfile];
};

const removeProfilePicture = async(userId) => {
  const getProfile = await userModel.findById(userId);

  if (!profile || profile.deletedAt != null) {
    throw new Error("User not found");
  };

  getProfile.profilePicture =
    "https://res.cloudinary.com/djlroslfh/image/upload/v1756226223/default-admin_kevzdt.png";
    await getProfile.save();
};

module.exports = {
  getUserProfile,
  getProfilePicture,
  updateProfilePicture,
  removeProfilePicture
};

