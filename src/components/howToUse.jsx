import React from "react";

const HowToUse = () => {
  const handleInnerClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      onClick={(e) => handleInnerClick(e)}
      className="flex flex-col justify-center items-center  p-8"
    >
      <video autoPlay playsInline muted controls width="640" height="360">
        <source
          src="https://s3.us-west-2.amazonaws.com/www.mystoryvault.co/production/Tutorials/storyvault1_burn-in_2508x1080_x264.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default HowToUse;
