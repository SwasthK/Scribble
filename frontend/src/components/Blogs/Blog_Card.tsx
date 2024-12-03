import { Link } from "react-router-dom";
import { CommentIcon } from "../../assets/svg/CommentIcon";
import { LikeIcon } from "../../assets/svg/LikeIcon";
import { memo, useState } from "react";
import { BookMarkIcon } from "../../assets/svg/BookMarkIcon";
import axios from "axios";
import { debounce } from "../../utils/debounce";
import { trimTitle } from "../../utils/trimTitle";
import toast from "react-hot-toast";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";

interface Blog_CardProps {
  id: string;
  author: {
    username: string;
    avatarUrl: string;
  };
  coverImage: string;
  title: string;
  slug: string;
  shortCaption: string;
  count: {
    comments: number;
    likes: number;
  };
  likes: string[];
  isSaved?: boolean;
  createdAt: string;
}

export const Blog_Card: React.FC<Blog_CardProps> = memo(
  ({
    id,
    author,
    coverImage,
    title,
    slug,
    shortCaption,
    count,
    likes,
    isSaved,
    createdAt,
  }) => {
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgHasError, setimgHasError] = useState(false);
    const [saved, setSaved] = useState(isSaved || false);

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

    const [likeLoad, setLikeLoad] = useState(false);

    const [likeState, setLikeState] = useState({
      count: count.likes,
      isLiked: likes.length > 0,
    });

    const handleLikeCount = async () => {
      if (likeLoad) {
        return;
      }

      const updatedLikeStatus = !likeState.isLiked;
      setLikeState((prev) => ({
        count: updatedLikeStatus ? prev.count + 1 : prev.count - 1,
        isLiked: updatedLikeStatus,
      }));

      setLikeLoad(true);

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
          count: updatedLikeStatus ? prev.count - 1 : prev.count + 1,
          isLiked: !updatedLikeStatus,
        }));
        toast.error(error.response?.data.message || "Something went wrong");
      } finally {
        setLikeLoad(false);
      }
    };

    return (
      <>
        <div
          key={id}
          className="text-white py-10 w-full border-b-[0.01rem] border-[#9ca3af2b] cursor-pointer flex items-center gap-6 md:gap-12 lg:gap-8"
        >
          <div className="w-[75%] sm:w-[73%] md:w-[70%] lg:w-[78%] xl:w-[70%]">
            <div className="flex gap-2 items-center mb-3">
              <Link
                to={`/view/profile/${author.username}`}
                className="flex gap-2 items-center"
              >
                <ShadcnAvatar className="h-6 w-6">
                  <AvatarImage src={author.avatarUrl} />
                  <AvatarFallback>{author.username.slice(0, 3)}</AvatarFallback>
                </ShadcnAvatar>
                <h1 className="capitalize text-[0.850rem] font-semibold ">
                  {author.username}
                </h1>
              </Link>
              <span className="font-bold ">&#183;</span>
              <h1 className="text-xs sm:text-sm text-giest-100 capitalize cursor-auto font-light">
                {formattedDate}
              </h1>
            </div>

            <Link
              state={{
                id: "i am from blog Card",
              }}
              to={`/blog/${slug}`}
            >
              <div className="mb-6">
                <h1 className="font-giest font-extrabold text-xl text-wrap break-words sm:text-xl md:text-2xl ">
                  {trimTitle(title, 55)}
                </h1>
                <p className="text-giest-100 mt-2 break-words line-clamp-3 sm:text-base font-normal">
                  {shortCaption}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-8 cursor-auto">
              <div className="gap-3 items-center text-sm hidden sm:flex">
                {/* {tags.map((tag) => (
                  <div
                    key={tag}
                    className="font-semibold text-xs p-1 px-2.5 rounded-md bg-sky-500 text-center justify-center items-center flex"
                  >
                    {tag}
                  </div>
                ))} */}
                <h1 className="text-giest-200">{`${Math.ceil(
                  title.length / 500
                )} min read`}</h1>
              </div>
              <div className="flex gap-8 items-center">
                <div className="flex items-center gap-2 cursor-pointer">
                  <LikeIcon
                    size={18}
                    onClick={handleLikeCount}
                    fill={likeState.isLiked ? "red" : "white"}
                  />
                  {likeState.count > 4 && <p>{likeState.count}</p>}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <CommentIcon size={18} />
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <BookMarkIcon
                    onClick={debounceSavePost}
                    size={18}
                    fill={saved ? "white" : "none"}
                  />
                </div>
              </div>
            </div>
          </div>

          {!imgLoaded && !imgHasError && (
            <div className="animate-pulse rounded-lg h-20 sm:h-24 md:h-28 lg:h-32 w-[25%] md:w-[12em] bg-gray-200 sm:max-w-[20%] lg:max-w-[100%]"></div>
          )}

          {imgHasError ? (
            <div className="px-4 flex justify-center items-center rounded-lg h-20 sm:h-24 md:h-28 lg:h-32 w-[25%] md:w-[12em] bg-cdark-100  sm:max-w-[20%] lg:max-w-[100%]">
              <span className="font-scribble2 text-[0.85rem] text-c">
                ERROR
              </span>
            </div>
          ) : (
            <img
              src={coverImage || ""}
              alt="blog"
              className={` object-cover rounded-lg h-20 sm:h-24 md:h-28 lg:h-32 w-[25%] md:w-[12em] bg-white sm:max-w-[20%] lg:max-w-[100%]  ${
                imgLoaded ? "" : "hidden"
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setimgHasError(true)}
            />
          )}
        </div>
      </>
    );
  }
);

export const Avatar = memo(
  ({
    size,
    url,
    onClick,
    className,
  }: {
    name?: string;
    size: number;
    url?: string;
    onClick?: any;
    className?: string;
  }) => {
    return (
      // <div
      //   className={`w-${size} border-black border rounded-full bg-gray-200 h-${size} flex justify-center items-center font-semibold cursor-pointer`}
      //   // className="rounded-full bg-gray-200 h-10 w-10 flex justify-center items-center font-semibold cursor-pointer"
      // >
      //   {name ? (
      //     name[0].toUpperCase()
      //   ) : (
      //     <img className="rounded-full bg-gray-200 h-10 w-10 flex justify-center items-center font-semibold cursor-pointer" src={url} alt="Me" loading="lazy" />
      //   )}
      // </div>
      <>
        <img
          onClick={onClick}
          className={`w-${size} ${className} border-black border rounded-full bg-white h-${size} flex justify-center items-center font-semibold cursor-pointer`}
          src={url}
          loading="lazy"
        />
      </>
    );
  }
);
