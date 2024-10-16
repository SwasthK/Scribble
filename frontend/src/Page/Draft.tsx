import { useEffect } from "react";
import { AppBar } from "../components/AppBar/AppBar";
import { useGetDraftedPost } from "../services/queries";
import ReactTimeAgo from "react-time-ago";
import { Link } from "react-router-dom";
import { RightArrow } from "../assets/svg/RightArrow";
import { TrashIcon } from "./TrashIcon";

export const Draft = () => {
  const postsQuery = useGetDraftedPost();
  const title = "  Noteworthy technology acquisitions 2021 acquisitions";
  const title1: string | undefined = "";

  return (
    <>
      <AppBar />
      <div className="w-screen lg:px-24 pb-8 text-white">
        <div className="px-8 py-8  flex flex-col  border-[#ffffff3f] shadow-sm items-start gap-8 max-w-[60rem]">
          <p className="text-2xl italic">
            You're just a few steps away from{" "}
            <span className="text-sky-400 font-semibold">
              {" "}
              getting noticed !
            </span>
          </p>
          <div className="w-full grid place-content-center grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="cursor-pointer max-w-[28rem] w-full p-6 border-2 rounded-lg shadow bg-gray-800 border-gray-700 hover:border-gray-600">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-white w-full ">
                {title
                  ? title.length > 30
                    ? `${title.slice(0, 30)}...`
                    : title
                  : "No Title"}
              </h5>

              <p className="mb-3 font-normal text-gray-400">
                <ReactTimeAgo
                  date={new Date()}
                  locale="en-US"
                  timeStyle={"round-minute"}
                  updateInterval={1000}
                />
              </p>

              <div className=" flex items-center justify-between mt-5">
                <Link
                  to={""}
                  className="inline-flex items-center  ml-[-3px] px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                >
                  <p>Edit Now</p>
                  <RightArrow />
                </Link>
                <Link
                  to={""}
                  className="inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-red-700"
                >
                  <p>Delete</p>
                  <TrashIcon size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
