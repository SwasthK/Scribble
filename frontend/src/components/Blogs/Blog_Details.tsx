import { useEffect, useState } from "react";
import { UseFormatDate } from "../../Hooks/Blogs/Format_Date";
import { Avatar } from "./Blog_Card";
import { useInView } from "react-intersection-observer";
import { useGetPostByAuthorId } from "../../services/queries";
import { Blog_Recommendation_Skeleton } from "../../Skeleton/Blog_Recommendation_Skeleton";
import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { EditIcon } from "../../assets/svg/EditIcon";
import { statusType } from "../../Page/HandlePost";

export const Blog_Details = ({ blogContent }: { blogContent: any }) => {
  const { refetch, data, isLoading } = useGetPostByAuthorId(
    blogContent.authorId || ""
  );

  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const {
    id,
    title,
    shortCaption,
    coverImage,
    createdAt,
    author,
    authorId,
    body,
    summary,
  } = blogContent;

  const { formattedDate } = UseFormatDate(createdAt);

  useEffect(() => {
    if (inView && currentUserId !== authorId) {
      refetch();
    }
  }, [inView, refetch]);

  const [loadImage, setLoadImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    user: { id: currentUserId },
  } = useRecoilValue(authAtom);

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    console.log("state : ", state);
  }, [state]);

  return (
    <>
      <div className="flex justify-center items-center px-8 py-16 sm:px-16">
        <div className="w-full flex flex-col gap-8 max-w-[700px]">
          <div className="min-h-96 max-w-3/4 ">
            <h1
              style={{ wordBreak: "break-word", lineHeight: "1.3" }}
              className="text-5xl sm:text-4xl md:text-5xl font-bold"
            >
              {title}
            </h1>
            <p
              className="pt-6 text-lg lg:text-xl"
              style={{ wordBreak: "break-word", lineHeight: "1.9" }}
            >
              {shortCaption}
            </p>
            <div
              className={`flex items-center gap-4 py-7 ${
                currentUserId === authorId && "justify-between pr-8"
              } `}
            >
              <div className="flex gap-4 items-center justify-center">
                <Avatar size={10} url={author.avatarUrl} />
                <div>
                  <p>{author.username} · Follow</p>
                  <p>4 min read · {formattedDate}</p>
                </div>
              </div>
              {currentUserId === authorId && (
                <Link
                  to={"/post/handle"}
                  state={{
                    postId: id,
                    authorId,
                    statusType: statusType.PUBLISHED,
                  }}
                  className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-cdark-200 border-2"
                >
                  <EditIcon />
                  <p>Edit</p>
                </Link>
              )}
            </div>

            <div className="py-6">
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
                  className="aspect-video rounded-xl"
                  onLoad={() => setLoadImage(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            <p
              className="pt-6 text-lg lg:text-xl"
              style={{ wordBreak: "break-word", lineHeight: "1.9" }}
            >
              {body}
            </p>
            <div ref={ref}></div>
            <div className="mt-8 py-8">
              <p className="italic">Summary</p>
              <p
                style={{ wordBreak: "break-word", lineHeight: "1.5" }}
                className="mt-4 text-base md:text-lg"
              >
                {summary}
              </p>
            </div>

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
          </div>
          <div className="flex flex-col gap-7">
            <div>
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
          <img src={coverImage} alt="" className="aspect-video rounded-lg" />
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
