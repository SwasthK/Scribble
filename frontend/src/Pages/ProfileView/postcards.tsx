import { memo } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

export const PostCards = memo(({ data }: { data: any }) => {
  return (
    <>
      {data?.userPostDetails.map((post: any) => (
        <Link
          key={post.slug}
          to={`/blog/${post.slug}`}
          className="flex gap-4 sm:h-20 overflow-hidden py-1"
        >
          <div className="w-36 h-full ">
            <img
              loading="lazy"
              src={post.coverImage}
              alt=""
              className="h-full rounded-md w-36 object-center object-cover  hidden sm:block"
            />
          </div>

          <div className="flex input-style border  flex-col gap-1 w-full overflow-hidden flex-grow">
            <h1 className="">
              {post.title.length > 30
                ? `${post.title.slice(0, 30)}...`
                : post.title}
            </h1>
            <h6 className="text-[0.800rem] text-gray-400 font-semibold">
              <ReactTimeAgo
                date={new Date(post.updatedAt)}
                locale="en-US"
                timeStyle={"round-minute"}
                updateInterval={1000}
              />
            </h6>
          </div>
        </Link>
      ))}
    </>
  );
});
