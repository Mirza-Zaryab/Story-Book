import React, { useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import BookCoverCroper from './bookCoverCroper';
type ImageButtonProps = {
  setImages: (value: boolean | ((prevVar: boolean) => boolean)) => void;
  setImageSelected: (value: string | ((prevVar: string) => string)) => void;
  setLoading:any;
  setUploadImg:any;
  setIsCrop:any;
  setChange:any
};

const ImageButton = ({ setImages, setImageSelected, setLoading, setUploadImg, setIsCrop, setChange }: ImageButtonProps) => {
  const uploadedImage = React.useRef(null);
  const imageUploader: any = React.useRef(null);
  const [image, setImage]=useState("");

  const handleImageUpload = (file:any) => {

    return new Promise((resolve, reject) => {
        
        const selectedImg =file.target.files[0];
        setUploadImg(selectedImg)
        setIsCrop(false)
        setChange(true)
        if (selectedImg) {
          const reader = new FileReader();
          reader.onload = (event:any) => {
            setImage(event.target.result);
          };
          reader.readAsDataURL(selectedImg);
        }

        
    });
};

 

  return ( 
    <div className="imageInput bg-gray-50 rounded-md p-2">
      <BookCoverCroper setIsCrop={setIsCrop} setUploadImg={setUploadImg} image={image} setImageSelected={setImageSelected} setImages={setImages} setLoading={ setLoading }/>
      <input
        className="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageUploader}
      />
      <div className="text-center w-52 h-80 rounded-xl cursor-pointer shadow hover:shadow-lg" onClick={() => imageUploader.current.click()}>
        <div>
          <AiOutlineUpload className='mx-auto mt-28' size={32} />
        </div>
        Click here to upload image
        <img className="" ref={uploadedImage} />
      </div>
    </div>
  );
};

export default ImageButton;
