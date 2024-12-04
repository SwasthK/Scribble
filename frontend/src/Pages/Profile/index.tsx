import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Avatar } from "./../Blogs/blogcard";
// import { UseFormatDate } from "../../Hooks/Blogs/Format_Date";
import { authAtom } from "../../atoms/auth.atoms";
import { useGetUserPosts } from "../../services/queries";
import { UserBlogs_Skeleton } from "../../Skeleton/UserBlogs_Skeleton";
import {
  validateBio,
  validateEmail,
  validateFileSize,
  validateFileType,
  validateUsername,
} from "../../components/Auth/register.validate";
import { FormErrors, pageSection, socialPlatforms } from "../../Types/type";
import { useMutation } from "@tanstack/react-query";
import {
  handleUpdateUserProfileMetadata,
  handleUpdateUserSocials,
} from "../../services/api";
import { updateUserProfileMetaData } from "../../Types/type";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import axios from "axios";
import { RefreshIcon } from "../../assets/svg/RefreshIcon";

import { GitHubIcon } from "../../assets/svg/GitHubIcon";
import { TwitterIcon } from "../../assets/svg/TwitterIcon";
import { InstagramIcon } from "../../assets/svg/InstagramIcon";
import { SectionBar } from "./sectionbar";
import UserBlogs from "./userblogs";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { user: userData } = useRecoilValue(authAtom);
  const setUserData = useSetRecoilState(authAtom);
