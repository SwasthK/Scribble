import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useGetDraftedPost } from "../../services/queries";

import { DraftCardSkeleton } from "../../Skeleton/DraftCard_Skeleton";

import { TrashIcon } from "../../assets/svg/TrashIcon";
import { RefreshIcon } from "../../assets/svg/RefreshIcon";

const DraftCard = lazy(() => import("./draftcard"));

const Draft = () => {
  const [drafts, setDrafts] = useState([]);
  const postsQuery = useGetDraftedPost();
  const { data, isFetching, isError, error, refetch } = postsQuery;

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

  const handleDeleteDraftByBulk = async () => {
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
      <div className="w-screen lg:px-24 pb-8 text-white">
        <div className="px-8 py-8  flex flex-col  border-[#ffffff3f] shadow-sm items-start gap-8 max-w-[60rem]">
          <p className="text-base sm:text-lg bg-cgray-100 border border-b-dark-200 px-4 rounded-md">
            You're just a few step away from {""}
            <span className="text-sky-400 font-semibold">
              getting noticed !
            </span>
          </p>
          {isFetching && (
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
                You have not drafted any post yet .{" "}
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
              <div className="flex justify-end items-center w-full gap-14">
                <button
                  onClick={handleDeleteDraftByBulk}
                  className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-red-700"
                >
                  <p>Clear All</p>
                  <TrashIcon size={18} />
                </button>
                <RefreshIcon onClick={() => refetch()} size={16} />
              </div>

              <div className="w-full grid place-content-center grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
                <Suspense fallback={<></>}>
                  <DraftCard drafts={drafts} onDelete={handleDeleteDraftById} />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Draft;
