import { memo } from "react";
import { trimTitle } from "../../utils/trimTitle";
import { UnArchiveIcon } from "../../assets/svg/UnArchiveIcon";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ArchivedCard = memo(
  ({
    posts,
    onUnArchive,
  }: {
    posts: any;
    onUnArchive: (id: string) => void;
  }) => {
    const handleOnUnArchive = async (id: string) => {
      onUnArchive(id);
      try {
        axios.post(
          `/post/unarchive/${id}`,
          {},
          {
            headers: {
              accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      } catch (error) {
        toast.error("Failed to UnArchive the post");
      }
    };

    return (
      <div
        className={`max-w-[100rem]  p-2 gap-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 `}
      >
        {posts?.map((post: any) => (
          <div
            key={post.id}
            className="w-full flex gap-4 justify-start items-center rounded-md pr-2 bg-[#27272A]"
          >
            <img
              src={post.coverImage || ""}
              className="h-16 w-16 bg-gray-300 rounded-l-md object-cover"
            ></img>
            <div className="flex justify-between items-center gap-2">
              <Link
                to={`/blog/${post.slug}`}
                className="min-w-52 font-semibold"
              >
                <h1> {trimTitle(post.title, 30)}</h1>
              </Link>
              <UnArchiveIcon
                size={26}
                onclick={() => handleOnUnArchive(post.id)}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default ArchivedCard;
