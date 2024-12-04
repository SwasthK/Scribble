import { memo } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { statusType } from "../../Types/type";
import { TrashIcon } from "../../assets/svg/TrashIcon";
import { RightArrow } from "../../assets/svg/RightArrow";

const DraftCard = memo(
  ({
    drafts,

    onDelete,
  }: {
    drafts: any;

    onDelete: (id: string) => void;
  }) => {
    return (
      <>
        {drafts.map((post: any) => (
          <div
            key={post.id}
            className="cursor-pointer max-w-[28rem] back w-full p-6 border-2 rounded-lg  bg-gray-800 border-gray-700 hover:border-gray-600"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white w-full ">
              {post.title
                ? post.title.length > 30
                  ? `${post.title.slice(0, 30)}...`
                  : post.title
                : "Untitled"}
            </h5>

            <p className="mb-3 font-normal text-gray-400">
              <ReactTimeAgo
                date={new Date(post.updatedAt)}
                locale="en-US"
                timeStyle={"round-minute"}
                updateInterval={1000}
              />
            </p>

            <div className=" flex items-center justify-between mt-5">
              <Link
                to={"/post/handle"}
                state={{
                  postId: post.id,
                  authorId: post.authorId,
                  statusType: statusType.DRAFT,
                }}
                className="inline-flex items-center  ml-[-3px] px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
              >
                <p>Edit Now</p>
                <RightArrow />
              </Link>
              <button
                onClick={() => onDelete(post.id)}
                className="inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg  focus:ring-2 focus:outline-none bg-red-500 hover:bg-red-600 focus:ring-red-700"
              >
                <p>Delete</p>
                <TrashIcon size={18} />
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }
);

export default DraftCard;
