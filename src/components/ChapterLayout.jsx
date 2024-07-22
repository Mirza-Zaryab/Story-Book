import { useEffect, useState } from 'react';
import API from '../utils/api';
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineSend } from 'react-icons/ai';
import AppInput from './AppInput';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateChapters } from '../features/bookFeatures';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Question from './Question';

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label('Chapter Title'),
});

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ChapterLayout({
  chapters,
  id,
  currentChapter,
  setChapter,
  handleCurrentChapter,
  questions,
}) {
  const [editChapter, setEditChapter] = useState({
    id: 0,
  });
  const dispatch = useDispatch();
  const chapterState = useSelector((state) => state.book.value.chapters);

  const addChapter = () => {
    API.addChapter(id).then((res) => setChapter(res.data));
  };

  const handleSubmit = async (chapterId, chapter) => {
    await API.editChapterTitle(id, chapterId, chapter.title).then((res) => {
      if (res.status === 200) {
        setChapter(res.data);
        setEditChapter({ id: 0 });
        dispatch(updateChapters(res.data));
      }
    });
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(updateChapters(items));
    await API.updateChapterOrder(id, items).then((res) => {
    });
  };

  if (chapters <= 0) {
    return (
      <>
        <p>No chapters</p>{' '}
        <button
          onClick={addChapter}
          className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md"
        >
          Add Chapter
        </button>
      </>
    );
  }
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <ul
              role="list"
              className="space-y-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {chapters?.map((item, index) => {
                return (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        onClick={() => handleCurrentChapter(item)}
                        className={classNames(
                          item._id === currentChapter._id ? 'blue-gree-bg' : 'bg-white',
                          'shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md  hover:bg-slate-100'
                        )}
                      >
                        {item.number < 1 ? (
                          <div>Title Page</div>
                        ) : (
                          <>
                            Chapter: {index}
                            {editChapter.id !== item._id ? (
                              <>
                                <span key={item.title + '-span'}>{' - ' + item.title}</span>{' '}
                                <div key={item.title} className="flex justify-end">
                                  <span
                                    key={item.title + '-icon-span'}
                                    onClick={() => setEditChapter({ id: item._id })}
                                    className=" w-max hover:text-xl rounded-full"
                                  >
                                    <FiEdit3 key={item.title + '-icon'} />
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span key={item.title + '-close'} className="flex">
                                <button
                                  key={item.title + '-close-button'}
                                  className="mr-4 "
                                  onClick={() => setEditChapter({ id: 0 })}
                                >
                                  X
                                </button>
                                <Formik
                                  key={item.title + '-formik'}
                                  initialValues={{ title: item.title }}
                                  onSubmit={(title) => handleSubmit(item.chapterId, title)}
                                  validationSchema={validationSchema}
                                >
                                  {({ handleChange, values }) => {
                                    return (
                                      <Form key={item.title + '-formik-form'}>
                                        <div key={item.title + '-name'} className="flex">
                                          <div key={item.title + '-name-div'} className="w-11/12">
                                            <AppInput
                                              key={item.number}
                                              id={item.number}
                                              name="title"
                                              type="text"
                                              autoComplete="title"
                                              value={values.title}
                                              onChange={handleChange}
                                            />
                                          </div>
                                          <button
                                            key={item.title + 'submit-button'}
                                            className="ml-4"
                                            type="submit"
                                          >
                                            <AiOutlineSend
                                              key={item.title + '-edit-icon'}
                                              size={25}
                                            />
                                          </button>
                                        </div>
                                      </Form>
                                    );
                                  }}
                                </Formik>
                              </span>
                            )}
                          </>
                        )}

                        {item._id === currentChapter._id ? (
                          <>
                            <div>
                              <div className="mt-6 flow-root">
                                <ul role="list" className="-my-5 divide-y divide-gray-200">
                                  {questions?.content.map((question) => {
                                    return <Question data={{ question, currentChapter }} />;
                                  })}
                                </ul>
                              </div>
                              <div className="mt-6">
                                <a
                                  href="#"
                                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                  View all
                                </a>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </li>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={addChapter}
        className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md mt-4"
      >
        Add Chapter
      </button>
    </>
  );
}
