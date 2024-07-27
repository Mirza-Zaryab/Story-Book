import { forwardRef, useEffect, useState } from 'react';
import { convertToRaw, EditorState, ContentState, convertFromHTML, Modifier, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import './style.css'
import { bold, italic, underline, strikethrough, monospace, superscript, subscript, unordered, ordered, indent, outdent, left, center, right, justify, color, link, unlink, emoji, image, fontSize, embedded, eraser, undo, redo } from 'react-draft-wysiwyg';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaPlay, FaStop, FaUndoAlt, FaPowerOff } from 'react-icons/fa'
import htmlToDraft from 'html-to-draftjs';
import { cropImg, uploadImage } from '../features/bookSlice';
import { useDispatch, useSelector } from 'react-redux';
import PopupAlert from "./PopupAlert";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css'; // Import Draft.js CSS

const WYSIWYGEditor = forwardRef((props, ref) => {
    const { isChange, changeEditor, changeSeq }=props
    const croppedImage = useSelector((state) => state.userBook.croppedImg);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [message, setMessage]=useState("")

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();


    useEffect(() => {

        if (croppedImage) {
            let desc= localStorage.getItem("imgDesc")
            const html = `<p><img src=${croppedImage} /></p><h6 style="text-align: center">${desc}</h6><p></p>`;
            const blocksFromHtml = htmlToDraft(html);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

           
            const newContentState = Modifier.replaceWithFragment(
                editorState.getCurrentContent(),
                editorState.getSelection(),
                contentState.getBlockMap()
            );

            const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');

            const selectionState = newEditorState.getSelection();
            const start = selectionState.getStartOffset();
            const end = start + desc.length; // Calculate the end position

            // Apply bold property using RichUtils
            const boldEditorState = RichUtils.toggleInlineStyle(newEditorState, 'BOLD', {
                anchorOffset: start,
                focusOffset: end,
            });
            setEditorState(boldEditorState);
             
            const rawHtmlContent = draftToHtml(convertToRaw(boldEditorState.getCurrentContent()));

            props?.getData(rawHtmlContent)
        }

        dispatch(uploadImage({}))
        dispatch(cropImg(''))
    }, [croppedImage])

    useEffect(() => {
        if (props?.answer !== undefined) {
            const wrappedHtml = `<p>${props?.answer}</p>`

            const blocksFromHtml = htmlToDraft(wrappedHtml);
            const { contentBlocks, entityMap } = blocksFromHtml;

            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            setEditorState(EditorState.createWithContent(contentState))

        }
    }, [props?.data?.questionId])

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        const htmlValue = draftToHtml(convertToRaw(contentState));
        const text = htmlValue + `<p>${transcript}</p>`

        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(text))))

        props?.getData(text)

        resetTranscript();

    }, [listening])


    function onEditorStateChange(_editorState) {
        props.setChangeEditor(true);
        localStorage.setItem("changeEditor","true")
        const contentState = _editorState.getCurrentContent();
        let imageCount = 0;

        if(contentState.getPlainText().length === 1){
            const htmlValue = draftToHtml(convertToRaw(contentState));
            props?.getData(htmlValue)
        }

        setEditorState(_editorState);

        contentState.getBlockMap().forEach((block) => {
        // Check if the block type is "atomic" (typically used for images)
        if (block.getType() === 'atomic') {
            const entity = block.getEntityAt(0);
            if (entity) {
            const entityType = contentState.getEntity(entity).getType();
            if (entityType === 'IMAGE') {
                imageCount++;
            }
            }
        }
        });

        if(imageCount > count){
            const htmlValue = draftToHtml(convertToRaw(contentState));
            props?.getData(htmlValue)
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        const newTypingTimeout = setTimeout(() => {
            const htmlValue = draftToHtml(convertToRaw(contentState));
            props?.getData(htmlValue)
        }, 600);

        setTypingTimeout(newTypingTimeout);


        // check grammer 
        // const rawContentState = convertToRaw(contentState);
        // const plainText = rawContentState.blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');

    }

    const handleImageUpload = (file) => {

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
                dispatch(uploadImage({ data: { link: fileReader.result } }))
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
        
    const toolbarOptions = {
        // 'link', 'embedded', 
        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'emoji', 'image', 'remove', 'history'],
        inline: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
            bold: { icon: bold, className: undefined },
            italic: { icon: italic, className: undefined },
            underline: { icon: underline, className: undefined },
            strikethrough: { icon: strikethrough, className: undefined },
            monospace: { icon: monospace, className: undefined },
            superscript: { icon: superscript, className: undefined },
            subscript: { icon: subscript, className: undefined },
        },
        blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        fontSize: {
            icon: fontSize,
            options: [8, 9, 10, 11, 12, 14],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        fontFamily: {
            options: ['Arial', 'Times New Roman'],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
        },
        list: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['unordered', 'ordered', 'indent', 'outdent'],
            unordered: { icon: unordered, className: undefined },
            ordered: { icon: ordered, className: undefined },
            indent: { icon: indent, className: undefined },
            outdent: { icon: outdent, className: undefined },
        },
        textAlign: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['left', 'center', 'right', 'justify'],
            left: { icon: left, className: undefined },
            center: { icon: center, className: undefined },
            right: { icon: right, className: undefined },
            justify: { icon: justify, className: undefined },
        },
        colorPicker: {
            icon: color,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
        },
        link: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            dropdownClassName: undefined,
            showOpenOptionOnHover: true,
            defaultTargetOption: '_self',
            options: ['link', 'unlink'],
            link: { icon: link, className: undefined },
            unlink: { icon: unlink, className: undefined },
            linkCallback: undefined
        },
        emoji: {
            icon: emoji,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            emojis: [
                '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                '✅', '❎', '💯',
            ],
        },
        embedded: {
            icon: embedded,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            embedCallback: undefined,
            defaultSize: {
                height: 'auto',
                width: 'auto',
            },
        },
        image: {
            icon: image,
            className: undefined,
            component: undefined,
            popupClassName: undefined,
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: false,
            uploadCallback: handleImageUpload,
            previewImage: false,
            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
            alt: { present: false, mandatory: false },
            title: 'Upload Photo',
            defaultSize: {
                height: 'auto',
                width: 'auto',
            },
        },
        remove: { icon: eraser, className: undefined, component: undefined },
        history: {
            inDropdown: false,
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
            options: ['undo', 'redo'],
            undo: { icon: undo, className: undefined },
            redo: { icon: redo, className: undefined },
        },
        content_langs: [
            {
                "title": "English",
                "code": "en"
            },
            {
                "title": "Spanish",
                "code": "es"
            }
        ],
        "Spell Checker": "Stavekontrol",
    }

    const [width, setWidth] = useState(580);
    const [pad, setpad]=useState(10)
    const [mar, setMargin]=useState(0);

    useEffect(() => {
        const updateWidth = () => {
            const newWidth = window.innerWidth;

            if(newWidth >=1317){
                setMargin(-20)
            }
            else if(newWidth >=1247){
                setMargin(30)
            }
            else if(newWidth >=1126){
                setMargin(45)
            }
            else if(newWidth >=1079){
                setMargin(70)
            }
            else if(newWidth >=1034){
                setMargin(60)
            }
            else if(newWidth >=1024){
                setMargin(80)
            }
            else if(newWidth >=991){
                setMargin(30)
            }
            else if(newWidth >=869){
                setMargin(40)
            }
            else if(newWidth >=824){
                setMargin(70)
            }
            else if(newWidth >=768){
                setMargin(60)
            }
            else if(newWidth >=677){
                setMargin(-20)
            }
            else if(newWidth>=608){
                setMargin(30)
            }
            else if(newWidth>=555){
                setMargin(44)
            }
            else{
                setMargin(90)
            }
           
        };

        window.addEventListener('resize', updateWidth);

        updateWidth();

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const handleInvitation=()=>{
        props?.func()
    }

    return (
        <div className='rounded-4 border-1 overflow-hidden w-full' ref={ref}>
            {/* <GrammarlyEditorPlugin clientId="client_GxdbSqKFPt6MdaAXQufRk2"> */}
                <Editor
                    toolbarHidden={!props?.data?.questionId}
                    readOnly={!props?.data?.questionId}
                    wrapperClassName="custom-wrapper"
                    editorClassName="custom-editor"
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbar={toolbarOptions}
                    placeholder={props?.data?.questionId ? "Start typing here...":""}
                    spellCheck={true}
                    localization={{
                        locale: 'en',
                      }}
                    
                />
            {/* </GrammarlyEditorPlugin> */}

            {!browserSupportsSpeechRecognition && <span>Browser doesn't support speech recognition.</span>}

            <div style={props?.data?.questionId ? {marginTop:`${mar}px`}: {marginTop:`-100px`}} className={`flex ${props?.data?.questionId ? 'justify-between' : 'justify-end'} items-start`}>
                {props?.data?.questionId &&
                    <div>
                        <div className='flex space-x-2 items-center mt-0 mb-2'>
                            <p className='text-lg font-medium'>Dictation Tool: </p>
                            <FaPowerOff className={listening ? 'text-green-500' : ''} />
                        </div>
                        <div className='flex space-x-5 items-center'>
                            <button className='p-2 bg-gray-200 rounded-md' data-toggle="tooltip" data-placement="top" title="start" onClick={() => { SpeechRecognition.startListening({ continuous: true }) }}><FaPlay className='W-16 h-5 text-green-600 hover:text-green-700' /></button>
                            <button className='p-2 bg-gray-200 rounded-md' data-toggle="tooltip" data-placement="top" title="stop" onClick={SpeechRecognition.stopListening}><FaStop className='W-16 h-5 text-red-600 hover:text-red-700' /></button>
                            <button className='p-2 bg-gray-200 rounded-md' data-toggle="tooltip" data-placement="top" title="reset" onClick={resetTranscript}><FaUndoAlt className='W-16 h-5 text-gray-700 hover:text-black' /></button>
                        </div>
                        <p>{transcript}</p>
                    </div>
                }

                {props?.invitationPage ?
                    <div className=''>
                    <button
                        onClick={handleInvitation}
                        className={`bg-[#0E4F5C] px-4 py-2 text-white rounded-lg`}
                        style={{ width: '160px' }}
                    >
                        Submit
                    </button>
                    </div>
                    :
                    props?.showBtn &&
                        <div className=''>
                        <button
                            onClick={props?.func}
                            className={`bg-[#0E4F5C] px-4 py-2 text-white rounded-lg`}
                            style={{ width: '160px' }}
                        >
                            {
                                (changeSeq || changeEditor || !isChange) ?
                                "Save & Preview" : "Preview"
                            }
                        </button>
                        </div>
                    
                }
            </div>
        </div>
    );
});

export default WYSIWYGEditor;
