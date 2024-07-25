import { useEffect, useState, useRef } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import bookCover from '../../assets/coverImage1.png';
import frameCover1 from '../../assets/frameCover1.png';
import frameCover2 from '../../assets/frameCover2.png';
import background from '../../assets/Background.png';
import background2 from '../../assets/Background2.png';

import NavBar from '../../components/bookNavbar';
import Select from 'react-select';
import AppInput from '../../components/AppInput';
import Images from '../../components/Image';
import ImageButton from '../../components/ImageButton';
import ErrorMessage from '../../components/ErrorMessage';
import API from '../../utils/api';
import { login } from '../../features/user';
import axios from 'axios';
import SideBarNav from '../../components/SideBarNav';
import jwtDecode from 'jwt-decode';
import { setQuestions } from '../../features/questionsSlice';
import { setChapters } from '../../features/chaptersSlice';
import './style.css';
import { SketchPicker } from 'react-color';
import { RadioGroup } from '@headlessui/react';
import GoogleFontLoader from 'react-google-fonts';
import html2canvas from 'html2canvas';
import basic from '../../assets/cover_basic.png';
import bigImg from '../../assets/cover_bigimage.png';
import midBar from '../../assets/cover_middlebar.png';
import customImg from '../../assets/custom_cover.png';
import AdobeStock1 from '../../assets/AdobeStock1.jpeg';
import AdobeStock2 from '../../assets/AdobeStock2.jpeg';
import AdobeStock3 from '../../assets/AdobeStock3.jpeg';
import AdobeStock4 from '../../assets/AdobeStock4.jpeg';
import AdobeStock5 from '../../assets/AdobeStock5.jpeg';
import AdobeStock6 from '../../assets/AdobeStock6.jpeg';
import AdobeStock7 from '../../assets/AdobeStock7.jpeg';
import AdobeStock8 from '../../assets/AdobeStock8.jpeg';
import AdobeStock9 from '../../assets/AdobeStock9.jpeg';
import AdobeStock10 from '../../assets/AdobeStock10.jpeg';
import AdobeStock11 from '../../assets/AdobeStock11.jpeg';
import AdobeStock12 from '../../assets/AdobeStock12.jpeg';
import AdobeStock13 from '../../assets/AdobeStock13.jpeg';
import AdobeStock14 from '../../assets/AdobeStock14.jpeg';
import AdobeStock15 from '../../assets/AdobeStock15.jpeg';
import Dedication from '../../assets/dedication2.png';
import MSVLogo from '../../assets/MSV logo balck_teal-2.svg';
import Loader from '../../components/Loader';
import { BsInfoCircle, BsFillArrowDownSquareFill, BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill, BsFillArrowUpSquareFill } from 'react-icons/bs';
import PopupAlert from "../../components/PopupAlert";


const validationSchema = Yup.object().shape({
  project: Yup.object().required().nullable().label('Project Type'),
  orginizer: Yup.string().nullable().label('Originizer'),
  bookTitle: Yup.string().required().min(2).label('Book Title'),
  image: Yup.string().label('Image'),
});

const options = [
  { value: '1', label: 'Life Story' },
  { value: '2', label: 'Life Story - Collaborative' },
  { value: '3', label: 'Special Event' },
  { value: '4', label: 'Mission Memories' }
];
const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const coverImages = [
  {
    imageUrl:
      'https://static.wikia.nocookie.net/npamusic/images/f/fc/NoCoverArt.gif/revision/latest?cb=20120210205601',
  },
  {
    imageUrl:
      bookCover,
  },
  {
    imageUrl: frameCover1,
  },
  {
    imageUrl: frameCover2,
  },
  {
    imageUrl: background,
  },
  {
    imageUrl: background2,
  },
];

const centerTitleImages = [
  { imageUrl: AdobeStock1 },
  { imageUrl: AdobeStock2 },
  { imageUrl: AdobeStock3 },
  { imageUrl: AdobeStock4 },
  { imageUrl: AdobeStock5 },
  { imageUrl: AdobeStock6 },
  { imageUrl: AdobeStock7 },
  { imageUrl: AdobeStock8 },
  { imageUrl: AdobeStock9 },
  { imageUrl: AdobeStock10 },
  { imageUrl: AdobeStock11 },
  { imageUrl: AdobeStock12 },
  { imageUrl: AdobeStock13 },
  { imageUrl: AdobeStock14 },
  { imageUrl: AdobeStock15 }
];

const templates = [
  { templateUrl: basic, name: 'Two-color with image' },
  { templateUrl: bigImg, name: 'Front cover image' },
  { templateUrl: midBar, name: 'Centered title' },
  { templateUrl: customImg, name: 'Custom Cover' }
]

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const bookCoverFonts = [
  'Select Fontstyle',
  'Arial',
  'Times New Roman',
  'Helvetica Neue',
  'Calibri Light',
  'Verdana',
  'Georgia',
  'Cormorant Garamond',
  'Futura',
  'Didact Gothic',
  'Bodoni Moda',
  'Franklin Gothic',
  'Roboto',
  'Open Sans',
  'Lumanosimo',
  'Dancing Script',
  'Caveat'
];

const textFontsize = ['Select Fontsize', '16px', '18px', '20px', '24px', '30px'];