//   const { formattedDate } = UseFormatDate(userData.createdAt);

  const [section, setSection] = useState(pageSection.ABOUT);

  const [currentPage, setCurrentPage] = useState(1);

  const postsQuery = useGetUserPosts(currentPage);

  const { data, isError, error, isLoading, isFetching, refetch } = postsQuery;

  const pageCount = data ? Math.ceil(data.totalPosts / 6) : 6;

  console.log(data);

  useEffect(() => {
    if (state?.section === pageSection.ABOUT) {
      setSection(pageSection.ABOUT);
    } else if (state?.section === pageSection.SOCIALS) {
      setSection(pageSection.SOCIALS);
    } else if (state?.section === pageSection.BLOGS) {
      setSection(pageSection.BLOGS);
    } else {
      setSection(pageSection.ABOUT);
    }

    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
    }
  }, [data]);

  const handleRefetch = async () => {
    const { data: newData } = await refetch();
    if (newData) {
      setPosts(newData.posts);
    }
  };

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

  const [socials, setSocials] = useState([
    {
      platform: socialPlatforms.GITHUB,
      url:
        userData.socials.find(
          (social: any) => social.platform === socialPlatforms.GITHUB
        )?.url || null,
    },
    {
      platform: socialPlatforms.X,
      url:
        userData.socials.find(
          (social: any) => social.platform === socialPlatforms.X
        )?.url || null,
    },
    {
      platform: socialPlatforms.INSTAGRAM,
      url:
        userData.socials.find(
          (social: any) => social.platform === socialPlatforms.INSTAGRAM
        )?.url || null,
    },
  ]);

  const [initialSocialData, setInitialSocialData] = useState(socials);

  const handleSocialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocials((prev) =>
      prev.map((social: any) =>
        social.platform === name ? { ...social, url: value } : social
      )
    );
  };

  const isSocialChange = () => {
    return socials.some(
      (social: any, index: number) =>
        social.url !== initialSocialData[index]?.url
    );
  };

  const { isPending, mutate } = useMutation({
    mutationFn: (formData: updateUserProfileMetaData) =>
      handleUpdateUserProfileMetadata(formData),
    onSuccess: (updatedData) => {
      setformData((prev) => ({
        ...prev,
        ...updatedData,
      }));
      setInitialformData((prev) => ({
        ...prev,
        ...updatedData,
      }));
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

  const handleDeleteAndArchivePost = (id: string) => {
    setPosts((prevPosts: any) =>
      prevPosts.filter((post: any) => post.id !== id)
    );
  };

  const { isPending: socialUpdatePending, mutate: handleSocialsUpdate } =
    useMutation({
      mutationFn: (socials: any) => handleUpdateUserSocials(socials),
      onSuccess: (updatedData) => {
        let stateData = [
          {
            platform: socialPlatforms.GITHUB,
            url:
              updatedData.find(
                (social: any) => social.platform === socialPlatforms.GITHUB
              )?.url || null,
          },
          {
            platform: socialPlatforms.X,
            url:
              updatedData.find(
                (social: any) => social.platform === socialPlatforms.X
              )?.url || null,
          },
          {
            platform: socialPlatforms.INSTAGRAM,
            url:
              updatedData.find(
                (social: any) => social.platform === socialPlatforms.INSTAGRAM
              )?.url || null,
          },
        ];

        const updateStateData = (data: any) => {
          setSocials(data);
          setInitialSocialData(data);
          setUserData((prev) => ({
            ...prev,
            user: { ...prev.user, socials: data },
          }));
        };

        updateStateData(stateData);

        toast.success("Socials Updated Successfully");
      },
      onError: (error: any) => {
        toast.error(error.message);
        return;
      },
    });

  return (
    <>
      <div className="w-screen lg:px-24 pb-10 text-white">
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
              className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center flex-col gap-4 justify-center border-none"
              onClick={handleCloseAvatarPreview}
            >
              <div
                className="modal-image rounded-lg overflow-hidden border-none"
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
            <h1 className="font-semibold text-4xl break-words line-clamp-3 py-2">
              {userData.username}
            </h1>
            {isFetching ? (
              <p className="w-16 h-4 skeleton-parent rounded-md">
                <p className="w-16 h-4 skeleton-child"></p>
              </p>
            ) : data?.totalPosts !== 0 ? (
              <h6 className="h-4 text-sm">{data?.totalPosts} Posts</h6>
            ) : (
              <h6 className="h-4 text-sm text-giest-100">No Posts</h6>
            )}
          </div>
        </div>

        <div className="px-12 py-8 flex gap-12 items-center max-w-[60rem]">
          <SectionBar
            label={"about"}
            section={section}
            setSection={setSection}
          />

          <SectionBar
            label={"socials"}
            section={section}
            setSection={setSection}
          />

          <SectionBar
            label={"blogs"}
            section={section}
            setSection={setSection}
          />

          {section === pageSection.BLOGS && !isFetching && (
            <RefreshIcon
              onClick={handleRefetch}
              size={26}
              className="p-1 rounded-full hover:bg-[#334155] transform transition-transform duration-300 hover:rotate-[-180deg]"
            />
          )}
        </div>

        <div className=" xl:min-w-[70vw]">
          {isError && <h1>{error.message}</h1>}

          {section === pageSection.BLOGS && (
            <>
              <div
                className={`xl:max-w-[70%] lg:max-w-[90%] px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                   ${
                     posts.length <= 0 || data?.totalPosts <= 0
                       ? "place-items-start"
                       : "place-items-center "
                   } md:px-6 gap-8 lg:gap-6  lg:px-0 pb-8`}
              >
                {isFetching ? (
                  <>
                    {[...Array(6)].map((_, index) => (
                      <UserBlogs_Skeleton key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {posts.length <= 0 || data?.totalPosts <= 0 ? (
                      <div className="flex justify-center col-span-2 items-center gap-6 flex-col sm:flex-row font-semibold px-8 py-8">
                        <p>No posts has been uploaded</p>
                        <Link
                          to={"/post/handle"}
                          className="bg-gray-300 font-semibold cursor-pointer px-4 py-2 text-black text-sm text-center rounded-lg"
                        >
                          Get Started
                        </Link>
                      </div>
                    ) : (
                      <>
                        <UserBlogs
                          onDeleteAndArchive={handleDeleteAndArchivePost}
                          posts={posts}
                          currentUserId={userData.id}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
              {posts.length > 0 && data?.totalPosts > 0 ? (
                <div
                  className={`xl:max-w-[70%] sm:px-20 px-6 lg:max-w-[90%] flex justify-between items-center ${
                    isLoading ? "hidden" : "block"
                  }`}
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={handlePrevClick}
                    className="bg-[#1d58aa] disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-2 rounded-lg disabled:bg-[#fb8e8e] disabled:text-black"
                  >
                    Previous
                  </button>
                  <h1 className="text-md font- text-giest-100 font-light">
                    Page - {currentPage}
                  </h1>
                  <button
                    className="bg-[#1d58aa] disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-2 rounded-lg disabled:bg-[#fb8e8e] disabled:text-black"
                    disabled={currentPage === pageCount || isFetching}
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </>
          )}

          {section == pageSection.ABOUT && (
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
                    <p className="error bg-cgray-100 px-2 py-[0.1rem] text-sm rounded-md">
                      {errors.username}
                    </p>
                  ) : (
                    <p className="text-giest-100 font-light text-sm font-giest">
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
                    <p className="error bg-cgray-100 px-2 py-[0.1rem] text-sm rounded-md">
                      {errors.email}
                    </p>
                  ) : (
                    <p className="text-giest-100 font-light text-sm font-giest">
                      Your email address
                    </p>
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
                    <p className="error bg-cgray-100 px-2 py-[0.1rem] text-sm rounded-md">
                      {errors.bio}
                    </p>
                  ) : (
                    <p className="text-giest-100 font-light text-sm font-giest">
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
                        className="bg-[#1d58aa] disabled:bg-[#8babce] hover:bg-[#406ca9] transition-colors duration-100 disabled:text-black disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-3 rounded-lg"
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

          {section === pageSection.SOCIALS && (
            <>
              <div className="w-full sm:max-w-[30rem] flex md:gap-8 gap-8 px-16 pt-0 py-12 rounded-xl flex-col">
                {socials.map((social: any) => (
                  <div key={social.platform} className="flex gap-3 flex-col">
                    <div className=" flex gap-5 items-center">
                      {social.platform === socialPlatforms.GITHUB ? (
                        <GitHubIcon size={24} url={social.url || ""} />
                      ) : social.platform === socialPlatforms.X ? (
                        <TwitterIcon size={19} url={social.url || ""} />
                      ) : social.platform === socialPlatforms.INSTAGRAM ? (
                        <InstagramIcon size={24} url={social.url || ""} />
                      ) : null}
                      <input
                        className="input-style flex-grow"
                        type="text"
                        id={social.platform}
                        name={social.platform}
                        placeholder={`eg. https://${social.platform}.com/${
                          userData.username || "username"
                        }`}
                        value={social.url}
                        onChange={handleSocialsChange}
                        autoComplete="true"
                        disabled={socialUpdatePending}
                      />
                    </div>
                  </div>
                ))}

                {isSocialChange() && (
                  <div>
                    <button
                      disabled={socialUpdatePending}
                      type="submit"
                      className="bg-[#1d58aa] disabled:bg-[#8babce] hover:bg-[#406ca9] transition-colors duration-100 disabled:text-black disabled:cursor-not-allowed font-semibold cursor-pointer px-8 py-3 rounded-lg"
                      onClick={() => handleSocialsUpdate(socials)}
                    >
                      {socialUpdatePending ? "Updating..." : "Update"}
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

export default Profile;
