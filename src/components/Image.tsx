import React, { useEffect, useRef } from 'react';
import { GoTrashcan } from 'react-icons/go';

import './style.css';

type ImageProps = {
  images: string;
  removeImages: (params: any) => any;
  attribute: string;
  setAttribute: (value: string | ((prevVar: string) => string)) => void;
};

const Image = ({ images, removeImages, attribute }: ImageProps) => {
  return (
    <div className="${attribute} bg-gray-50 p-2">
      <div className="uploadedImageDiv ">
        <p onClick={() => removeImages(images)} className="delete">
          <GoTrashcan />
        </p>
        <div className="image-div">
          <img src={images} alt="" id="uploadedImage" onClick={removeImages}></img>
        </div>
      </div>
    </div>
  );
};

export default Image;
