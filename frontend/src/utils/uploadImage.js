import { API_PATHS } from "./apiPaths";
import axiosinstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formdata = new FormData();
  formdata.append("image", imageFile);

  try {
    const res = await axiosinstance.post(
      "https://expense-tracker-backend-ml9d.onrender.com/api/v1/auth/upload-image",
      formdata,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.imageurl;
  } catch (err) {
    console.error("Error uploading the image:", err);
    throw err;
  }
};

export default uploadImage;
