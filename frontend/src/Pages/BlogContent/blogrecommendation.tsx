import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Link } from "react-router-dom";
import { Blog_Recommendation_Skeleton } from "../../Skeleton/Blog_Recommendation_Skeleton";
import { memo, useEffect } from "react";

const Blog_Recommendation = memo(
  ({
    authorName,
    authorAvatarurl,
    data,
    authorId,
    currentUserId,
    isLoading,
  }: {
    authorName: string;
    authorAvatarurl: string;
    data: any;
    currentUserId: any;
    authorId: any;
    isLoading: any;
  }) => {
    useEffect(() => {
      console.log(data);
    }, [data]);
    return (
      <>
        {currentUserId !== authorId ? (
          <>
            {isLoading && <Blog_Recommendation_Skeleton />}
            {data?.length > 0 && (
              <>
                <h1 className="text-base font-semibold mt-7">
                  Recommended Posts
                </h1>
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                  {data.map((post: any) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="flex flex-col gap-6"
                    >
                      <div className="">
                        <img
                          src={post.coverImage}
                          alt=""
                          className="aspect-video rounded-lg object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col ">
                        <div className="flex gap-4 items-center">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={authorAvatarurl} />
                            <AvatarFallback>
                              {authorName.slice(0, 3)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm md:text-[0.9rem]">
                            {authorName}
                          </p>
                        </div>
                        <p className="text-xl font-bold mt-2 mb-1">
                          {post.title}
                        </p>
                        <p className="text-giest-100">{post.shortCaption}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </>
    );
  }
);

export default Blog_Recommendation;
