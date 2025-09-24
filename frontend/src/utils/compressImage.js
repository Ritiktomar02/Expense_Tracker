import imageCompression from "browser-image-compression";

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5, 
    maxWidthOrHeight: 400, 
    useWebWorker: true,
  };
  return await imageCompression(file, options);
};
