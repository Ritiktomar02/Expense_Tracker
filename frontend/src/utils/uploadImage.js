import { API_PATHS } from "./apiPaths";
import axiosinstance from "./axiosInstance";

const uploadImage=async(imageFile)=>{
    const formdata=new FormData();
    formdata.append('image',imageFile)

    try{
        const res=await axiosinstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formdata,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        return res.data.imageurl;

    }catch(err){
        console.error("Error uploading the image:",err)
        throw err;
    }
}

export default uploadImage