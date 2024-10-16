import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar/AppBar";
import { GlobeIcon } from "../assets/svg/GlobeIcon";
import { Link } from "react-router-dom";
import { SaveFileIcon } from "../assets/svg/SaveFileIcon";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { createPostFormData, FormErrors } from "../Types/type";
import {
  validateFileSize,
  validateFileType,
} from "../components/Auth/register.validate";
import {
  validateBlogBody,
  validateShortCaption,
  validateTitle,
} from "../validation/FormValidations";
import { debounce } from "./NoveEditor";
import axios from "axios";
import { Spinner } from "../components/Global/Spinner";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/auth.atoms";

export enum statusType {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIEVED = "ARCHIEVED",
  NEW = "NEW",
}

export const HandlePost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [loadDraft, setLoadDraft] = useState(false);
  const [loadPublish, setLoadPublish] = useState(false);

  const [postId, setPostId] = useState<string | null>(
    state ? state.postId : null
  );
  const [authorId, setAuthorId] = useState<string | null>(
    state ? state.authorId : null
  );

  const [published, setPublished] = useState<boolean>(
    state?.statusType === statusType.PUBLISHED ? true : false
  );

  const [statusTypeState, setStatusTypeState] = useState<statusType>(
    state ? state.statusType : statusType.NEW
  );

  const { user: currentUser } = useRecoilValue(authAtom);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (location.state && state.postId && state.authorId && state.statusType) {
      navigate(location.pathname, { replace: true, state: null });
    }

    async function checkData() {
      if (postId && authorId) {
        if (currentUser.id !== authorId) {
          navigate("/blogs");
          return null;
        } else {
          console.log("I am getting the Data");
          // get the data of the post by providing postId
          // if error log it else set the recieved data to formData
        }
      }
    }
    checkData();
  }, []);

  const handleDraft = async () => {
    setLoadDraft(true);
    if (
      (statusTypeState === statusType.PUBLISHED ||
        statusTypeState === statusType.DRAFT) &&
      postId
    ) {
      // backend call update content - def - draft ---1
      setPublished(false);
    } else if (statusTypeState === statusType.NEW) {
      setPublished(false);
      try {
        if (postId === null) {
          const res = await axios.post(
            `/post/createNewDraftPost`,
            {
              id: "",
              title: formData.title || "",
              shortCaption: formData.shortCaption || "",
              body: formData.body || "",
              allowComments: true,
            },
            {
              headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const { id: newPostId } = res.data.data;
          setPostId(newPostId);
        } else {
          const res = await axios.put(
            `/post/updateDraftPost`,
            {
              id: postId || "",
              title: formData.title || "",
              shortCaption: formData.shortCaption || "",
              body: formData.body || "",
              allowComments: true,
            },
            {
              headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadDraft(false);
      }
    }
  };

  const [formData, setFormData] = useState<createPostFormData>({
    title: "",
    shortCaption: "",
    coverImage: null,
    body: "",
  });

  const getPostData = async () => {
    try {
      const res = await axios.get(`/posts/get/${postId}`, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { data } = res.data;
      const { title, shortCaption, body, coverImage } = data;

      setFormData({
        title,
        shortCaption,
        body,
        coverImage,
      });
      // setStatusTypeState(data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublished(false);
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileTypeError = validateFileType(file.type);
      const fileSizeError = validateFileSize(file.size);
      if (fileTypeError || fileSizeError) {
        setErrors((prevErrors) => {
          return {
            ...prevErrors,
            coverImage: fileTypeError || fileSizeError,
          };
        });
      } else {
        setErrors((prevErrors) => {
          return { ...prevErrors, coverImage: "" };
        });
        setFormData((prevData) => ({ ...prevData, coverImage: file }));
      }
    }
  };
  //   function formatHTML(html: any) {
  //     return html.replace(/<p><\/p>/g, "<br>");
  //   }
  //   const html = await editor.blocksToHTMLLossy(editor.document);
  //   const formattedHTML = formatHTML(html);

  //   setFormData((prevData) => {
  //     const newFormData = { ...prevData, body: formattedHTML };
  //     debouncedHandleDraft(newFormData);
  //     return newFormData;
  //   });
  // };

  const handleBodyChange = async () => {
    function formatHTML(html: any) {
      return html.replace(/<p><\/p>/g, "<br>");
    }
    const html = await editor.blocksToHTMLLossy(editor.document);
    const formattedHTML = formatHTML(html);

    setFormData((prevData) => ({ ...prevData, body: formattedHTML }));
  };

  const handlePublish = async () => {
    setLoadPublish(true);
    if (statusTypeState === statusType.PUBLISHED && postId) {
      // check for errors and update the content - def- published ---2
      setPublished(true);
    } else if (statusTypeState === statusType.DRAFT && postId) {
      // check for errors and update the content - def- published ---2
      setPublished(true);
    } else if (statusTypeState === statusType.NEW) {
      try {
        if (postId === null) {
          const res = await axios.post(
            `/post/publish`,
            {
              id: "",
              title: formData.title || "",
              shortCaption: formData.shortCaption || "",
              body: formData.body || "",
              allowComments: true,
            },
            {
              headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          const { id: newPostId } = res.data.data;
          setPostId(newPostId);
          setPublished(true);
        } else {
          // check for errors and update the content - def- published ---2
          const res = await axios.put(
            `/post/updateDraftPost`,
            {
              id: postId || "",
              title: formData.title || "",
              shortCaption: formData.shortCaption || "",
              body: formData.body || "",
              allowComments: true,
            },
            {
              headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          setPublished(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadPublish(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        handleDraft();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [postId, formData]);

  const editor = useCreateBlockNote({
    initialContent: state ? state.body : "",
  });

  return (
    <div className="">
      <AppBar />
      <div className="flex justify-center items-center px-8 py-8 sm:px-16">
        <div className="fixed top-24 w-[95%]  max-w-[800px] flex items-center justify-between px-16 bg-slate-800 rounded-full">
          <div className="flex gap-3 items-center  py-3">
            <button
              onClick={handleDraft}
              disabled={loadDraft || loadPublish ? true : false}
              className={`cursor-pointer h-[2.2rem] disabled:cursor-not-allowed ${
                loadPublish
                  ? "disabled:bg-[#8babce] "
                  : "disabled:bg-transparent"
              } bg-[#007bff] px-3 py-[0.3rem] rounded-lg font-semibold w-[5.5rem]`}
            >
              <div className="flex justify-center items-center gap-2">
                {!loadDraft ? (
                  <>
                    <SaveFileIcon
                      color={loadDraft ? "currentColor" : "currentColor"}
                    />
                    <p>Draft</p>
                  </>
                ) : (
                  <>
                    <Spinner size={5} />
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="flex gap-3 items-center ">
            {published ? (
              <>
                <p className="font-semibold">
                  Live at <span className="text-cgreen ml-2">&#x2022;</span>
                </p>

                <Link to={""}>
                  <GlobeIcon />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handlePublish}
                  disabled={loadPublish || loadDraft ? true : false}
                  className={`cursor-pointer h-[2.2rem] disabled:cursor-not-allowed bg-[#007bff] px-3 py-[0.3rem] rounded-lg font-semibold 
                     ${
                       loadDraft
                         ? "disabled:bg-[#8babce] "
                         : "disabled:bg-transparent"
                     } w-[5.5rem]`}
                >
                  <div className="flex justify-center items-center gap-2">
                    {!loadPublish ? (
                      <>
                        <p>
                          {state?.statusType === statusType.DRAFT
                            ? "Publish"
                            : statusTypeState === statusType.PUBLISHED
                            ? "Republish"
                            : state?.statusType === statusType.ARCHIEVED
                            ? "Publish"
                            : "Publish"}
                        </p>
                      </>
                    ) : (
                      <>
                        <Spinner size={5} />
                      </>
                    )}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-[95%] flex flex-col gap-8 max-w-[800px] h-3/4 fixed overflow-y-scroll top-44 pb-24 px-4 sm:px-8 ">
          <div className="rounded-lg py-8 px-8 flex  gap-8 flex-col-reverse md:flex-row bg-[#262932] md:items-center">
            <div className="flex flex-col gap-6 items-start ">
              <div className="flex gap-3 flex-col w-full sm:w-96">
                {/* <label htmlFor="title" className="font-semibold">
                  Main title
                </label> */}
                <p className="text-cgray ml-2 font-semibold">Main title</p>
                <input
                  className="input-style italic  text-xl"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="eg. The ultimate next.js guide - 2024"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  // disabled={loading}
                />
                {/* {errors.username ? (
                <p className="error">{errors.username}</p>
              ) : (
                <p className="text-cgray">Your public username here.</p>
              )} */}
              </div>

              <div className="flex gap-3 flex-col w-full sm:w-96">
                {/* <label htmlFor="title" className="font-semibold">
                  Short description
                </label> */}
                <p className="text-cgray font-semibold ml-2">
                  Short description
                </p>
                <input
                  className="input-style  text-base italic"
                  type="text"
                  id="shortCaption"
                  name="shortCaption"
                  placeholder="eg.  Fast-track your Next.js journey - Step-by-step guide for beginners"
                  value={formData.shortCaption || ""}
                  onChange={handleInputChange}
                  // disabled={loading}
                />
                {/* {errors.username ? (
                <p className="error">{errors.username}</p>
              ) : (
                <p className="text-cgray">Your public username here.</p>
              )} */}
              </div>
            </div>

            <div className="w-full sm:max-w-96 rounded-lg flex justify-center flex-col gap-3">
              {/* <input type="file" name="" id="" className="border max-w-60" /> */}
              <p className="text-cgray font-semibold ml-2">Cover Image</p>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="coverImage"
                  className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 bg-gray-700 border-gray-600 hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="coverImage"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pl-8 font-semibold">
            <p>Blog Content</p>
          </div>

          <BlockNoteView
            editor={editor}
            editable={true}
            data-changing-font-demo
            data-theming-css-variables-demo
            formattingToolbar={false}
            // linkToolbar={false}
            // filePanel={false}
            // sideMenu={false}
            // slashMenu={false}
            // tableHandles={false}
            onChange={handleBodyChange}
          />
        </div>
      </div>
    </div>
  );
};
