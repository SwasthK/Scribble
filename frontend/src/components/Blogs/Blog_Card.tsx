import { Link } from "react-router-dom";
import { CommentIcon } from "../../assets/svg/CommentIcon";
import { LikeIcon } from "../../assets/svg/LikeIcon";
import { memo, useState } from "react";
import { BookMarkIcon } from "../../assets/svg/BookMarkIcon";
import axios from "axios";
import { debounce } from "../../Page/NoveEditor";
import { trimTitle } from "../../utils/trimTitle";

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

    return (
      <>
        <div
          key={id}
          className="text-white py-10 w-full border-b-[0.01rem] border-[#9ca3af2b] cursor-pointer flex items-center gap-6 md:gap-12 lg:gap-8"
        >
          <div className="w-[75%] sm:w-[73%] md:w-[70%] lg:w-[78%] xl:w-[70%]">
            <Link
              to={`/profile/@${author.username}`}
              className="flex gap-2 items-center mb-3"
            >
              <div className="flex gap-2 items-center">
                <Avatar url={author.avatarUrl} size={6} />
                <h1 className="capitalize text-[0.850rem]">
                  {author.username}
                </h1>
              </div>
              <span className="font-bold ">&#183;</span>
              <h1 className="text-xs sm:text-sm text-[#9CA3AF] capitalize">
                {formattedDate}
              </h1>
            </Link>

            <Link
              state={{
                id: "i am from blog Card",
              }}
              to={`/blog/${slug}`}
            >
              <div className="mb-6">
                <h1 className="font-bold text-xl text-wrap break-words sm:text-xl md:text-2xl ">
                  {trimTitle(title, 55)}
                </h1> 
                <p className="text-[#9CA3AF] mt-2 break-words line-clamp-3 sm:text-base">
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
                <h1 className="text-[#fff]">{`${Math.ceil(
                  title.length / 500
                )} min read`}</h1>
              </div>
              <div className="flex gap-8 items-center">
                <div className="flex items-center gap-2 cursor-pointer">
                  <LikeIcon size={18} />
                  <p>{count.likes}</p>
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
            <div className="px-2 flex justify-center items-center rounded-lg h-20 sm:h-24 md:h-28 lg:h-32 w-[25%] md:w-[12em] bg-gray-200 sm:max-w-[20%] lg:max-w-[100%]">
              <span className="text-red-500 font-semibold text-sm text-center sm:text-base">
                Failed to Load the Image
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
  }: {
    name?: string;
    size: number;
    url?: string;
    onClick?: any;
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
          className={`w-${size} border-black border rounded-full bg-white h-${size} flex justify-center items-center font-semibold cursor-pointer`}
          src={url}
          loading="lazy"
        />
      </>
    );
  }
);
