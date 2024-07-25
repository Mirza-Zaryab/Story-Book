import React, { useEffect, useState, useRef, useContext } from 'react'
import PopupAlert from "../../components/PopupAlert";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import AwsConfig from "../../AwsConfig";
import {AiOutlineEdit} from "react-icons/ai"
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { profileImg as storeImg, username as setStoreusername } from '../../features/profileSlice.js';
import { AuthContext } from '../../Auth';
import ProfileCroper from '../../components/profileCropper';


const Settings = ({ setLoading }) => {
    const dispatch=useDispatch();
    const imgUrl = useSelector((state) => state.profile.profileImg);
    const [firstName, setFirstName]=useState("")
    const [lastName, setLastName]=useState("")
    const [oldUsername, setOldUsername]=useState("")
    const [username, setUsername]=useState("")
    const [profileImg, setProfileImg]= useState("");
    const [message, setMessage]=useState("");
    const [disable, setDisable]=useState(true)
    const [usernameErrorMessage,setusernameErrorMessage]=useState("")
    const [deletePopup, setDeletePopup]=useState(false)
    const [newImg, setNewImg]=useState();
    const inputRef = useRef(null);
    const [canEdit, setCanEdit]=useState(false)
    const fileInputRef = useRef(null);
    const [editFirst, setEditFirst]=useState(false)
    const [editLast, setEditLast]=useState(false)
    const inputRefFirst = useRef(null);
    const inputRefLast = useRef(null);

    const { logout } = useContext(AuthContext);

    const [typingTimeout, setTypingTimeout] = useState(null);

    const [isCrop, setIsCrop] = useState(false);
    const [uploadImg, setUploadImg] = useState("");
    const [imageSelected, setImageSelected] = useState("");
    const [image, setImage]=useState("");
    const [isChange, setChange] = useState(false);

    const handleUsername = (event) => {
        setUsername(event.target.value)
        const { value } = event.target;

        if (typingTimeout) {
        clearTimeout(typingTimeout);
        }

        const newTypingTimeout = setTimeout(() => {
        if (value.trim() !== '') {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/signup/verifyUsername`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: value }),
            }).then((res) => {
            console.log(res)
            if (res.status == 200) {
                setusernameErrorMessage("")
                setDisable(false)
            }
            else if (res.status == 400) {
                setDisable(true)
                setusernameErrorMessage("This username is already taken. Try another one.")
            }
            else {
                setDisable(true)
                setusernameErrorMessage("Internal Server Error")
            }
            })
            console.log("check username", value)
        }
        }, 200);

        setTypingTimeout(newTypingTimeout);
    };

    const handleFirstName=(event)=>{
        setFirstName(event.target.value)
        setDisable(false)
    }
    const handleLastName=(event)=>{
        setLastName(event.target.value)
        setDisable(false)
    }
    const handleEditClickFirst = () => {
        setEditFirst(true);
        setTimeout(() => {
            inputRefFirst.current.focus();
        }, 200);
        
    };
    const handleEditClickLast = () => {
        setEditLast(true);
        setTimeout(() => {
            inputRefLast.current.focus();
        }, 200);
        
    };

    const handleProfileImg=(e)=>{
        return new Promise((resolve, reject) => {
            const selectedImg =e.target.files[0];
            setUploadImg(selectedImg)
            setIsCrop(false)
            setChange(true)
            setDisable(false)
            if (selectedImg) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setImage(event.target.result);
                // setProfileImg(event.target.result);
              };
              reader.readAsDataURL(selectedImg);
            } else {
            }
            
        });

    }

    useEffect(()=>{
        setFirstName(localStorage.getItem("firstName"))
        setLastName(localStorage.getItem("lastName"))
        setUsername(localStorage.getItem("username"))
    },[])

    const handleEditClick = () => {
        setCanEdit(true);
        setTimeout(() => {
            inputRef.current.focus();
        }, 200);
        
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleUpdate=async()=>{
        let access_token=localStorage.getItem("access_token")
        let awsUserId=localStorage.getItem("awsUserId")

        let newUrl=imgUrl;
        if(profileImg){
            if(isCrop){
                const formData = {
                    image: uploadImg,
                    awsUserId
                }
                let response = await axios({
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/api/upload/UserImage`,
                    data: formData,
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    },
                })
                newUrl = response.data.imageUrl
                console.log("res-------img", response.data.imageUrl)
            }
            else{
                const formData = new FormData();
                formData.append('awsUserId', awsUserId);
                formData.append('image', uploadImg);

                let response=await axios({
                    method: 'post',
                    url: `${process.env.REACT_APP_API_BASE_URL}/api/upload/UserImage`,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                newUrl=response.data.imageUrl
            }
        }

        console.log("22222222222",newUrl)
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/update/UserImage`,
            data: { 
                awsUserId: awsUserId,
                imageUrl: newUrl,
                firstName,
                lastName
            }
            
        }).then((res)=>{
                localStorage.setItem("profileImg",newUrl)
                localStorage.setItem("firstName",firstName)
                localStorage.setItem("lastName",lastName)
                dispatch(setStoreusername(username))
                dispatch(storeImg( {imgUrl:newUrl, firstN:firstName, lastN:lastName}))
                setMessage("Updated Successfully")
                setTimeout(() => {
                    setMessage("")
                }, 2000);
                console.log("image update succesfuly")
        }).catch((err)=>{
            console.log("err----",err)
        })
    }

    const handleDelete=async()=>{
        let awsUserId=localStorage.getItem("awsUserId")
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_BASE_URL}/api/deleteBook`,
            data: { awsUserId },
           
          }).then((res)=>{
            axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_BASE_URL}/api/deleteUser`,
                data: { awsUserId },
               
              }).then((res)=>{
                console.log("delete sucess----")
                logout();
              }).catch((err)=>{
                console.log("err while delete user---",err)   
              })  
              
          }).catch((err)=>{
            console.log("err while delete books---",err)
          })
    }

    return (
        <>
            <NavBar />
            <ProfileCroper image={image} setImage={setImage} setProfileImg={setProfileImg} setIsCrop={setIsCrop} setUploadImg={setUploadImg} setImageSelected={setImageSelected} setLoading={setLoading}/>
            <PopupAlert msg={message} bgcolor='bg-teal-500' width='w-1/5' />
            <div className='bg-gray-50 h-screen pt-10'>
                <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md">
                    <div>
                        {/* Username Input */}
                        {
                            (profileImg || imgUrl) ?
                                <img onClick={handleAvatarClick} className="w-24 h-24 mb-4 rounded-full cursor-pointer" src={profileImg? profileImg : imgUrl} alt="Rounded avatar"/>
                            :<FaUserCircle onClick={handleAvatarClick} className='w-20 h-20 mb-4 color-charcoal cursor-pointer' />
                        }
                        <div className="mb-4 relative">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-4 py-2 border rounded-lg shadow-md focus:ring focus:ring-blue-300"
                                placeholder="Enter Username"
                                value={username}
                                onChange={handleUsername}
                                disabled={!canEdit}
                                ref={inputRef}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-4 py-2 border rounded-lg shadow-md focus:ring focus:ring-blue-300"
                                placeholder="Enter First Name"
                                value={firstName}
                                onChange={handleFirstName}
                                disabled={!editFirst}
                                ref={inputRefFirst}
                            />
                            <AiOutlineEdit size={20} onClick={handleEditClickFirst} className='absolute right-2 top-10 cursor-pointer'/>
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Last name</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full px-4 py-2 border rounded-lg shadow-md focus:ring focus:ring-blue-300"
                                placeholder="Enter Last Name"
                                value={lastName}
                                onChange={handleLastName}
                                disabled={!editLast}
                                ref={inputRefLast}
                            />
                            <AiOutlineEdit size={20} onClick={handleEditClickLast} className='absolute right-2 top-10 cursor-pointer'/>
                        </div>
                        
                        {/* Profile Picture Input */}
                        <div className="mb-4">
                        <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
                        <input
                            ref={fileInputRef}
                            onChange={handleProfileImg}
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-lg shadow-md focus:ring focus:ring-blue-300"
                        />
                        </div>

                        <div className="text-right">
                            <span onClick={()=>setDeletePopup(true)} className="text-gray-500 hover:text-blue-700 cursor-pointer">Delete Account ?</span>
                        </div>
                        
                        {/* Save Button */}
                        <div className="mt-6">
                        <button
                            onClick={handleUpdate}
                            disabled={disable}
                            className={`${disable ? "bg-gray-500 cursor-not-allowed":" bg-teal-500 hover:bg-teal-600" } w-full py-2 px-4  text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring focus:ring-blue-300`}
                        >
                            Update
                        </button>
                        </div>
                    </div>
                </div>
            </div>

            { deletePopup &&
                <div id="popup-modal" tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div
                    className="fixed inset-0 w-full h-full bg-black opacity-40"
                    onClick={()=>setDeletePopup(false)}
                ></div>
                <div className="relative w-full max-w-md max-h-full mx-auto">
                    <div className="relative bg-white rounded-lg shadow">
                        <button onClick={()=>setDeletePopup(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this Account?</h3>
                            <button onClick={handleDelete} data-modal-hide="popup-modal" type="button" className="text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Yes, I'm sure
                            </button>
                            <button onClick={()=>setDeletePopup(false)} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">No, cancel</button>
                        </div>
                    </div>
                </div>
                </div>
            }

        </>
      

    )
}

export default Settings