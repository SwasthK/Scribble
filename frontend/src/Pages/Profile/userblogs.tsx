import { Link } from "react-router-dom";
import { ArchiveIcon } from "../../assets/svg/ArchiveIcon";
import { TrashIcon } from "../../assets/svg/TrashIcon";
import axios from "axios";
import { memo, useState } from "react";
import toast from "react-hot-toast";

const UserBlogs = memo(
  ({
    posts,
    onDeleteAndArchive,
    currentUserId,
  }: {
    posts: any;
    onDeleteAndArchive: (id: string) => void;
    currentUserId: string;
  }) => {
    const [hasError, setHasError] = useState(false);

    const handleDeleteAndArchive = async ({
      action,
      id,
    }: {
      action: string;
      id: string;
    }) => {
      try {
        if (!action || (action !== "archive" && action !== "delete")) {
          return;
        }
        onDeleteAndArchive(id);

        switch (action) {
          case "delete":
            await axios.delete(`/posts/delete/publishById/${id}`, {
              headers: {
                accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            });
            break;
          case "archive":
            await axios.post(
              `/post/archive/${id}`,
              {},
              {
                headers: {
                  accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              }
            );
            break;
          default:
            toast.error("Something went wrong");
            break;
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    return (
      <>
        {posts.map((blog: any) => (
          <div className="bg-[#1F2937] relative border-2 min-w-[16rem] border-[#212121] transition-all ease-in duration-700 hover:border-[#ffffff] overflow-hidden group max-w-72 pb-3 rounded-2xl flex flex-col gap-6 justify-center items-center md:max-w-60 ">
            <Link to={`/blog/${blog.slug}`} className="w-full">
              {hasError ? (
                <div className="h-[8rem] rounded-2xl rounded-b-none bg-cdark-100 flex justify-center items-center">
                  <h1 className="text-sm text-giest-100 font-light">
                    Failed to Load the Image
                  </h1>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <img
                    loading="lazy"
                    src={blog.coverImage}
                    alt="blog"
                    className={`aspect-video w-full group-hover:scale-[1.2] transition-transform duration-300 ease-in sm:max-w-full rounded-2xl rounded-b-none object-cover object-center`}
                    onError={() => setHasError(true)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 w-full  px-3 mt-2">
                <h1 className="text-[1.1rem] font-semibold ">
                  {blog.title.length > 22
                    ? blog.title.substring(0, 22) + " ..."
                    : blog.title}
                </h1>
                <h6 className="text-sm text-giest-100  font-giest">
                  {blog.shortCaption.length > 28
                    ? blog.shortCaption.substring(0, 28) + " ..."
                    : blog.shortCaption}
                </h6>
                <div className="text-xs flex justify-between items-start w-full">
                  <p>{blog.date}</p>
                  <p className="text-green-500">Published</p>
                </div>
              </div>
            </Link>
            {currentUserId === blog.authorId && (
              <div className="flex justify-end items-center w-full px-4 gap-6">
                <button
                  onClick={() =>
                    handleDeleteAndArchive({ action: "delete", id: blog.id })
                  }
                  className="p-1 rounded-full hover:bg-[#334155]"
                >
                  <TrashIcon
                    className={"cursor-pointer"}
                    size={15}
                    color={"orange"}
                  />
                </button>
                <button
                  onClick={() =>
                    handleDeleteAndArchive({ action: "archive", id: blog.id })
                  }
                  className="p-1 rounded-full hover:bg-[#334155]"
                >
                  <ArchiveIcon
                    className={"cursor-pointer"}
                    size={15}
                    color={"white"}
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </>
    );
  }
);

export default UserBlogs;
