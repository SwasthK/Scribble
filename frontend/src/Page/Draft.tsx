import { useEffect, useState } from "react";
import { AppBar } from "../components/AppBar/AppBar";
import { useGetDraftedPost } from "../services/queries";
import { Link } from "react-router-dom";
import { RightArrow } from "../assets/svg/RightArrow";
import { TrashIcon } from "./TrashIcon";
import { DraftCardSkeleton } from "../Skeleton/DraftCard_Skeleton";
import ReactTimeAgo from "react-time-ago";
import axios from "axios";
import { statusType } from "./HandlePost";

export const Draft = () => {
  const postsQuery = useGetDraftedPost();
  const { data, isFetching, isError, error ,isLoading} = postsQuery;
  const [drafts, setDrafts] = useState(data || []);

  useEffect(() => {
    if (data) {
      setDrafts(data);
    }
  }, [data]);

  const handleDeleteDraftById = async (id: string) => {
    setDrafts((prevDrafts: any) =>
      prevDrafts.filter((draft: any) => draft.id !== id)
    );
    try {
      await axios.delete(`/posts/delete/draftById/${id}`, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  const hadnleDeleteDraftByBulk = async () => {
    setDrafts([]);
    try {
      await axios.delete(`/posts/delete/draftBulk`, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar />
      <div className="w-screen lg:px-24 pb-8 text-white">
        <div className="px-8 py-8  flex flex-col  border-[#ffffff3f] shadow-sm items-start gap-8 max-w-[60rem]">
          <p className="text-2xl italic">
            You're just a few steps away from {""}
            <span className="text-sky-400 font-semibold">
              getting noticed !
            </span>
          </p>
          {isLoading && (
            <>
              <div className="w-full grid place-content-center grid-cols-1 md:grid-cols-2 gap-8 mt-4 md:gap-14">
                {Array.from({ length: 6 }, (_, index) => (
                  <DraftCardSkeleton key={index} />
                ))}
              </div>
            </>
          )}
          {isError && <p>{error.message}</p>}
          {drafts && drafts.length === 0 && (
            <div>
              <p className="text-base">
                You have not drafted any post yet.{" "}
                <Link
                  to={"/post/handle"}
                  className="underline underline-offset-2 text-sky-500"
                >
                  Start drafting now!
                </Link>
              </p>
            </div>
          )}

          {drafts && drafts.length > 0 && (
            <>
              <div className="flex justify-end items-center w-full">
                <button
                  onClick={hadnleDeleteDraftByBulk}
                  className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-red-700"
                >
                  <p>Clear All</p>
                  <TrashIcon size={18} />
                </button>
              </div>
              <div className="w-full grid place-content-center grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
                {drafts.map((post: any) => (
                  <DraftCard
                    key={post.id}
                    title={post.title}
                    date={post.updatedAt}
                    id={post.id}
                    authorId={post.authorId}
                    onDelete={handleDeleteDraftById}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const DraftCard = ({
  title,
  date,
  id,
  authorId,
  onDelete,
}: {
  title: string;
  date: string;
  id: string;
  authorId: string;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="cursor-pointer max-w-[28rem] back w-full p-6 border-2 rounded-lg  bg-gray-800 border-gray-700 hover:border-gray-600">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-white w-full ">
        {title
          ? title.length > 30
            ? `${title.slice(0, 30)}...`
            : title
          : "Untitled"}
      </h5>

      <p className="mb-3 font-normal text-gray-400">
        <ReactTimeAgo
          date={new Date(date)}
          locale="en-US"
          timeStyle={"round-minute"}
          updateInterval={1000}
        />
      </p>

      <div className=" flex items-center justify-between mt-5">
        <Link
          to={"/post/handle"}
          state={{
            postId: id,
            authorId,
            statusType: statusType.DRAFT,
          }}
          className="inline-flex items-center  ml-[-3px] px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          <p>Edit Now</p>
          <RightArrow />
        </Link>
        <button
          onClick={() => onDelete(id)}
          className="inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-red-700"
        >
          <p>Delete</p>
          <TrashIcon size={18} />
        </button>
      </div>
    </div>
  );
};
