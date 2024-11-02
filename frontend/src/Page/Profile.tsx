import { memo, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AppBar } from "../components/AppBar/AppBar";
import { Avatar } from "../components/Blogs/Blog_Card";
import { UseFormatDate } from "../Hooks/Blogs/Format_Date";
import { authAtom } from "../atoms/auth.atoms";
import { useGetUserPosts } from "../services/queries";
import { UserBlogs_Skeleton } from "../Skeleton/UserBlogs_Skeleton";
import {
  validateBio,
  validateEmail,
  validateFileSize,
  validateFileType,
  validateUsername,
} from "../components/Auth/register.validate";
import { FormErrors } from "../Types/type";
import { useMutation } from "@tanstack/react-query";
import { handleUpdateUserProfileMetadata } from "../services/api";
import { updateUserProfileMetaData } from "../Types/type";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TrashIcon } from "../assets/svg/TrashIcon";
import axios from "axios";

export const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { user: userData } = useRecoilValue(authAtom);
  const setUserData = useSetRecoilState(authAtom);
  const { formattedDate } = UseFormatDate(userData.createdAt);
  const [showAboutSection, HideBlogs] = useState(true);
  // const StateUser = "@" + userData.username;
  // const navigate = useNavigate();
  // const { username } = useParams<{ username: string }>();

  const [currentPage, setCurrentPage] = useState(1);

  const postsQuery = useGetUserPosts(currentPage);

  const { data, isError, error, isLoading, isFetching } = postsQuery;

  const pageCount = data ? Math.ceil(data.totalPosts / 6) : 6;

  // useEffect(() => {
  //     console.log(userData);
  //   if (username !== StateUser) {
  //     navigate("/blogs");
  //   }
  // }, [username, userData, navigate]);

  useEffect(() => {
    if (state?.profile === false) {
      HideBlogs(false);
    }
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  const handlePrevClick = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNextClick = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const [formData, setformData] = useState<updateUserProfileMetaData>({
    username: userData.username || "",
    email: userData.email || "",
    bio: userData.bio || "",
  });

  const [initialformData, setInitialformData] = useState(formData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [avatarPreview, setAvatarPreview] = useState(false);

  const handleCloseAvatarPreview = () => {
    setAvatarFile({
      file: null,
      url: "",
    });
    setAvatarPreview(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let clientSideError: FormErrors = {};
    let error: string | undefined = undefined;

    switch (name) {
      case "username":
        if (value !== "") {
          error = validateUsername(value);
        }
        break;
      case "email":
        if (value !== "") {
          error = validateEmail(value);
        }
        break;
      case "bio":
        if (value !== "") {
          error = validateBio(value);
        }
        break;
      default:
        break;
    }

    if (error) {
      clientSideError[name] = error;
    } else {
      clientSideError[name] = "";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...clientSideError,
    }));

    setformData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormChanged = () => {
    return (
      formData.username !== initialformData.username ||
      formData.email !== initialformData.email ||
      formData.bio !== initialformData.bio
    );
  };

  const {
    isSuccess,
    isError: isMutationError,
    error: mutationError,
    isPending,
    mutate,
    reset,
  } = useMutation({
    mutationFn: (formData: updateUserProfileMetaData) =>
      handleUpdateUserProfileMetadata(formData),
    onSuccess: (updatedData) => {
      setInitialformData(updatedData);
      setUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...updatedData,
        },
      }));
      toast.success("Profile Updated Successfully");
    },
    onError: (error: any) => {
      toast.error(error.message);
      return;
    },
  });

  const [avatarFile, setAvatarFile] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: "",
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileTypeError = validateFileType(file.type);
      const fileSizeError = validateFileSize(file.size);
      if (fileTypeError || fileSizeError) {
        setAvatarFile({
          file: null,
          url: "",
        });
        setAvatarPreview(false);
        toast.error(fileTypeError || fileSizeError);
        return;
      } else {
        setAvatarFile({
          file,
          url: URL.createObjectURL(file),
        });
        setAvatarPreview(true);
      }
    }
  };

  const [loadAvatarUpload, setLoadAvatarupload] = useState(false);

  const handleAvatarUploader = async () => {
    if (!(avatarFile.file && avatarFile.url)) {
      setAvatarPreview(false);
      return;
    }
    try {
      setLoadAvatarupload(true);
      const data = new FormData();
      data.append("file", avatarFile.file);
      const res = await axios.put("/updateUserAvatar", data, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setUserData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          avatarUrl: res.data.data.avatarUrl,
        },
      }));
      toast.success("Profile Updated Successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setAvatarFile({
        file: null,
        url: "",
      });
      setLoadAvatarupload(false);
      setAvatarPreview(false);
    }
  };

  return (
    <>
      <AppBar />

      <div className="w-screen lg:px-24 pb-8 text-white">
        <div className="relative px-8 py-8  flex border-b-[1px] border-[#ffffff3f] shadow-sm items-center gap-8 max-w-[60rem]">
          <Avatar
            url={userData.avatarUrl}
            size={16}
            onClick={() => setAvatarPreview(true)}
          />

          <div className="flex justify-center items-center absolute bottom-8 bg-white p-0 m-0 h-[1.2rem] rounded-full w-16">
            <label
              htmlFor="avatarFile"
              className="text-[.8rem] text-black cursor-pointer"
            >
              Change
              <input
                type="file"
                id="avatarFile"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {avatarPreview && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center flex-col gap-4 justify-center border-none"
              onClick={handleCloseAvatarPreview}
            >
              <div
                className="  modal-image rounded-lg overflow-hidden border-none"
                style={{ width: "80%", maxWidth: "200px", maxHeight: "80vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={avatarFile.url || userData.avatarUrl}
                  alt="Enlarged Avatar"
                  className="aspect-square border-none object-cover transform transition-all duration-700 ease-in-out scale-100 hover:scale-125"
                />
              </div>

              {avatarFile.file && avatarFile.url && (
                <div
                onClick={(e) => e.stopPropagation()}
                  className="w-full"
                  style={{ width: "80%", maxWidth: "200px", maxHeight: "80vh" }}
                >
                  <button
                    disabled={loadAvatarUpload}
                    onClick={handleAvatarUploader}
                    className="disabled:bg-green-200 disabled:cursor-not-allowed w-full px-2 text-center rounded-full bg-green-500 text-black font-semibold p-1 text-[.82rem]"
                  >
                    {loadAvatarUpload ? "Uploading" : "Update"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-4xl break-words  line-clamp-3 py-2">
              {userData.username}
            </h1>
            {data?.totalPosts != 0 ? (
              <h6>{data?.totalPosts} Posts</h6>
            ) : (
              <h6>No Posts</h6>
            )}
          </div>
        </div>
        <div className="px-12 py-8 flex gap-8">
          <h6
            onClick={() => HideBlogs(true)}
            className={`text-gray-80 cursor-pointer px-5 py-2 rounded-full ${
              showAboutSection
                ? "font-bold bg-blue-300 text-black"
                : "text-cgray "
            }`}
          >
            About
          </h6>
          <h6
            onClick={() => HideBlogs(false)}
            className={`text-gray-80 cursor-pointer px-5 py-2 rounded-full ${
              showAboutSection
                ? "font-normal"
                : "font-bold bg-blue-300 text-black"
            }`}
          >
            Blogs
          </h6>
        </div>
        <div className=" xl:min-w-[70vw]">
          {isError && <h1>{error.message}</h1>}
          {!showAboutSection && (
            <>
              <div className="xl:max-w-[70%] lg:max-w-[90%]  grid grid-cols-1 place-items-center sm:grid-cols-2 px-6 md:grid-cols-3 md:px-6  gap-8 lg:gap-6  lg:px-0 pb-8">
                {isFetching ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <UserBlogs_Skeleton key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {data?.totalPosts <= 0 ? (
                      <div className="font-semibold px-8 py-8 ">
                        No posts has been uploaded
                      </div>
                    ) : (
                      <>
                        {data?.posts.map((blog: any) => (
                          <UserBlogs
                            key={blog.id}
                            userId={data?.user.id}
                            title={blog.title}
                            shortCaption={blog.shortCaption}
                            url={blog.coverImage}
                            date={formattedDate}
                            slug={blog.slug}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              {data?.totalPosts > 0 ? (
                <div
                  className={`xl:max-w-[70%] sm:px-20 px-6 lg:max-w-[90%] flex justify-between items-center ${
                    isLoading ? "hidden" : "block"
                  }`}
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrevClick}
                    className="bg-[#1d58aa] disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-3 rounded-lg disabled:bg-[#fb8e8e] disabled:text-black"
                  >
                    Previous
                  </button>
                  <h1 className="text-lg font-semibold">
                    Page - {currentPage}
                  </h1>
                  <button
                    className="bg-[#1d58aa] disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-3 rounded-lg disabled:bg-[#fb8e8e] disabled:text-black"
                    disabled={currentPage === pageCount || isFetching}
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          )}

          {showAboutSection && (
            <>
              <div className="w-full sm:max-w-[30rem] flex md:gap-8 gap-8 px-16 pt-0 py-12 rounded-xl flex-col">
                <div className="flex gap-3 flex-col">
                  <label htmlFor="username" className="font-semibold">
                    Username
                  </label>
                  <input
                    className="input-style"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="eg. JohnDoe"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isPending}
                  />
                  {errors.username ? (
                    <p className="error">{errors.username}</p>
                  ) : (
                    <p className="text-cgray italic">
                      Your public username here.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 flex-col">
                  <label htmlFor="email" className="font-semibold">
                    Email
                  </label>
                  <input
                    className="input-style"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="eg. johndoe@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="true"
                    disabled={isPending}
                  />

                  {errors.email ? (
                    <p className="error">{errors.email}</p>
                  ) : (
                    <p className="text-cgray italic">Your email address</p>
                  )}
                </div>

                <div className="flex gap-3 flex-col">
                  <label htmlFor="bio" className="font-semibold">
                    Bio
                  </label>
                  <textarea
                    className="input-style text-wrap break-words overflow-y-scroll"
                    style={{ resize: "none", height: "250px" }}
                    name="bio"
                    id="bio"
                    cols={10}
                    rows={10}
                    value={formData.bio}
                    maxLength={300}
                    disabled={isPending}
                    onChange={handleChange}
                  ></textarea>

                  {errors.bio ? (
                    <p className="error">{errors.bio}</p>
                  ) : (
                    <p className="text-cgray italic">
                      Anything that describes you
                    </p>
                  )}
                </div>

                {isFormChanged() &&
                  !errors.username &&
                  !errors.email &&
                  !errors.bio && (
                    <div>
                      <button
                        disabled={isPending || !isFormChanged()}
                        type="submit"
                        className="bg-[#1d58aa]  disabled:text-black disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-3 rounded-lg"
                        onClick={() => {
                          if (
                            !errors.username &&
                            !errors.email &&
                            !errors.bio
                          ) {
                            mutate(formData);
                          }
                        }}
                      >
                        {isPending ? "Updating..." : "Update"}
                      </button>
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const UserBlogs = memo(
  ({
    title,
    shortCaption,
    url,
    date,
    slug,
  }: {
    userId?: number | string;
    title: string;
    shortCaption: string;
    url: string;
    date: string;
    slug: string;
  }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
      <>
        <Link
          to={`/blog/${slug}`}
          className="bg-[#1F2937] relative border-4 border-[#161616] hover:border-[#ffffff] overflow-hidden group hover:bg-[#304158] cursor-pointer transition-colors duration-300 ease-in max-w-72 pb-6 rounded-2xl flex flex-col gap-6 justify-center items-center md:max-w-60 "
        >
          {/* {!isImageLoaded && !hasError && (
            <div className="aspect-video w-full rounded-2xl rounded-b-none bg-gray-200 animate-pulse" />
          )} */}

          {hasError ? (
            <div className=" w-[64rem] h-[8rem] rounded-2xl rounded-b-none bg-red-200 flex justify-center items-center">
              <span className="text-red-500 font-semibold">
                Failed to Load the Image
              </span>
            </div>
          ) : (
            <div className="overflow-hidden">
              <img
                src={url}
                alt="blog"
                className={`aspect-video w-full group-hover:scale-[1.1] transition-transform duration-300 ease-in sm:max-w-full rounded-2xl rounded-b-none object-cover object-center ${
                  isImageLoaded ? "" : "hidden"
                }`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setHasError(true)}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 w-full px-3">
            <h1 className="text-[1.1rem] font-semibold ">
              {title.length > 25 ? title.substring(0, 50) + " ..." : title}
            </h1>
            <h6 className="text-sm text-cgray font-semibold">
              {shortCaption.length > 50
                ? shortCaption.substring(0, 50) + " ..."
                : shortCaption}
            </h6>
            <div className="text-xs flex justify-between items-start w-full">
              <p>{date}</p>
              <p className="text-green-500">Published</p>
            </div>
          </div>

          {/* <div className="absolute top-[-16px] right-[-10px] h-8 w-8 rounded-full bg-red-500 flex justify-center items-center">
            <TrashIcon size={18} />
          </div> */}
        </Link>
      </>
    );
  }
);
