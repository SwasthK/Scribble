import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { memo } from "react";

const TopicPostCards = memo(({ data }: { data: any }) => {
  return (
    <>
      {data?.map((post: any) => (
        <Link
          to={`/blog/${post.slug}`}
          key={post.slug}
          className="flex flex-col gap-2 mb-3  p-4 m-1 pb-6 bordern input-style"
        >
          <div className="flex gap-6">
            <Avatar className="mt-1 h-8 w-8">
              <AvatarImage src={post.author.avatarUrl} />
              <AvatarFallback>
                {post.author.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sm">{post.author.username}</h1>
              <h1 className="font-normal text-sm text-gray-300">meta info</h1>
            </div>
          </div>

          <h1 className="font-semibold xl:text-2xl mt-3 lg:text-xl">
            {post.title.slice(0, 20)}
          </h1>
        </Link>
      ))}
    </>
  );
});

export default TopicPostCards;
