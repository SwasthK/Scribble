import { useEffect, useState } from "react";
import { UseFormatDate } from "../../Hooks/Blogs/Format_Date";
import { Avatar } from "./Blog_Card";
import { useInView } from "react-intersection-observer";
import { useGetPostByAuthorId } from "../../services/queries";
import { Blog_Recommendation_Skeleton } from "../../Skeleton/Blog_Recommendation_Skeleton";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { EditIcon } from "../../assets/svg/EditIcon";
import { statusType } from "../../Types/type";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { BookMarkIcon } from "../../assets/svg/BookMarkIcon";
import axios from "axios";
import { debounce } from "../../utils/debounce";
import { LikeIcon } from "../../assets/svg/LikeIcon";
import toast from "react-hot-toast";
import { InstagramIcon } from "../../assets/svg/InstagramIcon";
import { TwitterIcon } from "../../assets/svg/TwitterIcon";
import { GitHubIcon } from "../../assets/svg/GitHubIcon";
import { followAtom } from "../../atoms/followAtom";

export const Blog_Details = ({ blogContent }: { blogContent: any }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const {
    id,
    title,
    slug,
    shortCaption,
    coverImage,
    createdAt,
    author,
    authorId,
    body,
    summary,
    _count: count,
    likes,
    savedBy,
  } = blogContent;

  const { refetch, data, isLoading } = useGetPostByAuthorId(
    blogContent.authorId || "",
    slug
  );

  const { formattedDate } = UseFormatDate(createdAt);

  useEffect(() => {
    if (inView && currentUserId !== authorId) {
      refetch();
    }
  }, [inView, refetch]);

  const [loadImage, setLoadImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [saved, setSaved] = useState(savedBy.length > 0 ? true : false);

  const {
    user: { id: currentUserId },
  } = useRecoilValue(authAtom);

  const location = useLocation();
  const { state } = location;

  const editor = useCreateBlockNote({
    initialContent: state?.body || "",
  });

  useEffect(() => {
    const genrateEditorData = async () => {
      const blocks = await editor.tryParseHTMLToBlocks(body || "");
      editor.replaceBlocks(editor.document, blocks);
    };
    genrateEditorData();
  }, [blogContent]);

  const handleSavePost = async () => {
    let prevSaveState: boolean = saved;
    setSaved(!saved);

    await axios.post(
      `/posts/save/${id}`,
      {
        action: !prevSaveState ? "save" : "unsave",
      },
      {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  };

  const debounceSavePost = debounce(handleSavePost, 500);

  const [likeState, setLikeState] = useState({
    count: count.likes,
    isLiked: likes.length > 0,
    load: false,
  });

  const handleLikeCount = async () => {
    if (likeState.load) {
      return;
    }

    const updatedLikeStatus = !likeState.isLiked;
    setLikeState((prev) => ({
      count: updatedLikeStatus ? prev.count + 1 : prev.count - 1,
      isLiked: updatedLikeStatus,
      load: true,
    }));

    try {
      await axios.post(
        `/post/like/${id}`,
        {},
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error: any) {
      setLikeState((prev) => ({
        ...prev,
        count: updatedLikeStatus ? prev.count - 1 : prev.count + 1,
        isLiked: !updatedLikeStatus,
      }));
      toast.error(error.response?.data.message || "Something went wrong");
    } finally {
      setLikeState((prev) => ({
        ...prev,
        load: false,
      }));
    }
  };

  const [followingAtom, setFollowAtom] = useRecoilState(followAtom);
  const isFollowing = followingAtom.following.includes(authorId);

  const handleFollowRequest = async () => {
    let prevFollowState = isFollowing;
    let optimisticState: string[];

    setFollowAtom((prev) => {
      optimisticState = prev.following;
      if (isFollowing) {
        return {
          ...prev,
          following: prev.following.filter((item) => item !== authorId),
        };
      } else {
        return {
          ...prev,
          following: [...prev.following, authorId],
        };
      }
    });

    try {
      if (prevFollowState) {
        await axios.delete(`/user/profile/${authorId}/unfollow`, {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      } else {
        await axios.post(
          `/user/profile/${authorId}/follow`,
          {},
          {
            headers: {
              accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
    } catch (error: any) {
      setFollowAtom((prev) => ({
        ...prev,
        following: optimisticState,
      }));
    }
  };

  return (
    <>
      <div className="flex justify-center items-center px-8  pt-8  sm:px-16">
        <div className="w-full flex flex-col gap-8 max-w-[700px]">
          <div className="min-h-96 max-w-3/4 ">
            <h1
              style={{ wordBreak: "break-word", lineHeight: "1.3" }}
              className="text-5xl sm:text-4xl md:text-5xl font-bold"
            >
              {title}
            </h1>
            <p
              className="pt-4 text-lg lg:text-xl"
              style={{ wordBreak: "break-word", lineHeight: "1.9" }}
            >
              {shortCaption}
            </p>
            <div
              className={`flex items-center gap-4 py-4 justify-between pr-8  ${
                currentUserId === authorId && ""
              } `}
            >
              <div className="flex gap-4 items-center justify-center">
                <Avatar size={10} url={author.avatarUrl} />
                <div>
                  <div className="justify-between flex items-center mb-1">
                    <p>{author.username}</p>

                    {currentUserId !== authorId && (
                      <button
                        onClick={handleFollowRequest}
                        className={`${
                          isFollowing ? " bg-[#162C35]" : "bg-[#0D82DF]"
                        }  text-white font-semibold px-2 rounded-md text-sm py-[0.10rem]`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                  <p>4 min read · {formattedDate}</p>
                </div>
              </div>
              {currentUserId === authorId ? (
                <Link
                  to={"/post/handle"}
                  state={{
                    postId: id,
                    authorId,
                    statusType: statusType.PUBLISHED,
                  }}
                  className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg "
                >
                  <EditIcon size={20} />
                  <p className="italic font-semibold">Edit</p>
                </Link>
              ) : (
                <>
                  <div className="flex gap-8 items-center">
                    <div className="flex items-center gap-3">
                      <LikeIcon
                        size={24}
                        onClick={handleLikeCount}
                        fill={likeState.isLiked ? "red" : "white"}
                      />
                      {likeState.count > 4 && <p>{likeState.count}</p>}
                    </div>
                    <BookMarkIcon
                      onClick={debounceSavePost}
                      fill={saved ? "white" : "none"}
                    ></BookMarkIcon>
                  </div>
                </>
              )}
            </div>

            <div className="py-6 pb-3 pt-4">
              {!loadImage && !imageError && (
                <div className="animate-pulse aspect-video bg-gray-200 rounded-xl"></div>
              )}
              {imageError ? (
                <div className="aspect-video bg-gray-800 rounded-xl flex justify-center items-center">
                  <h1 className="text-white font-semibold text-lg">
                    Failed to load the image...!
                  </h1>
                </div>
              ) : (
                <img
                  src={coverImage}
                  alt=""
                  className="aspect-video rounded-xl object-cover"
                  onLoad={() => setLoadImage(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center items-center px-8  pt-8 pb-2 sm:pb-16 sm:px-16"> */}
      <div className="flex justify-center items-center">
        <div className="w-full flex flex-col gap-8 max-w-[800px]">
          <BlockNoteView
            editor={editor}
            editable={false}
            data-theming-css-variables-demo-display-blog
            data-theming-editor
            formattingToolbar={true}
          />
        </div>
      </div>

      <div
        className="flex justify-center items-center px-8 pb-16 sm:px-16 mt-[-3rem]"
        ref={ref}
      >
        <div className="w-full flex flex-col gap-8 max-w-[700px]">
          {summary && (
            <div className="z-10 flex flex-col gap-4">
              <h1 className="italic font-semibold">Summary</h1>
              <div className="bg-[#7663630e] p-6 text-lg">
                <h1 className="text-white">{summary}</h1>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-7">
            {currentUserId !== authorId ? (
              <>
                <div className="z-10">
                  <img
                    src={author.avatarUrl}
                    alt=""
                    className="h-16 w-16 rounded-full border-none"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">
                    Written by {author.username}
                  </h1>
                  <p className="py-2">53K Followers</p>
                </div>
                <div className="flex items-center gap-5">
                  <GitHubIcon size={20} />
                  <TwitterIcon size={17} />
                  <InstagramIcon size={20} />
                </div>
              </>
            ) : (
              <>
                <div className="author-section z-10">
                  <Link
                    state={{ profile: false }}
                    to={`/profile/@${author.username}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    <p>{`More posts from you - @ ${author.username}`}</p>
                  </Link>
                  <blockquote className="text-sm italic text-gray-600 mb-2">
                    "Writing is the painting of the voice." – Voltaire
                  </blockquote>
                </div>
              </>
            )}
          </div>

          {currentUserId !== authorId ? (
            <>
              {isLoading && <Blog_Recommendation_Skeleton />}
              {data?.length > 0 && (
                <>
                  <h1 className="text-lg font-semibold">
                    More from {author.username}
                  </h1>
                  <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                    {data.map((item: any, index: number) => (
                      <Blog_Recommendation
                        key={index}
                        slug={item.slug}
                        title={item.title}
                        shortCaption={item.shortCaption}
                        coverImage={item.coverImage}
                        author={author}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* <p
              className="pt-6 text-lg lg:text-xl"
              style={{ wordBreak: "break-word", lineHeight: "1.9" }}
            >
              {body}
            </p> */}

      {/* <div className="flex mt-4 gap-4">
              {tag
                ? tag.map((tag: string) => (
                    <div
                      key={tag}
                      className="px-4 py-1 font-semibold border rounded-full text-center bg-gray-300"
                    >
                      {tag}
                    </div>
                  ))
                : null}
            </div> */}
      {/* </div>
         
         
        </div>
      </div> */}
    </>
  );
};

export const Blog_Recommendation = ({
  title,
  coverImage,
  shortCaption,
  author,
  slug,
}: {
  title: string;
  coverImage: string;
  shortCaption: string;
  slug: string;
  author: {
    avatarUrl: string;
    username: string;
  };
}) => {
  return (
    <>
      <Link to={`/blog/${slug}`} className="flex flex-col gap-6">
        <div className="">
          <img
            src={coverImage}
            alt=""
            className="aspect-video rounded-lg object-cover object-center"
          />
        </div>
        <div className="flex flex-col ">
          <div className="flex gap-4 items-center">
            <Avatar size={6} url={author.avatarUrl} />
            <p>{author.username}</p>
          </div>
          <p className="text-xl font-bold mt-5 mb-2">{title}</p>
          <p>{shortCaption}</p>
        </div>
      </Link>
    </>
  );
};