// link image not pick while blob
export default function BookSetupPage({ setLoading }) {
  const elementRef = useRef(null);
  const destinationRef = useRef(null);
  const backCoverRef = useRef(null);

  const [bookData, setBookData] = useState({});
  const [images, setImages] = useState(false);
  const [imageSelected, setImageSelected] = useState("");
  const [coverImage, setCoverImage] = useState(false);
  const [coverImageSelected, setCoverImageSelected] = useState('');
  const [borderCover, setBorderCover] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [popup, setPopup] = useState(false);

  const [message, setMessage] = useState("");

  const [attribute, setAttribute] = useState('');
  const [error, setError] = useState({
    message: '',
    visible: false,
  });
  const { state } = useLocation();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('title');
  const [textColor, setTextColor] = useState('#fff');
  const [title, setTitle] = useState({
    color: '#000',
    font: '',
  });
  const [header, setHeader] = useState({
    color: '#000',
    font: '',
  });
  const [author, setAuthor] = useState({
    color: '#000',
    font: '',
  });
  const [description, setDescription] = useState({
    color: '#000',
    font: '',
  });
  const [bookColor, setBookColor] = useState('#9B9B9B');
  const [leftText, setLeftText] = useState('#000');
  const [selectedFont, setSelectedFont] = useState('');
  const [selectedFontsize, setSelectedFontsize] = useState('');
  const [toggle, setToggle] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const [bookName, setBookName] = useState('');
  const [centerTitleBg, setCenterTitleBg] = useState('');
  const [loader, setLoader] = useState(false);
  const [reload, setReload] = useState(false);
  const [titleError, setTitleError] = useState("")
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [uploadImg, setUploadImg] = useState("");
  const [isCrop, setIsCrop] = useState(false);
  const [isChange, setChange] = useState(false);
  const [autherError, setAutherError] = useState("");
  const [subtitleError, setSubtitleError] = useState("")
  const [dedicationError, setDedicationError] = useState("")
  const oldTitle = bookData?.title;

  const [titleLeft, setTitleLeft] = useState(0)
  const [titleTop, setTitleTop] = useState(30)

  const [subLeft, setSubLeft] = useState(0)
  const [subTop, setSubTop] = useState(10)

  const [showFrontPopup, setShowFrontPopup] = useState(false)
  const [showBackPopup, setShowBackPopup] = useState(false)

  const [showPopup, setShowPopup]= useState(false)
  const [showPopupBack, setShowPopupBack]= useState(false)
  const [showOriginal, setShowOriginal]= useState(true)


  const handleTLeft = () => {
    if (titleLeft > -270)

      setTitleLeft(parseInt(titleLeft) - 4)
  }
  const handleTRight = () => {
    if (titleLeft < 300)
      setTitleLeft(parseInt(titleLeft) + 4)
  }
  const handleTTop = () => {
    if (titleTop > -20)
      setTitleTop(parseInt(titleTop) - 4)
  }
  const handleTBottom = () => {
    if (titleTop < 500)
      setTitleTop(parseInt(titleTop) + 4)
  }

  const handleSLeft = () => {
    if (subLeft > -330)
      setSubLeft(parseInt(subLeft - 4))
  }
  const handleSRight = () => {
    if (subLeft < 320)
      setSubLeft(parseInt(subLeft) + 4)
  }
  const handleSTop = () => {
    if (subTop > -270)
      setSubTop(parseInt(subTop) - 4)
  }
  const handleSBottom = () => {
    if (subTop < 260)
      setSubTop(parseInt(subTop) + 4)
  }


  const [show, setShow] = useState(true);

  const initialValues = { project: options.find((data) => data.value == bookData?.bookType), orginizer: bookData?.author, bookTitle: bookData?.title, header: bookData?.header_text, image: '', description: bookData?.description };

  const location = useLocation();


  useEffect(() => {
    if (reload) {
      window.location.reload()
    }

  }, [location])

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleChangeSize = (e) => {
    setSelectedFontsize(e.target.value);

    if (selectedText == 'title') {
      setTitle((prevState) => ({ ...prevState, font: e.target.value }));
    } else if (selectedText == 'header') {
      setHeader((prevState) => ({ ...prevState, font: e.target.value }));
    } else if (selectedText == 'author') {
      setAuthor((prevState) => ({ ...prevState, font: e.target.value }));
    } else if (selectedText == 'description') {
      setDescription((prevState) => ({ ...prevState, font: e.target.value }));
    }
  };
  useEffect(() => {
    if (state.bookId) {
      getBookData();
      setImages(true)
    }
  }, []);

  useEffect(() => {
    if (toggle === true) {
      setTimeout(() => {
        setToggle(false)
      }, 4000)
    }
  }, [toggle]);



  const getBookData = async () => {
    await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API_BASE_URL}/api/book/getBookById/${state.bookId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    }).then((res) => {
      setBookData(res.data);
      setBookName(res.data.title)
      if (res.data.cover_template_id == 2) {
        setCenterTitleBg(res.data.image);
      }
      fetchFrontImageAndConvert(res.data.image)
      setBookColor(res.data.book_color);
      setCurrentIndex(res.data.template_id)
      setTemplateIndex(res.data.cover_template_id)
      setReload(true);

      if (res.data.template_id === 0) {
        setCoverImageSelected('');
        setBorderCover('');
      } else if (res.data.template_id === 1) {
        setCoverImageSelected('');
        setBorderCover(bookCover);
      } else {
        setCoverImageSelected(coverImages[res.data.template_id].imageUrl)
        setBorderCover('');
      }

      setTitle({ color: res?.data?.title_color || "#000", font: res.data.title_fontSize || "16px" })
      setHeader({ color: res?.data?.subtitle_color || "#000", font: res.data.subtitle_fontSize || "16px" })
      setAuthor({ color: res?.data?.author_color || "#000", font: res.data.author_fontSize || "16px" })
      setDescription({ color: res?.data?.dedication_color || "#000", font: "16px" })
      setLeftText(res?.data?.spine_color || "")

      setSelectedFont(res.data.font || "")
      setSelectedFontsize(res.data.title_fontSize || "16px")

      setTextColor(res?.data?.title_color || "#000");
      console.log("res?.data?------", res?.data)
      setTitleLeft(res?.data?.bookTitle_left || 0)
      setTitleTop(res?.data?.bookTitle_top || 30)
      setSubLeft(res?.data?.subtitle_left || 0)
      setSubTop(res?.data?.subtitle_top || 10)

      

    }).catch((err) => {

    })
  }

  const removeImages = (id) => {
    setImages(false);
    setImageSelected('');
  };

  //Either gets the upload button or if image is uploaded, gets image
  const getImageContent = () => {
    if (images) {
      return (
        <Images
          images={imageSelected}
          attribute={attribute}
          removeImages={removeImages}
          setAttribute={setAttribute}
        />
      );
    } else {
      return (
        <>
          <ImageButton setChange={setChange} setIsCrop={setIsCrop} setUploadImg={setUploadImg} setImages={setImages} setImageSelected={setImageSelected} setLoading={setLoading} />
          <ErrorMessage error={error.message} visible={error.visible} />
        </>
      );
    }
  };

  async function fetchFrontImageAndConvert(ImageUrl) {
    try {
      const response = await fetch(ImageUrl, {
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        setImageSelected(dataURL);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
    }
  }

  const CopyStylesRecursive = (sourceElement, destinationElement) => {
    const sourceStyles = window.getComputedStyle(sourceElement);

    Array.from(sourceStyles).forEach((styleName) => {
      destinationElement.style[styleName] = sourceStyles[styleName];
    });

    // Recursively copy styles for child elements
    for (let i = 0; i < sourceElement.children.length; i++) {
      const sourceChild = sourceElement.children[i];
      const destinationChild = destinationElement.children[i];

      if (sourceChild && destinationChild) {
        CopyStylesRecursive(sourceChild, destinationChild);
      }
    }
  };

  const handleSubmit = async (userValues) => {
    setShowOriginal(false)
    setShowPopup(true)
    setLoader(true)
    if (autherError || titleError || subtitleError || dedicationError) {
      window.scrollTo(0, 100);
      return;
    }


    setLoading(true)
    setImageSelected(imageSelected);
    let imgUrl = "";

    if (isChange) {
      if (isCrop) {  // for cropped img
        const formData = {
          image: uploadImg
        }
        let response = await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API_BASE_URL}/api/upload/coverImage`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        imgUrl = response.data.imageUrl
        console.log("res-------img", response.data.imageUrl)

      }
      else { // for simple selected img
        const formData = new FormData();
        formData.append('image', uploadImg);

        let response = await axios({
          method: 'post',
          url: `${process.env.REACT_APP_API_BASE_URL}/api/upload/coverImage`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        imgUrl = response.data.imageUrl
      }
    }
    else {
      imgUrl = imageSelected
    }
    setShowFrontPopup(true)
    await new Promise(resolve => setTimeout(resolve, 500));
    const awsId = jwtDecode(localStorage.getItem('jwtToken'));
    const userId = localStorage.getItem("awsUserId")
    const firstH1Text = elementRef.current.querySelector('h1').textContent;
    const canvas = await html2canvas(elementRef.current, { useCORS: true, allowTaint: true, }, { scale: 5 }); // Capture the canvas as an image
    setShowFrontPopup(false)
    // await new Promise(resolve => setTimeout(resolve, 2000));

    setShowBack(true);
    setShowPopup(false)
    setShowPopupBack(true)
    setToggle(true);
    saveBackCover(bookName)
    // Convert the canvas data to a Blob
    setLoader(true)
    canvas.toBlob((blob) => {
      // Upload the blob to the server or any other destination
      // You can use the 'fetch' or 'axios' library for this purpose
      const file = new File([blob], 'image.png', { type: 'image/png' });

      // Create FormData and append the File
      const formData = new FormData();
      formData.append('awsUserId', `front${userId + Date.now()}`);
      formData.append('bookName', firstH1Text);
      formData.append('image', file);

      console.log(formData);

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/upload/image`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      })
        .then((response) => {
          const tokenData = jwtDecode(localStorage.getItem('jwtToken'));
          const  userId = localStorage.getItem("awsUserId")
          let newBook = {
            book_color: bookColor,
            title: userValues?.bookTitle,
            header_text: userValues?.header,
            description: userValues?.description,
            template_id: currentIndex,
            cover_template_id: templateIndex,
            image: templateIndex == 2 ? centerTitleBg : imgUrl,
            author: userValues?.orginizer,
            bookType: userValues?.project?.value,
            startDate: new Date(),
            lastUpdatedDate: new Date(),
            deadline: new Date(),
            awsUserId: userId,
            frontCover: response.data.imageUrl,

            title_color: title?.color,
            author_color: author?.color,
            subtitle_color: header?.color,
            dedication_color: description?.color,
            spine_color: leftText,
            font: selectedFont,   // font family
            title_fontSize: title?.font,
            subtitle_fontSize: header?.font,
            author_fontSize: author?.font,
            bookTitle_top: titleTop.toString(),
            subtitle_top: subTop.toString(),
            bookTitle_left: titleLeft.toString(),
            subtitle_left: subLeft.toString()

          };

          if (userValues.image === '') {
            userValues.image = imageSelected;
          }
          dispatch(setQuestions([]));
          dispatch(setChapters([]));

          if (state.bookId) {
            let updateBook = {
              bookId: state.bookId,
              book_color: bookColor,
              title: userValues?.bookTitle,
              header_text: userValues?.header,
              description: userValues?.description,
              template_id: currentIndex,
              cover_template_id: templateIndex,
              image: templateIndex == 2 ? centerTitleBg : imgUrl,
              author: userValues?.orginizer,
              bookType: userValues?.project?.value,
              startDate: new Date(),
              lastUpdatedDate: new Date(),
              deadline: new Date(),
              awsUserId: userId,
              frontCover: response.data.imageUrl,

              title_color: title?.color,
              author_color: author?.color,
              subtitle_color: header?.color,
              dedication_color: description?.color,
              spine_color: leftText,
              font: selectedFont,  // font family
              title_fontSize: title?.font,
              subtitle_fontSize: header?.font,
              author_fontSize: author?.font,
              bookTitle_top: titleTop.toString(),
              subtitle_top: subTop.toString(),
              bookTitle_left: titleLeft.toString(),
              subtitle_left: subLeft.toString()

            };

            axios({
              method: 'PUT',
              url: `${process.env.REACT_APP_API_BASE_URL}/api/book/update`,
              headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
              },
              data: updateBook,
            })
              .then((response) => {
                setLoader(false)
                navigate('/dashboard');
              })
              .catch((error) => {
                setLoader(false)
                setShowPopup(false)
                setShowPopupBack(false)
                setShowOriginal(true)
                console.error(error);
              });
          }
          else {
            axios({
              method: 'post',
              url: `${process.env.REACT_APP_API_BASE_URL}/api/book/create`,
              headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
              },
              data: newBook,
            })
              .then((response) => {
                setLoader(false)
                const bookId = response.data.data.data.bookId;
                navigate(`/chapterselection/book/${bookId}`, { state: { bookFlag: 'new', project: userValues.project.label } });
              })
              .catch((error) => {
                setLoader(false)
                setShowPopup(false)
                setShowPopupBack(false)
                setShowOriginal(true)
                setMessage(error.response.data.message)
                setTimeout(() => {
                  setMessage("")
                }, 5000);
              });
          }
        })
        .catch((error) => {
          setLoader(false)
          setShowPopup(false)
          setShowPopupBack(false)
          setShowOriginal(true)
        });
    });
  };

  const handleChangeComplete = (color) => {
    setTextColor(color.hex);

    if (selectedText == 'title') {
      setTitle((prevState) => ({ ...prevState, color: color.hex }));
    } else if (selectedText == 'header') {
      setHeader((prevState) => ({ ...prevState, color: color.hex }));
    } else if (selectedText == 'author') {
      setAuthor((prevState) => ({ ...prevState, color: color.hex }));
    } else if (selectedText == 'bookCover') {
      setBookColor(color.hex);
    } else if (selectedText == 'leftSideText') {
      setLeftText(color.hex);
    } else if (selectedText == 'description') {
      setDescription((prevState) => ({ ...prevState, color: color.hex }));
    }
  };

  const saveBackCover = async (title) => {
    const awsId = jwtDecode(localStorage.getItem('jwtToken'));
    const userId = localStorage.getItem("awsUserId")
    setShowBackPopup(true)
    await new Promise(resolve => setTimeout(resolve, 500));
    const canvas = await html2canvas(backCoverRef.current, { scale: 5 }); // Capture the canvas as an image

    // Convert the canvas data to a Blob
    canvas.toBlob(async(blob) => {
      setShowOriginal(true)
      
      const file = new File([blob], 'image.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('awsUserId', `back${userId}`);
      formData.append('bookName', title);
      formData.append('image', file);

      console.log(formData);

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_API_BASE_URL}/upload/image`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        }
      })
        .then(async(response) => {
          setShowPopupBack(false)
          setToggle(false)
        })
        .catch((err) => {
          setShowPopupBack(false)
          setToggle(false)
        })
    })
  }

  const handleAuthor = (event, onChange) => {
    const { value } = event.target;
    if (value.length > 35) {
      setAutherError("Auther must be less than 35 characters")
      if (value.length == 36) {
        onChange(event)
      }
      return;
    }
    else {
      setAutherError("")
      onChange(event)
    }
  }

  const checkTitle = (event) => {

    const { value } = event.target;

    if (oldTitle == value) return

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    let awsUserId = localStorage.getItem("awsUserId")

    const newTypingTimeout = setTimeout(() => {
      if (value.trim() !== '') {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bookExist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: value, awsUserId: awsUserId }),
        }).then((res) => {
          console.log(res)
          if (res.status == 200) {
            setTitleError("")
          }
          else if (res.status == 400) {
            setTitleError("Book title already taken. Try another one.")
          }
        })
      }
    }, 100);

    setTypingTimeout(newTypingTimeout);
  };

  const handleTitleChar = (event, onChange) => {
    const { value } = event.target;
    if (value.length > 40) {
      setTitleError("Book title must be less than 40 characters")
      if (value.length == 41) {
        onChange(event)
        setBookName(event.target.value)
      }
      clearTimeout(typingTimeout);
      return;
    }
    else {
      setTitleError("")
      onChange(event)
      setBookName(event.target.value)
      checkTitle(event)
    }


  }

  const handleDedication = (event, onChange) => {
    const { value } = event.target;
    if (value.length > 950) {
      setDedicationError("Dedication must be less than 950 characters")
      if (value.length == 951) {
        onChange(event)
      }
      return;
    }
    else {
      setDedicationError("")
      onChange(event)
    }
  }
  const handleSubtitle = (event, onChange) => {
    const { value } = event.target;
    if (value.length > 30) {
      setSubtitleError("Subtitle must be less than 30 characters")
      if (value.length == 31) {
        onChange(event)
      }
      return;
    }
    else {
      setSubtitleError("")
      onChange(event)
    }
  }

  useEffect(() => {
    setShow(selectedText != "leftSideText")

    if (selectedText == 'title') {
      setTextColor(title.color);
    } else if (selectedText == 'header') {
      setTextColor(header.color);
    } else if (selectedText == 'author') {
      setTextColor(author.color)
    } else if (selectedText == 'bookCover') {
      setTextColor(bookColor)
    } else if (selectedText == 'leftSideText') {
      setTextColor(textColor.color)
    } else if (selectedText == 'description') {
      setTextColor(description.color)
    }
  }, [selectedText])

  return (
    <>
      {loader && <Loader />}
      <PopupAlert msg={message} bgcolor='bg-red-500' width='w-1/5' />

      <div className="h-full w-screen flex">
        <SideBarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="w-full">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(userValues) => handleSubmit(userValues)}
            validationSchema={validationSchema}
          >
            {({ handleChange, values, setFieldValue }) => {
              return (
                <div className="min-h-full">
                  <div className="bg-gray-800 pb-32">
                    <NavBar setSidebarOpen={setSidebarOpen} />
                    <header className="py-10">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-white">Let's Design Your Book Cover</h1>
                      </div>
                    </header>
                  </div>

                  <main className="-mt-32">
                    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-20">
                      <div className="bg-white rounded-lg shadow  overflow-hidden">
                        <div className="min-h-full grid grid-cols-1 xl:grid-cols-2">
                          <div className=" flex-1 flex flex-col justify-center py-12 px-2 sm:px-6  lg:pr-4 xl:pr-4">
                            <Form className="space-y-6 mt-6" action="#" method="POST">
                              <p>Start by selecting the type of book this will be</p>

                              <div>
                                <label
                                  htmlFor="book"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Select a project
                                </label>
                                <div className="mt-1">
                                  <Select
                                    id="book"
                                    name="project"
                                    options={options}
                                    value={values.project}
                                    isDisabled={state.bookId && true}
                                    onChange={(item) => setFieldValue('project', item)}
                                  />
                                </div>
                              </div>
                              <AppInput
                                title="Author (Optional)"
                                id="orginizer"
                                name="orginizer"
                                type="text"
                                autoComplete="orginizer"
                                value={values.orginizer}
                                onChange={(event) => handleAuthor(event, handleChange)}
                              />
                              <p style={{ marginTop: "0px" }} className='text-red-500'>{autherError}</p>
                              <p>Now lets come up with a title</p>
                              <AppInput
                                title="Book title"
                                id="title"
                                name="bookTitle"
                                type="text"
                                autoComplete="title"
                                value={values.bookTitle}
                                showError={false}
                                onChange={(e) => handleTitleChar(e, handleChange)}
                              />
                              <p style={{ marginTop: "0px" }} className='text-red-500'>{titleError}</p>
                              <AppInput
                                title="Subtitle (Optional)"
                                id="header"
                                name="header"
                                type="text"
                                autoComplete="header"
                                value={values.header}
                                onChange={(e) => handleSubtitle(e, handleChange)}
                              />
                              <p style={{ marginTop: "0px" }} className='text-red-500'>{subtitleError}</p>
                              <div className="">
                                <label for="description" className=" block text-sm font-medium text-gray-700 mb-1">
                                  Dedication (Optional)
                                </label>

                                <textarea
                                  onFocus={() => setToggle(true)}
                                  className='appearance-none block w-full px-3 border  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                  id="description"
                                  name="description"
                                  rows="4"
                                  autoComplete="description"
                                  value={values.description}
                                  onChange={(e) => handleDedication(e, handleChange)}
                                  maxLength={templateIndex === 3 ? 700 : 1010}
                                />
                              </div>
                              <p style={{ marginTop: "0px" }} className='text-red-500'>{dedicationError}</p>

                              <div className=''>
                                <div className='flex justify-between'>
                                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                                    Select Book Cover Template
                                  </label>
                                  <span onClick={() => setPopup(true)} className="ml-4 cursor-pointer" data-toggle="tooltip" data-placement="top" title="">
                                    <BsInfoCircle color='teal' />
                                  </span>
                                </div>

                                <div className='flex items-center justify-between space-x-2 w-full'>
                                  {templates.map((data, index) => (
                                    <div onClick={() => { setTemplateIndex(index); }} className={`${templateIndex === index ? 'border-2 border-teal-500' : 'border-2 border-gray-400'} rounded-sm shadow-lg`}>
                                      <img style={{ backgroundColor: index === 3 && '#DDDDDD' }} className='w-32' key={index} src={data.templateUrl} />
                                      <p style={{ fontSize: '11px' }} className='p-1 text-center mx-auto'>{data.name}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <label className=" block text-sm font-medium text-gray-700 mb-1">Select a cover photo</label>
                              {templateIndex !== 2 && <div className="mt-6">{getImageContent()}</div>}
                              {templateIndex === 3 &&
                                <div className="mt-6">
                                  <label className=" block text-sm font-medium text-gray-700 mb-1">Or chose from our selection of covers</label>
                                  <div className="flex" style={{ width: '400px !important', overflowX: 'auto' }}>
                                    {coverImages.map((url, index) => (
                                      <img
                                        onClick={() => {
                                          setCurrentIndex(index)
                                          if (index === 0) {
                                            setFieldValue('image', url.imageUrl);
                                            setCoverImageSelected('');
                                            setBorderCover('');
                                            setCoverImage(true);
                                          } else if (index === 1) {
                                            setFieldValue('image', bookCover);
                                            setCoverImageSelected('');
                                            setBorderCover(bookCover);
                                            setCoverImage(true);
                                          } else {
                                            setFieldValue('image', url.imageUrl);
                                            setCoverImageSelected(url.imageUrl);
                                            setCoverImage(true);
                                            setBorderCover('');
                                          }
                                        }}
                                        className={`${currentIndex === index ? 'border-2 border-[#779B9A]' : ''}  rounded-sm w-28 mr-2 object-cover ${url.imageUrl === bookCover ? 'bg-gray-400' : ''}`}
                                        src={url.imageUrl}
                                      />
                                    ))}
                                  </div>
                                </div>
                              }
                              {templateIndex === 2 &&
                                <div className="mt-6">
                                  <div className="flex" style={{ width: '400px !important', overflowX: 'auto' }}>
                                    {centerTitleImages.map((url, index) => (
                                      <img
                                        onClick={() => {
                                          setCurrentIndex(index)
                                          if (templateIndex === 2) {
                                            setCenterTitleBg(url.imageUrl);
                                          }
                                        }}
                                        className={`${currentIndex === index ? 'border-2 border-[#779B9A]' : ''}  rounded-sm w-28 mr-2 object-cover ${url.imageUrl === bookCover ? 'bg-gray-400' : ''}`}
                                        src={url.imageUrl}
                                      />
                                    ))}
                                  </div>
                                </div>
                              }
                              <div className="flex flex-col justify-center">
                                <button
                                  type="submit"
                                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#134f5c]"
                                >
                                  {state.bookId ? 'Update' : 'Continue'}
                                </button>
                                <p className="text-red-600">{message}</p>
                              </div>
                            </Form>
                          </div>
                          <div>
                            <div className="flex flex-col items-center h-full justify-center pt-14">
                              <div className="flex space-x-3">
                                <SketchPicker
                                  color={textColor}
                                  onChangeComplete={handleChangeComplete}
                                />

                                <div>
                                  <RadioGroup value={selectedText} onChange={setSelectedText}>
                                    <RadioGroup.Label className="block text-sm font-medium text-gray-700 mb-1">
                                      Select to edit
                                    </RadioGroup.Label>
                                    {templateIndex === 3 &&
                                      <RadioGroup.Option value="author">
                                        {({ checked }) => (
                                          <span
                                            className={`${checked ? 'bg-blue-200' : ''
                                              } cursor-pointer px-2 py-0.5 rounded-sm text-sm font-medium text-gray-700`}
                                          >
                                            - Author
                                          </span>
                                        )}
                                      </RadioGroup.Option>
                                    }
                                    {(templateIndex === 1 || templateIndex === 3) &&
                                      <RadioGroup.Option value="title">
                                        {({ checked }) => (
                                          <span
                                            className={`${checked ? 'bg-blue-200' : ''
                                              } cursor-pointer px-2 py-0.5 rounded-sm text-sm font-medium text-gray-700`}
                                          >
                                            - Book Title
                                          </span>
                                        )}
                                      </RadioGroup.Option>
                                    }

                                    {(templateIndex === 1 || templateIndex === 3) &&
                                      <RadioGroup.Option value="header">
                                        {({ checked }) => (
                                          <span
                                            className={`${checked ? 'bg-blue-200' : ''
                                              } cursor-pointer px-2 py-0.5 rounded-sm text-sm font-medium text-gray-700`}
                                          >
                                            - Subtitle
                                          </span>
                                        )}
                                      </RadioGroup.Option>
                                    }
                                    {templateIndex === 3 &&
                                      <RadioGroup.Option value="description">
                                        {({ checked }) => (
                                          <span
                                            className={`${checked ? 'bg-blue-200' : ''
                                              } cursor-pointer px-2 py-0.5 rounded-sm text-sm font-medium text-gray-700`}
                                          >
                                            - Dedication
                                          </span>
                                        )}
                                      </RadioGroup.Option>
                                    }
                                    {/* {templateIndex === 3 &&
                                      <RadioGroup.Option value="leftSideText">
                                        {({ checked }) => (
                                          <span
                                            className={`${checked ? 'bg-blue-200' : ''
                                              } cursor-pointer px-2 py-0.5 rounded-sm text-sm font-medium text-gray-700`}
                                          >
                                            - Spine Text
                                          </span>
                                        )}
                                      </RadioGroup.Option>
                                    } */}

                                    <RadioGroup.Option value="bookCover">
                                      {({ checked }) => (
                                        <span
                                          className={`${checked ? 'bg-blue-200' : ''
                                            } cursor-pointer px-2 py-0.5 rounded-sm text-sm font-medium text-gray-700`}
                                        >
                                          - Book Color
                                        </span>
                                      )}
                                    </RadioGroup.Option>
                                  </RadioGroup>

                                  {(templateIndex === 1 && selectedText == 'title') &&
                                    <div className="flex items-center justify-center space-x-4 mt-2">
                                      <div className="flex flex-col items-center space-y-2">
                                        <BsFillArrowRightSquareFill onClick={handleTRight} size={28} color='teal' className="cursor-pointer" />
                                        <BsFillArrowUpSquareFill onClick={handleTTop} size={28} color='teal' className="cursor-pointer" />
                                      </div>
                                      <div className="flex flex-col items-center space-y-2">
                                        <BsFillArrowDownSquareFill onClick={handleTBottom} size={28} color='teal' className="cursor-pointer" />
                                        <BsFillArrowLeftSquareFill onClick={handleTLeft} size={28} color='teal' className="cursor-pointer" />
                                      </div>
                                    </div>

                                  }

                                  {(templateIndex === 1 && selectedText == 'header') &&
                                    <div className="flex items-center justify-center space-x-4 mt-2">
                                      <div className="flex flex-col items-center space-y-2">
                                        <BsFillArrowRightSquareFill onClick={handleSRight} size={28} color='teal' className="cursor-pointer" />
                                        <BsFillArrowUpSquareFill onClick={handleSTop} size={28} color='teal' className="cursor-pointer" />
                                      </div>
                                      <div className="flex flex-col items-center space-y-2">
                                        <BsFillArrowDownSquareFill onClick={handleSBottom} size={28} color='teal' className="cursor-pointer" />
                                        <BsFillArrowLeftSquareFill onClick={handleSLeft} size={28} color='teal' className="cursor-pointer" />
                                      </div>
                                    </div>

                                  }

                                  {(templateIndex === 3 && show) &&
                                    <>
                                      <div className="mt-5">
                                        <h2 className="block text-sm font-medium text-gray-700 mb-1">
                                          Font Style
                                        </h2>
                                        <GoogleFontLoader fonts={[selectedFont]} />
                                        <select
                                          className="w-44"
                                          value={selectedFont}
                                          onChange={handleFontChange}
                                        >
                                          {bookCoverFonts.map((font, index) => (
                                            <option
                                              style={{ fontFamily: `${font}` }}
                                              key={index}
                                              value={font}
                                              className="block text-sm font-medium text-gray-700"
                                            >
                                              {font}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      {selectedText != "description" &&
                                        <div className="mt-5">
                                          <h2 className="block text-sm font-medium text-gray-700">
                                            Font size
                                          </h2>
                                          <select
                                            className="w-44"
                                            defaultValue={selectedFontsize}
                                            value={selectedFontsize}
                                            onChange={handleChangeSize}
                                          >
                                            {textFontsize.map((fontsize, index) => (
                                              <option key={index} value={fontsize} className="block text-sm font-medium text-gray-700 mb-1">
                                                {fontsize}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      }
                                    </>
                                  }
                                  {(templateIndex === 3 && !show) &&
                                    <div className='w-44 mt-10'>

                                    </div>
                                  }
                                </div>
                              </div>

                              {toggle === false ?
                               <>
                               {showOriginal && 
                                <div className="container">
                                  <div className="book">
                                    <div className="front">
                                      {templateIndex === 0 ?
                                        <div
                                          // ref={elementRef}
                                          className="cover"
                                          style={showFrontPopup ?
                                            {
                                              backgroundColor: '#fff',
                                              // transform: `scale(${3})`,
                                              // transformOrigin: 'top left'
                                            } :
                                            {
                                              backgroundColor: '#fff',
                                            }}
                                        >
                                          <div className='h-full pb-3'>
                                            <div style={{ backgroundColor: bookColor, paddingRight: "52px", paddingTop: "60px" }} className='h-1/3 flex-col pb-7 pl-10'>
                                              <h1
                                                style={{
                                                  fontSize: '18px',
                                                  fontFamily: 'sans-serif',
                                                  color: 'white',
                                                }}
                                                className="capitalize text-right font-semibold"
                                              >
                                                {values.bookTitle}
                                              </h1>
                                              <h1
                                                style={{
                                                  fontSize: '14px',
                                                  fontFamily: 'sans-serif',
                                                  color: 'white',
                                                }}
                                                className="capitalize text-right"
                                              >
                                                {values.header}
                                              </h1>
                                              {values.orginizer ? (
                                                <h1
                                                  style={{
                                                    fontSize: '13px',
                                                    fontFamily: 'sans-serif',
                                                    color: 'white',
                                                  }}
                                                  className="text-right mt-3"
                                                >
                                                  {values.orginizer}
                                                  {/* here */}
                                                </h1>
                                              ) : null}
                                            </div>
                                            <div className='h-2/3 bg-white' style={{ paddingRight: "12px" }}>
                                              {imageSelected ? (
                                                <img
                                                  className="w-full h-full p-5"
                                                  src={imageSelected}
                                                  style={{ border: '5px solid white' }}
                                                  alt="logo"
                                                />
                                              ) : null}
                                            </div>
                                          </div>
                                        </div>
                                        :
                                        templateIndex === 1 ?
                                          <div
                                            // ref={elementRef}
                                            className="cover"
                                            style={showFrontPopup ?
                                              {
                                                backgroundImage: `url(${imageSelected})`,
                                                backgroundSize: '400px 550px',
                                                // transform: `scale(${3})`,
                                                // transformOrigin: 'top left'
                                              } : {
                                                backgroundImage: `url(${imageSelected})`,
                                                backgroundSize: '400px 550px'
                                              }}
                                          >
                                            <div className='h-full flex flex-col'>
                                              <div className='flex-grow  px-3'>
                                              <h1
  style={{
    fontSize: '42px',
    fontFamily: 'roboto',
    color: title.color,
    marginTop: titleTop + "px",
    marginBottom: "30px",
    marginLeft: titleLeft + "px",
    lineHeight: 'normal',
  }}
  className={`capitalize text-center font-normal`}
>
  <span style={{ lineHeight: 0 }}>{values.bookTitle}</span>
</h1>
                                                <h1
                                                  style={{
                                                    fontSize: '14px',
                                                    fontFamily: 'roboto',
                                                    color: header.color,
                                                    marginTop: subTop + "px",
                                                    marginLeft: subLeft + "px"
                                                  }}
                                                  className="uppercase text-center italic"
                                                >
                                                  {values.header}
                                                </h1>
                                              </div>
                                              <div style={{ backgroundColor: '#3A3A3A' }} className='h-10 mt-auto'>
                                                {values.orginizer ? (
                                                  <h1
                                                    style={{
                                                      fontSize: '13px',
                                                      fontFamily: 'Didact Gothic',
                                                      color: 'white',
                                                    }}
                                                    className="lineheight uppercase text-center my-3"
                                                  >
                                                    {values.orginizer}
                                                  </h1>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                          :
                                          templateIndex === 2 ?
                                            <div
                                              // ref={elementRef}
                                              className="cover"
                                              style={showFrontPopup ?
                                                {
                                                  backgroundImage: `url(${centerTitleBg})`,
                                                  backgroundSize: '400px 550px',
                                                  // transform: `scale(${2})`,
                                                  // transformOrigin: 'top left'
                                                } :
                                                {
                                                  backgroundImage: `url(${centerTitleBg})`,
                                                  backgroundSize: '400px 550px'
                                                }}
                                            >
                                              <div className='h-full flex flex-col'>
                                                <div className='h-1/3 bg-white my-auto py-1 flex flex-col justify-between'>
                                                  <hr className='border border-black' />
                                                  <h1
                                                    style={{
                                                      fontSize: `${"30px"}`,
                                                      // fontSize: `${bookName.length > 30 ? "30px" : "42px"}`,
                                                      fontFamily: 'roboto',
                                                      color: '#000',
                                                    }}
                                                    className="capitalize text-center font-normal pl-1 pr-3"
                                                  >
                                                    {values.bookTitle}
                                                  </h1>
                                                  <h1
                                                    style={{
                                                      fontSize: '14px',
                                                      fontFamily: 'roboto',
                                                      color: '#000',
                                                    }}
                                                    className="uppercase text-center italic pr-3"
                                                  >
                                                    {values.header}
                                                  </h1>
                                                  {values.orginizer ? (
                                                    <h1
                                                      style={{
                                                        fontSize: '13px',
                                                        fontFamily: 'Didact Gothic',
                                                        color: '#000',
                                                      }}
                                                      className="uppercase text-center pr-3"
                                                    >
                                                      {values.orginizer}
                                                    </h1>
                                                  ) : null}
                                                  <hr className='border border-black' />
                                                </div>
                                              </div>
                                            </div>
                                            :
                                            <div
                                              // ref={elementRef}
                                              className="cover pr-3 py-3"
                                              style={showFrontPopup ? {
                                                backgroundImage: coverImageSelected
                                                  ? `url(${coverImageSelected})`
                                                  : borderCover
                                                    ? `url(${borderCover})`
                                                    : 'none',
                                                backgroundSize: coverImageSelected
                                                  ? '400px 550px'
                                                  : borderCover
                                                    ? '400px 550px'
                                                    : 'auto',
                                                backgroundColor: coverImageSelected ? 'none' : bookColor,
                                                // transform: `scale(${2})`,
                                                // transformOrigin: 'top left'
                                              } : {
                                                backgroundImage: coverImageSelected
                                                  ? `url(${coverImageSelected})`
                                                  : borderCover
                                                    ? `url(${borderCover})`
                                                    : 'none',
                                                backgroundSize: coverImageSelected
                                                  ? '400px 550px'
                                                  : borderCover
                                                    ? '400px 550px'
                                                    : 'auto',
                                                backgroundColor: coverImageSelected ? 'none' : bookColor,
                                              }}
                                            >
                                              <div className="px-10 py-14 flex flex-col items-center justify-between h-full">
                                                <div>
                                                  <h1
                                                    style={{
                                                      fontSize: title.font,
                                                      fontFamily: selectedFont,
                                                      color: title.color,
                                                    }}
                                                    className="text-2xl text-center"
                                                  >
                                                    {values.bookTitle}
                                                  </h1>
                                                  <h1
                                                    style={{
                                                      fontSize: header.font,
                                                      fontFamily: selectedFont,
                                                      color: header.color,
                                                    }}
                                                    className="text-2xl w-64 text-center mx-auto"
                                                  >
                                                    {values.header}
                                                  </h1>
                                                </div>
                                                {imageSelected ? (
                                                  <img
                                                    width="200px"
                                                    className="mx-auto max-h-72"
                                                    src={imageSelected}
                                                    style={{ border: '5px solid white' }}
                                                    alt="logo"
                                                  />
                                                ) : null}
                                                {values.orginizer ? (
                                                  <h1
                                                    style={{
                                                      fontSize: author.font,
                                                      fontFamily: selectedFont,
                                                      color: author.color,
                                                    }}
                                                    className="text-2xl text-center"
                                                  >
                                                    {values.orginizer}
                                                  </h1>
                                                ) : null}
                                              </div>
                                            </div>
                                      }
                                    </div>
                                    {/* Spine Settings */}
                                    {templateIndex === 0 ?
                                      <div className="left-side" style={{ backgroundColor: '#fff', textAlign: "center", }}>
                                        <h2 style={{ color: '#000', textAlign: "center", width: "550px" }}>
                                          <span style={{ fontSize: "16px" }} className="font-semibold">{""/*values.bookTitle*/}</span>
                                        </h2>
                                      </div>

                                      : templateIndex === 1 ?
                                        <div className="left-side" style={{ backgroundColor: bookColor, textAlign: "center" }}>
                                          <h2 style={{ color: '#000', textAlign: "center" }}>
                                            {/* {
                                          (values.orginizer?.length + values.bookTitle?.length < 45) && 
                                          <span className="">
                                              {values.orginizer && 'Written by:'} {values.orginizer}
                                          </span>

                                        } */}
                                            <span className="">{""/*values.bookTitle*/}</span>
                                          </h2>
                                        </div>
                                        : templateIndex === 2 ?
                                          <div className="left-side" style={{ backgroundColor: bookColor, textAlign: "center" }}>
                                            <h2 style={{ color: '#000', textAlign: "center" }}>
                                              {/* {
                                          (values.orginizer?.length + values.bookTitle?.length < 45) && 
                                          <span className="">
                                              {values.orginizer && 'Written by:'} {values.orginizer}
                                          </span>

                                        } */}
                                              <span className="">{""/*values.bookTitle*/}</span>
                                            </h2>
                                          </div>
                                          :
                                          <div className="left-side" style={{ backgroundColor: bookColor, textAlign: "center" }}>
                                            <h2 style={{ color: leftText, textAlign: "center" }}>
                                              {/* {
                                          (values.orginizer?.length + values.bookTitle?.length < 45) && 
                                          <span className="">
                                              {values.orginizer && 'Written by:'} {values.orginizer}
                                          </span>

                                        } */}
                                              <span className="">{""/*values.bookTitle*/}</span>
                                            </h2>
                                          </div>
                                    }
                                  </div>
                                </div>
                                }
                               {showPopup && 
                                 <div>
                                   <div
                                     style={{
                                       position: 'fixed',
                                       top: 0,
                                       left: 0,
                                       width: '100%',
                                       height: '100%',
                                       display: 'flex',
                                       justifyContent: 'center',
                                       alignItems: 'center',
                                       backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                       zIndex: 7777,
                                     }}
                                     className="flex justify-center items-center h-full"
                                   >
                                     <div className=" bg-white shadow-2xl h-5/6 overflow-scroll w-auto px-5">
                                       <div className="relative">
                                         <div className="container">
                                           <div className="book">
                                             <div className="front">
                                               {templateIndex === 0 ?
                                                 <div
                                                   ref={elementRef}
                                                   className="cover"
                                                   style={showFrontPopup ?
                                                     {
                                                       backgroundColor: '#fff',
                                                       transform: `scale(${3})`,
                                                       transformOrigin: 'top left'
                                                     } :
                                                     {
                                                       backgroundColor: '#fff',
                                                     }}
                                                 >
                                                   <div className='h-full pb-3'>
                                                     <div style={{ backgroundColor: bookColor, paddingRight: "52px", paddingTop: "60px" }} className='h-1/3 flex-col pb-7 pl-10'>
                                                       <h1
                                                         style={{
                                                           fontSize: '18px',
                                                           fontFamily: 'sans-serif',
                                                           color: 'white',
                                                         }}
                                                         className="capitalize text-right font-semibold"
                                                       >
                                                         {values.bookTitle}
                                                       </h1>
                                                       <h1
                                                         style={{
                                                           fontSize: '14px',
                                                           fontFamily: 'sans-serif',
                                                           color: 'white',
                                                         }}
                                                         className="capitalize text-right"
                                                       >
                                                         {values.header}
                                                       </h1>
                                                       {values.orginizer ? (
                                                         <h1
                                                           style={{
                                                             fontSize: '13px',
                                                             fontFamily: 'sans-serif',
                                                             color: 'white',
                                                           }}
                                                           className="text-right mt-3"
                                                         >
                                                           {values.orginizer}
                                                           {/* here */}
                                                         </h1>
                                                       ) : null}
                                                     </div>
                                                     <div className='h-2/3 bg-white' style={{ paddingRight: "12px" }}>
                                                       {imageSelected ? (
                                                         <img
                                                           className="w-full h-full p-5"
                                                           src={imageSelected}
                                                           style={{ border: '5px solid white' }}
                                                           alt="logo"
                                                         />
                                                       ) : null}
                                                     </div>
                                                   </div>
                                                 </div>
                                                 :
                                                 templateIndex === 1 ?
                                                   <div
                                                     ref={elementRef}
                                                     className="cover"
                                                     style={showFrontPopup ?
                                                       {
                                                         backgroundImage: `url(${imageSelected})`,
                                                         backgroundSize: '400px 550px',
                                                         transform: `scale(${3})`,
                                                         transformOrigin: 'top left'
                                                       } : {
                                                         backgroundImage: `url(${imageSelected})`,
                                                         backgroundSize: '400px 550px'
                                                       }}
                                                   >
                                                     <div className='h-full flex flex-col'>
                                                       <div className='flex-grow  px-3'>
                                                         <h1
                                                           style={{
                                                             fontSize: '42px',
                                                             fontFamily: 'roboto',
                                                             color: title.color,
                                                             marginTop: titleTop + "px",
                                                             marginLeft: titleLeft + "px"
                                                           }}
                                                           className={`capitalize text-center font-normal`}
                                                         >
                                                           {values.bookTitle}
                                                         </h1>
                                                         <h1
                                                           style={{
                                                             fontSize: '14px',
                                                             fontFamily: 'roboto',
                                                             color: header.color,
                                                             marginTop: subTop + "px",
                                                             marginLeft: subLeft + "px"
                                                           }}
                                                           className="uppercase text-center italic"
                                                         >
                                                           {values.header}
                                                         </h1>
                                                       </div>
                                                       <div style={{ backgroundColor: '#3A3A3A' }} className='h-10 mt-auto'>
                                                         {values.orginizer ? (
                                                           <h1
                                                             style={{
                                                               fontSize: '13px',
                                                               fontFamily: 'Didact Gothic',
                                                               color: 'white',
                                                             }}
                                                             className="lineheight uppercase text-center my-3"
                                                           >
                                                             {values.orginizer}
                                                           </h1>
                                                         ) : null}
                                                       </div>
                                                     </div>
                                                   </div>
                                                   :
                                                   templateIndex === 2 ?
                                                     <div
                                                       ref={elementRef}
                                                       className="cover"
                                                       style={showFrontPopup ?
                                                         {
                                                           backgroundImage: `url(${centerTitleBg})`,
                                                           backgroundSize: '400px 550px',
                                                           transform: `scale(${2})`,
                                                           transformOrigin: 'top left'
                                                         } :
                                                         {
                                                           backgroundImage: `url(${centerTitleBg})`,
                                                           backgroundSize: '400px 550px'
                                                         }}
                                                     >
                                                       <div className='h-full flex flex-col'>
                                                         <div className='h-1/3 bg-white my-auto py-1 flex flex-col justify-between'>
                                                           <hr className='border border-black' />
                                                           <h1
                                                             style={{
                                                               fontSize: `${"30px"}`,
                                                               // fontSize: `${bookName.length > 30 ? "30px" : "42px"}`,
                                                               fontFamily: 'roboto',
                                                               color: '#000',
                                                             }}
                                                             className="capitalize text-center font-normal pl-1 pr-3"
                                                           >
                                                             {values.bookTitle}
                                                           </h1>
                                                           <h1
                                                             style={{
                                                               fontSize: '14px',
                                                               fontFamily: 'roboto',
                                                               color: '#000',
                                                             }}
                                                             className="uppercase text-center italic pr-3"
                                                           >
                                                             {values.header}
                                                           </h1>
                                                           {values.orginizer ? (
                                                             <h1
                                                               style={{
                                                                 fontSize: '13px',
                                                                 fontFamily: 'Didact Gothic',
                                                                 color: '#000',
                                                               }}
                                                               className="uppercase text-center pr-3"
                                                             >
                                                               {values.orginizer}
                                                             </h1>
                                                           ) : null}
                                                           <hr className='border border-black' />
                                                         </div>
                                                       </div>
                                                     </div>
                                                     :
                                                     <div
                                                       ref={elementRef}
                                                       className="cover pr-3 py-3"
                                                       style={showFrontPopup ? {
                                                         backgroundImage: coverImageSelected
                                                           ? `url(${coverImageSelected})`
                                                           : borderCover
                                                             ? `url(${borderCover})`
                                                             : 'none',
                                                         backgroundSize: coverImageSelected
                                                           ? '400px 550px'
                                                           : borderCover
                                                             ? '400px 550px'
                                                             : 'auto',
                                                         backgroundColor: coverImageSelected ? 'none' : bookColor,
                                                         transform: `scale(${2})`,
                                                         transformOrigin: 'top left'
                                                       } : {
                                                         backgroundImage: coverImageSelected
                                                           ? `url(${coverImageSelected})`
                                                           : borderCover
                                                             ? `url(${borderCover})`
                                                             : 'none',
                                                         backgroundSize: coverImageSelected
                                                           ? '400px 550px'
                                                           : borderCover
                                                             ? '400px 550px'
                                                             : 'auto',
                                                         backgroundColor: coverImageSelected ? 'none' : bookColor,
                                                       }}
                                                     >
                                                       <div className="px-10 py-14 flex flex-col items-center justify-between h-full">
                                                         <div>
                                                           <h1
                                                             style={{
                                                               fontSize: title.font,
                                                               fontFamily: selectedFont,
                                                               color: title.color,
                                                             }}
                                                             className="text-2xl text-center"
                                                           >
                                                             {values.bookTitle}
                                                           </h1>
                                                           <h1
                                                             style={{
                                                               fontSize: header.font,
                                                               fontFamily: selectedFont,
                                                               color: header.color,
                                                             }}
                                                             className="text-2xl w-64 text-center mx-auto"
                                                           >
                                                             {values.header}
                                                           </h1>
                                                         </div>
                                                         {imageSelected ? (
                                                           <img
                                                             width="200px"
                                                             className="mx-auto max-h-72"
                                                             src={imageSelected}
                                                             style={{ border: '5px solid white' }}
                                                             alt="logo"
                                                           />
                                                         ) : null}
                                                         {values.orginizer ? (
                                                           <h1
                                                             style={{
                                                               fontSize: author.font,
                                                               fontFamily: selectedFont,
                                                               color: author.color,
                                                             }}
                                                             className="text-2xl text-center"
                                                           >
                                                             {values.orginizer}
                                                           </h1>
                                                         ) : null}
                                                       </div>
                                                     </div>
                                               }
                                             </div>
                                             {/* Spine Settings */}
                                             {templateIndex === 0 ?
                                               <div className="left-side" style={{ backgroundColor: '#fff', textAlign: "center", }}>
                                                 <h2 style={{ color: '#000', textAlign: "center", width: "550px" }}>
                                                   <span style={{ fontSize: "16px" }} className="font-semibold">{""/*values.bookTitle*/}</span>
                                                 </h2>
                                               </div>

                                               : templateIndex === 1 ?
                                                 <div className="left-side" style={{ backgroundColor: bookColor, textAlign: "center" }}>
                                                   <h2 style={{ color: '#000', textAlign: "center" }}>
                                                     {/* {
                                           (values.orginizer?.length + values.bookTitle?.length < 45) && 
                                           <span className="">
                                               {values.orginizer && 'Written by:'} {values.orginizer}
                                           </span>

                                         } */}
                                                     <span className="">{""/*values.bookTitle*/}</span>
                                                   </h2>
                                                 </div>
                                                 : templateIndex === 2 ?
                                                   <div className="left-side" style={{ backgroundColor: bookColor, textAlign: "center" }}>
                                                     <h2 style={{ color: '#000', textAlign: "center" }}>
                                                       {/* {
                                           (values.orginizer?.length + values.bookTitle?.length < 45) && 
                                           <span className="">
                                               {values.orginizer && 'Written by:'} {values.orginizer}
                                           </span>

                                         } */}
                                                       <span className="">{""/*values.bookTitle*/}</span>
                                                     </h2>
                                                   </div>
                                                   :
                                                   <div className="left-side" style={{ backgroundColor: bookColor, textAlign: "center" }}>
                                                     <h2 style={{ color: leftText, textAlign: "center" }}>
                                                       {/* {
                                           (values.orginizer?.length + values.bookTitle?.length < 45) && 
                                           <span className="">
                                               {values.orginizer && 'Written by:'} {values.orginizer}
                                           </span>

                                         } */}
                                                       <span className="">{""/*values.bookTitle*/}</span>
                                                     </h2>
                                                   </div>
                                             }
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               }
                             </>
                                :
                                <>
                                  {showOriginal && 
                                    <div className='py-7 relative'>
                                      {templateIndex === 0 ?
                                        <div
                                          // ref={backCoverRef}
                                          className="shadow-2xl pb-3"
                                          style={showBackPopup ?
                                            {
                                              height: '550px',
                                              width: '400px',
                                              // transform: `scale(${3})`,
                                              // transformOrigin: 'top left'
                                            } : {
                                              height: '550px',
                                              width: '400px',
                                            }}
                                        >
                                          <div style={{ backgroundColor: bookColor }} className='h-1/3 pl-3 pt-3'>

                                          </div>
                                          <div className='h-2/3 bg-white pl-3'>
                                            <div
                                              style={{
                                                fontSize: '12px',
                                                fontFamily: 'sans-serif',
                                                color: 'black',
                                                height: "230px"
                                              }}
                                              className="py-3 pr-7 pl-16 text-justify"
                                            >
                                              {values.description}
                                            </div>
                                            <img
                                              className="mx-auto"
                                              src={MSVLogo}
                                              alt="My Story Vault"
                                              style={{ height: 180, width: 372 }}
                                            />
                                          </div>
                                        </div>
                                        :
                                        templateIndex === 1 ?
                                          <div
                                            // ref={backCoverRef}
                                            className="shadow-2xl relative"
                                            style={showBackPopup ?
                                              {
                                                height: '550px',
                                                width: '400px',
                                                backgroundColor: bookColor,
                                                // transform: `scale(${3})`,
                                                // transformOrigin: 'top left'
                                              } : {
                                                height: '550px',
                                                width: '400px',
                                                backgroundColor: bookColor,
                                              }}
                                          >
                                            <div style={{ height: '430px' }} className='flex flex-col'>
                                              <div style={{ fontSize: '12px' }} className='flex-grow text-white text-justify pt-32 pb-24 px-7'>
                                                {values.description}
                                              </div>

                                            </div>
                                            <img className='mx-32 w-32 h-20' src={Dedication} />
                                            {/* <img className='absolute left-1/2 transform -translate-x-1/2 bottom-0 w-60 h-60 object-cover' src={Dedication}/> */}

                                            <div style={{ height: '40px', backgroundColor: '#3A3A3A' }} className=''>

                                            </div>
                                          </div>
                                          :
                                          templateIndex === 2 ?
                                            <div
                                              // ref={backCoverRef}
                                              className="shadow-2xl pl-3 py-3"
                                              style={showBackPopup ?
                                                {
                                                  height: '550px',
                                                  width: '400px',
                                                  backgroundColor: bookColor,
                                                  // transform: `scale(${3})`,
                                                  // transformOrigin: 'top left'
                                                } : {
                                                  height: '550px',
                                                  width: '400px',
                                                  backgroundColor: bookColor,
                                                }}

                                            >
                                              <div className='flex flex-col' style={{ height: "440px" }}>
                                                <div style={{ fontSize: '11px' }} className='h-2/3 text-white text-justify pt-10 pb-24 px-7'>
                                                  {values.description}
                                                </div>

                                              </div>
                                              <img className='mx-32 w-32 h-20' src={Dedication} />

                                            </div>
                                            :
                                            <div
                                              // ref={backCoverRef}
                                              className="shadow-2xl pl-3 py-3"
                                              style={showBackPopup ? {
                                                height: '550px',
                                                width: '400px',
                                                backgroundImage: coverImageSelected
                                                  ? `url(${coverImageSelected})`
                                                  : borderCover
                                                    ? `url(${borderCover})`
                                                    : 'none',
                                                backgroundSize: coverImageSelected
                                                  ? '400px 550px'
                                                  : borderCover
                                                    ? '400px 550px'
                                                    : 'auto',
                                                backgroundColor: coverImageSelected ? 'none' : bookColor,
                                                // transform: `scale(${3})`,
                                                // transformOrigin: 'top left'
                                              } :
                                                {
                                                  height: '550px',
                                                  width: '400px',
                                                  backgroundImage: coverImageSelected
                                                    ? `url(${coverImageSelected})`
                                                    : borderCover
                                                      ? `url(${borderCover})`
                                                      : 'none',
                                                  backgroundSize: coverImageSelected
                                                    ? '400px 550px'
                                                    : borderCover
                                                      ? '400px 550px'
                                                      : 'auto',
                                                  backgroundColor: coverImageSelected ? 'none' : bookColor,
                                                }
                                              }
                                            >
                                              <div
                                                style={{
                                                  fontSize: description.font,
                                                  fontFamily: selectedFont,
                                                  color: description.color,
                                                  height: "440px"
                                                }}
                                                className="px-10 py-14 flex flex-col items-center justify-between"
                                              >
                                                {values.description}
                                              </div>
                                              <img className='ml-32 w-32 h-20' src={Dedication} />
                                            </div>
                                      }

                                    </div>
                                  }
                                {showPopupBack && 
                                 <div>
                                   <div
                                     style={{
                                       position: 'fixed',
                                       top: 0,
                                       left: 0,
                                       width: '100%',
                                       height: '100%',
                                       display: 'flex',
                                       justifyContent: 'center',
                                       alignItems: 'center',
                                       backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                       zIndex: 7777,
                                     }}
                                     className="flex justify-center items-center h-full"
                                   >
                                     <div className=" bg-white shadow-2xl h-5/6 overflow-scroll w-auto px-5">
                                       <div className="relative">
                                          <div className='py-7 relative'>
                                    {templateIndex === 0 ?
                                      <div
                                        ref={backCoverRef}
                                        className="shadow-2xl pb-3"
                                        style={showBackPopup ?
                                          {
                                            height: '550px',
                                            width: '400px',
                                            transform: `scale(${3})`,
                                            transformOrigin: 'top left'
                                          } : {
                                            height: '550px',
                                            width: '400px',
                                          }}
                                      >
                                        <div style={{ backgroundColor: bookColor }} className='h-1/3 pl-3 pt-3'>

                                        </div>
                                        <div className='h-2/3 bg-white pl-3'>
                                          <div
                                            style={{
                                              fontSize: '12px',
                                              fontFamily: 'sans-serif',
                                              color: 'black',
                                              height: "230px"
                                            }}
                                            className="py-3 pr-7 pl-16 text-justify"
                                          >
                                            {values.description}
                                          </div>
                                          <img
                                            className="mx-auto"
                                            src={MSVLogo}
                                            alt="My Story Vault"
                                            style={{ height: 180, width: 372 }}
                                          />
                                        </div>
                                      </div>
                                      :
                                      templateIndex === 1 ?
                                        <div
                                          ref={backCoverRef}
                                          className="shadow-2xl relative"
                                          style={showBackPopup ?
                                            {
                                              height: '550px',
                                              width: '400px',
                                              backgroundColor: bookColor,
                                              transform: `scale(${3})`,
                                              transformOrigin: 'top left'
                                            } : {
                                              height: '550px',
                                              width: '400px',
                                              backgroundColor: bookColor,
                                            }}
                                        >
                                          <div style={{ height: '430px' }} className='flex flex-col'>
                                            <div style={{ fontSize: '12px' }} className='flex-grow text-white text-justify pt-32 pb-24 px-7'>
                                              {values.description}
                                            </div>

                                          </div>
                                          <img className='mx-auto w-32 h-20' src={Dedication} />

                                          <div style={{ height: '40px', backgroundColor: '#3A3A3A' }} className=''>

                                          </div>
                                        </div>
                                        :
                                        templateIndex === 2 ?
                                          <div
                                            ref={backCoverRef}
                                            className="shadow-2xl pl-3 py-3"
                                            style={showBackPopup ?
                                              {
                                                height: '550px',
                                                width: '400px',
                                                backgroundColor: bookColor,
                                                transform: `scale(${3})`,
                                                transformOrigin: 'top left'
                                              } : {
                                                height: '550px',
                                                width: '400px',
                                                backgroundColor: bookColor,
                                              }}

                                          >
                                            <div className='flex flex-col' style={{ height: "440px" }}>
                                              <div style={{ fontSize: '11px' }} className='h-2/3 text-white text-justify pt-10 pb-24 px-7'>
                                                {values.description}
                                              </div>

                                            </div>
                                            <img className='mx-auto w-32 h-20' src={Dedication} />

                                          </div>
                                          :
                                          <div
                                            ref={backCoverRef}
                                            className="shadow-2xl pl-3 py-3"
                                            style={showBackPopup ? {
                                              height: '550px',
                                              width: '400px',
                                              backgroundImage: coverImageSelected
                                                ? `url(${coverImageSelected})`
                                                : borderCover
                                                  ? `url(${borderCover})`
                                                  : 'none',
                                              backgroundSize: coverImageSelected
                                                ? '400px 550px'
                                                : borderCover
                                                  ? '400px 550px'
                                                  : 'auto',
                                              backgroundColor: coverImageSelected ? 'none' : bookColor,
                                              transform: `scale(${3})`,
                                              transformOrigin: 'top left'
                                            } :
                                              {
                                                height: '550px',
                                                width: '400px',
                                                backgroundImage: coverImageSelected
                                                  ? `url(${coverImageSelected})`
                                                  : borderCover
                                                    ? `url(${borderCover})`
                                                    : 'none',
                                                backgroundSize: coverImageSelected
                                                  ? '400px 550px'
                                                  : borderCover
                                                    ? '400px 550px'
                                                    : 'auto',
                                                backgroundColor: coverImageSelected ? 'none' : bookColor,
                                              }
                                            }
                                          >
                                            <div
                                              style={{
                                                fontSize: description.font,
                                                fontFamily: selectedFont,
                                                color: description.color,
                                                height: "440px"
                                              }}
                                              className="px-10 py-14 flex flex-col items-center justify-between"
                                            >
                                              {values.description}
                                            </div>
                                            <img className='mx-auto w-32 h-20' src={Dedication} />
                                          </div>
                                    }

                                          </div>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                                }  
                                </>
                              }

                              {showOriginal &&
                                <div className='flex justify-center space-x-4 pb-4'>
                                <button onClick={() => { setToggle(!toggle) }} type='button' className='bg-teal-600 text-white px-2 py-1.5 rounded-md'>
                                  {toggle === false ? `Show Back` : `Show Front`}
                                </button>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* /End replace */}
                    </div>
                  </main>
                </div>
              );
            }}
          </Formik>
        </div>
      </div>
      {popup &&
        <div onClick={() => setPopup(false)} id="defaultModal" tabindex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-50 backdrop-blur-xs top-0 left-0 right-0  z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative w-full max-w-2xl max-h-full mx-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Tips
                </h3>
                <button onClick={() => setInfo(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <ul className="p-6 space-y-6 space-x-4 list-disc">
                <p className="text-base leading-relaxed text-gray-700 font-semibold ">
                  Tips for Book Cover
                </p>
                <li className="text-base leading-relaxed text-gray-500">
                  To design your book cover, we offer three ready-made layouts.
                </li>
                <li className="text-base leading-relaxed text-gray-500">
                  If you want a unique design, choose the custom cover option to create your own.
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    </>
  );
}
