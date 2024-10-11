import { useState } from "react";
import { usePostBlog } from "../../Hooks/Blogs/Post_Blog";
import "./Loader.css";
import { Loader } from "../../Skeleton/Loader";

export const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { loading, postBlog } = usePostBlog();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className=" px-10 py-6 flex flex-col gap-6 sm:px-16 md:px-24 justify-center items-center">
          <div className="flex flex-col gap-4 max-w-[40rem] w-full">
            <label htmlFor="title" className="font-bold sm:text-3xl">
              Title
            </label>
            <input
              className="text-xl px-2.5 py-2 font-semibold border-2 rounded-md border-gray-300 outline-black"
              type="text"
              name="title"
              id="title"
              placeholder="Add title here"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4 max-w-[40rem] w-full">
            <label htmlFor="description" className="font-bold sm:text-3xl">
              Description
            </label>
            <textarea
              className="bg-gray-50 border  mb-4 border-gray-300 text-gray-900 text-lg rounded-lg outline-black  block w-full p-2.5"
              rows={10}
              cols={10}
              style={{
                resize: "vertical",
                // maxWidth:"800px",
                minHeight: "350px",
              }}
              name="description"
              id="description"
              placeholder="Add description here"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[40rem]">
            <button
              onClick={async () =>
                await postBlog(title, description, true, ["tag1", "tag2"])
              }
              className="w-full bg-green-500 py-2 rounded-md font-bold"
              type="submit"
            >
              Publish Post
            </button>
          </div>
        </div>
      )}
    </>
  );
};
