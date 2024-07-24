import React, { useEffect, useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { useSelector, useDispatch } from 'react-redux';
import './style.css';
import { cropImg, uploadImage } from '../features/bookSlice';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width, height, rotation) {
    const rotRad = getRadianAngle(rotation)

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
async function getCroppedImg(
    imageSrc,
    pixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    const croppedCanvas = document.createElement('canvas')

    const croppedCtx = croppedCanvas.getContext('2d')

    if (!croppedCtx) {
        return null
    }

    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width
    croppedCanvas.height = pixelCrop.height

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    // As Base64 string
    // return croppedCanvas.toDataURL('image/png');

    // As a blob
    return new Promise((resolve, reject) => {
        const id = uuidv4();

        croppedCanvas.toBlob((blob) => {
            const file = new File([blob], `${id}_cropped_image.png`, { type: "image/png" });
            resolve(file);
        }, 'image/png');
    });
}

const ProfileCroper = ({ image, setImage, setProfileImg, setImageSelected, setLoading, setUploadImg, setIsCrop }) => { // file reader image
    const [isOpen, setIsOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState(null);
    const dispatch = useDispatch();

    const [mediaSize, setMediaSize] = useState({
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0,
      })

    const cropperRef = useRef();

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, [])

    const showCroppedImage = useCallback(async () => {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
            )
            if (croppedImage) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImageSelected(event.target.result);
                    setProfileImg(event.target.result);
                    setUploadImg(croppedImage)
                    setIsCrop(true)
                    setImage("")
                    setIsOpen(false)
                    setLoading(false);
                };
                reader.readAsDataURL(croppedImage);
            } else {
                setIsOpen(false)
                setLoading(false);
            }
           
        } catch (e) {
            setLoading(false);
            setIsOpen(false)
            console.error(e)
        }
    }, [croppedAreaPixels, rotation])

    useEffect(() => {
        if (image) {
            setIsOpen(true)
        }
    }, [image])

    const handleSkipCrop=()=>{
        setUploadImg(image)
        setImageSelected(image);
        setProfileImg(image)
        setImage("")
        setIsOpen(false)
    }

    return (
        <>
            {isOpen &&
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        zIndex: 9990,
                    }}
                >
                    <div className='flex flex-col w-2/3 h-4/5 bg-white p-20 rounded-lg shadow-2xl relative'>
                        <div className='absolute top-0 left-0 w-full flex justify-center items-center'>
                            <h1 className='text-lg font-semibold mx-auto'>Crop your image</h1>
                        </div>
                        <div className="" style={{}}>
                            <div className="crop-container">
                                <Cropper
                                    ref={cropperRef}
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1/1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>
                            <div className="controls absolute bottom-0">
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => {
                                        setZoom(e.target.value)
                                    }}
                                    className="zoom-range"
                                />

                                <div onClick={showCroppedImage} className='py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg ml-10 cursor-pointer'>
                                    Done
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ProfileCroper