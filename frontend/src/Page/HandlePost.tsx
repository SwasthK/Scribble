import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar/AppBar";
import { GlobeIcon } from "../assets/svg/GlobeIcon";
import { Link } from "react-router-dom";
import { SaveFileIcon } from "../assets/svg/SaveFileIcon";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { createPostFormData, statusType } from "../Types/type";
import {
  validateFileSize,
  validateFileType,
} from "../components/Auth/register.validate";
import {
  validateBlogBody,
  validateShortCaption,
  validateTitle,
} from "../validation/BlogFormValidations";
import axios from "axios";
import { Spinner } from "../components/Global/Spinner";
import { useRecoilValue } from "recoil";
import { authAtom } from "../atoms/auth.atoms";
import { useGetDraftedPostFullContentByPostId } from "../services/queries";
import { Cancel } from "../assets/svg/Cancel";
import { Blog_Handle_Skeleton } from "../Skeleton/Blog_Handle_Skeleton";
import { CloudUploadIcon } from "../assets/svg/CloudUploadIcon";
import toast from "react-hot-toast";

export const HandlePost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [postId, setPostId] = useState<string | null>(
    state ? state.postId : null
  );
  const authorId: string | null = state ? state.authorId : null;
  const statusTypeState: statusType = state ? state.statusType : statusType.NEW;

  const [postURL, setPostURL] = useState<string>("");
  const [loadDraft, setLoadDraft] = useState<boolean>(false);
  const [loadPublish, setLoadPublish] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(
    state?.statusType === statusType.PUBLISHED ? true : false
  );
  const { user: currentUser } = useRecoilValue(authAtom);
  const [formData, setFormData] = useState<createPostFormData>({
    title: "",
    shortCaption: "",
    coverImage: null,
    body: "",
    allowComments: true,
    summary: "",
  });
  const [image, setImage] = useState<string>("");

  const editor = useCreateBlockNote({
    initialContent: state?.body || "",
  });

  useEffect(() => {
    if (location.state && postId && authorId && statusType) {
      navigate(location.pathname, { replace: true, state: null });
    }

    if (postId && authorId) {
      if (currentUser.id !== authorId) {
        navigate("/blogs");
        return;
      }
    }
  }, []);

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

  // ------------TANSTACK/REACT-QUERY----------------
  const { data: fullDraftData, isLoading } =
    useGetDraftedPostFullContentByPostId({ postId });

  useEffect(() => {
    if (!postId) {
      setFormData({
        title: "",
        shortCaption: "",
        coverImage: null,
        body: "",
        allowComments: true,
        summary: "",
      });
      setImage('')
      return;
    }
    setFormData((prev) => ({
      ...prev,
      title: fullDraftData?.title || "",
      shortCaption: fullDraftData?.shortCaption || "",
      body: fullDraftData?.body || "",
      allowComments: fullDraftData?.allowComments || true,
      summary: fullDraftData?.summary || "",
    }));
    setImage(fullDraftData?.coverImage || "");
    const genrateEditorData = async () => {
      const blocks = await editor.tryParseHTMLToBlocks(
        fullDraftData?.body || ""
      );
      editor.replaceBlocks(editor.document, blocks);
    };
    genrateEditorData();
  }, [fullDraftData]);
  // -------------------------------------------------

  const createNewDraftData = async () => {
    try {
      const data = new FormData();
      data.append("file", formData.coverImage || "");
      data.append("title", formData.title || "");
      data.append("shortCaption", formData.shortCaption || "");
      data.append("body", formData.body || "");
      data.append("allowComments", formData.allowComments ? "true" : "false");
      data.append("summary", formData.summary || "");

      const res = await axios.post(`/post/createNewDraftPost`, data, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { id: newPostId } = res.data.data;
      setFormData((prevData) => ({ ...prevData, coverImage: null }));
      setPostId(newPostId);
      setPublished(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadDraft(false);
    }
  };

  const updateDraftData = async () => {
    try {
      const data = new FormData();
      data.append("file", formData.coverImage || "");
      data.append("title", formData.title || "");
      data.append("shortCaption", formData.shortCaption || "");
      data.append("body", formData.body || "");
      data.append("allowComments", formData.allowComments ? "true" : "false");
      data.append("summary", formData.summary || "");
      await axios.put(`/posts/updateDraftById/${postId}`, data, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setPublished(false);
      setFormData((prev) => ({ ...prev, coverImage: null }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadDraft(false);
    }
  };

  const createNewPublishData = async () => {
    try {
      const data = new FormData();

      data.append("file", formData.coverImage || "");
      data.append("title", formData.title || "");
      data.append("shortCaption", formData.shortCaption || "");
      data.append("body", formData.body || "");
      data.append("allowComments", formData.allowComments ? "true" : "false");
      data.append("summary", formData.summary || "");

      const res = await axios.post(`/posts/createNewPublishPost`, data, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { id: newPostId, slug } = res.data.data;
      setFormData((prevData) => ({ ...prevData, coverImage: null }));
      setPostId(newPostId);
      setPostURL(`/blog/${slug}`);
      setPublished(true);
      toast.success("Your post is live now !");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadPublish(false);
    }
  };

  const updatePublishData = async () => {
    try {
      const data = new FormData();
      data.append("file", formData.coverImage || "");
      data.append("title", formData.title || "");
      data.append("shortCaption", formData.shortCaption || "");
      data.append("body", formData.body || "");
      data.append("allowComments", formData.allowComments ? "true" : "false");
      data.append("summary", formData.summary || "");

      const res = await axios.put(`/posts/updatePublishById/${postId}`, data, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const { slug } = res.data.data;
      setFormData((prev) => ({ ...prev, coverImage: null }));
      setPostURL(`/blog/${slug}`);
      setPublished(true);
      toast.success("Your post is live now !");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoadPublish(false);
    }
  };

  const handleDraft = async () => {
    setLoadDraft(true);
    if (
      (statusTypeState === statusType.PUBLISHED ||
        statusTypeState === statusType.DRAFT) &&
      postId
    ) {
      await updateDraftData();
    } else if (statusTypeState === statusType.NEW) {
      if (postId === null) {
        await createNewDraftData();
      } else {
        await updateDraftData();
      }
    }
  };

  const handlePublish = async () => {
    setLoadPublish(true);
    if (checkClientErrors() === 0) {
      setLoadPublish(false);
      return;
    }

    if (
      (statusTypeState === statusType.PUBLISHED ||
        statusTypeState === statusType.DRAFT) &&
      postId
    ) {
      await updatePublishData();
    } else if (statusTypeState === statusType.NEW) {
      if (postId === null) {
        await createNewPublishData();
      } else {
        await updatePublishData();
      }
    }
  };

  const checkClientErrors = () => {
    const clientError = {
      title: validateTitle(formData.title),
      ShortCaption: validateShortCaption(formData.shortCaption),
      body: validateBlogBody(formData.body),
    };
    if (clientError.title || clientError.ShortCaption || clientError.body) {
      toast.error(
        clientError.title || clientError.ShortCaption || clientError.body
      );
      return 0;
    }
  };

  //---------------Handlers-------------

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
        setFormData((prevData) => ({ ...prevData, coverImage: null }));
        setImage("");
        toast.error(fileTypeError || fileSizeError);
        return;
      } else {
        setFormData((prevData) => ({ ...prevData, coverImage: file }));
        setImage(URL.createObjectURL(file));
      }
    }
  };

  const handleBodyChange = async () => {
    setPublished(false);
    function formatHTML(html: any) {
      return html.replace(/<p><\/p>/g, "<br>");
    }
    const html = await editor.blocksToHTMLLossy(editor.document);
    const formattedHTML = formatHTML(html);
    setFormData((prevData) => ({ ...prevData, body: formattedHTML }));
  };

  //-----------------------------------

  return (
    <>
      <AppBar />
      {isLoading ? (
        <>
          <Blog_Handle_Skeleton />
        </>
      ) : (
        <>
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

                    <Link to={postURL}>
                      <GlobeIcon
                        className={
                          "hover:stroke-[#8fc3fc] transition-colors duration-200"
                        }
                      />
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
              <div className="rounded-lg py-5 px-8 flex  gap-8 flex-col-reverse md:flex-row bg-[#262932] md:items-center">
                <div className="flex flex-col gap-6 items-start ">
                  <div className="flex gap-3 flex-col w-full sm:w-96">
                    <label
                      htmlFor="title"
                      className="text-cgray ml-2 font-semibold"
                    >
                      Main title
                    </label>

                    <input
                      className="input-style italic  text-xl"
                      type="text"
                      id="title"
                      name="title"
                      placeholder="eg. The ultimate Next.js guide - 2024"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      disabled={loadDraft || loadPublish || isLoading}
                    />
                  </div>

                  <div className="flex gap-3 flex-col w-full sm:w-96">
                    <label
                      htmlFor="shortCaption"
                      className="text-cgray font-semibold ml-2"
                    >
                      Short description
                    </label>

                    <input
                      className="input-style  text-base italic"
                      type="text"
                      id="shortCaption"
                      name="shortCaption"
                      placeholder="eg.  Fast-track your Next.js journey - Step-by-step guide for beginners"
                      value={formData.shortCaption || ""}
                      onChange={handleInputChange}
                      disabled={loadDraft || loadPublish || isLoading}
                    />
                  </div>
                  <ToggleComments
                    setPublished={setPublished}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>

                <div className="w-full sm:max-w-96 rounded-lg flex justify-center flex-col gap-3">
                  <div className="flex justify-between pr-1 items-center">
                    <p className="text-cgray font-semibold ml-2">Cover Image</p>
                    {image && (
                      <Cancel
                        className={"cursor-pointer"}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            coverImage: null,
                          }));
                          setImage("");
                        }}
                        color={"yellow"}
                        size={23}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="coverImage"
                      className={`overflow-hidden flex flex-col w-full ${
                        !image
                          ? "border-2 hover:bg-gray-800 bg-gray-700 border-gray-600 hover:border-gray-500"
                          : "border-none"
                      } border-dashed rounded-lg cursor-pointer `}
                    >
                      {image ? (
                        <div className="flex flex-col items-center justify-center pb-1 h-[8.5rem] ">
                          <img
                            src={image}
                            alt="Preview"
                            className="w-full h-[7rem] object-cover mb-1 rounded-lg"
                          />
                          <p className="text-sm text-gray-400">Change image</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <CloudUploadIcon />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            JPEG, PNG, WEBP ( MAX. 2mb )
                          </p>
                        </div>
                      )}
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
                // data-changing-font-demo
                data-theming-css-variables-demo
                formattingToolbar={true}
                onChange={handleBodyChange}
              />

              <div className=" font-semibold flex flex-col gap-4 ">
                <p className="pl-8">Summary</p>
                <input
                  placeholder="eg. Next.js is a robust solution for server-side rendering, routing, and more."
                  value={formData.summary || ""}
                  type="text"
                  id="summary"
                  name="summary"
                  maxLength={200}
                  minLength={10}
                  onChange={handleInputChange}
                  className="min-h-16 max-h-28 border input-style italic"
                ></input>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const ToggleComments = memo(({ formData, setFormData, setPublished }: any) => {
  const handleToggle = () => {
    setPublished(false);
    setFormData((prev: any) => ({
      ...prev,
      allowComments: !prev.allowComments,
    }));
  };

  return (
    <>
      <label
        htmlFor="comments"
        className="inline-flex items-center cursor-pointer"
      >
        <input
          id="comments"
          name="comments"
          type="checkbox"
          className="sr-only peer"
          checked={formData.allowComments ? true : false}
          onChange={handleToggle}
        />
        <div className="relative w-8 h-4 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:start-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-60 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Allow Comments
        </span>
      </label>
    </>
  );
});
