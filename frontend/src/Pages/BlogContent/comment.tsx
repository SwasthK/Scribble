import { SendIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Textarea } from "../../components/ui/textarea";
import { Comment_Skeleton } from "./skeleton";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const Comment = ({
  postId,
  isLoading,
  allowComments,
  setComments,
  commentsPerPage,
  comments,
  currentUserAvatarUrl,
  currentUserUsername,
}: {
  postId: string;
  isLoading: any;
  setComments: any;
  allowComments: any;

  commentsPerPage: any;
  comments: any;
  currentUserAvatarUrl: any;
  currentUserUsername: any;
}) => {
  const [sendComment, setSendComment] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [currentComments, setCurrentComments] = useState<any[]>([]);
  const [sorting, setSorting] = useState("newest");

  const handleNext = () => {
    if (startIndex + commentsPerPage < comments.length) {
      setStartIndex(startIndex + commentsPerPage);
    }
  };

  const handlePrevious = () => {
    if (startIndex - commentsPerPage >= 0) {
      setStartIndex(startIndex - commentsPerPage);
    }
  };

  useEffect(() => {
    setCurrentComments(
      comments.slice(startIndex, startIndex + commentsPerPage)
    );
  }, [comments, startIndex]);

  const sortedComments = useMemo(() => {
    return comments.slice().sort((a: any, b: any) => {
      if (sorting === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [comments, sorting]);

  useEffect(() => {
    setCurrentComments(
      sortedComments.slice(startIndex, startIndex + commentsPerPage)
    );
  }, [sortedComments, startIndex]);

  const handleSendComment = async () => {
    if (!commentContent || sendComment) {
      toast.error("Please write a comment");
      return;
    }
    try {
      setSendComment(true);
      const response = await axios.post(
        `/comment/add`,
        {
          postId,
          content: commentContent,
        },
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setComments((prev: any) => [response.data.data.comment[0], ...prev]);
      setCommentContent("");
    } catch (error: any) {
      toast.error(error.response?.data.message || "Something went wrong");
    } finally {
      setSendComment(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Comment_Skeleton />
      ) : (
        <div className="py-3 z-10">
          <h1 className="text-base font-semibold mb-4">Comments</h1>
          {allowComments === false ? (
            <p className="text-sm text-gray-400 text-center pb-4">
              Comments are disabled for this post
            </p>
          ) : (
            <>
              {currentComments.length === 0 && !isLoading ? (
                <p className="text-sm text-gray-400 text-center pb-4">
                  Be the first one to comment on this post
                </p>
              ) : (
                <>
                  <div className="mb-4">
                    <select
                      value={sorting}
                      onChange={(e) => setSorting(e.target.value)}
                      // className="px-2 py-1 rounded-md text-sm font-semibold cursor-pointer text-black bg-[#222630] focus:outline-none border-none"
                      className="px-2 py-1 border-2 rounded-md text-sm font-semibold cursor-pointer text-white bg-[#222630] hover:bg-[#2c3241]"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>
                  <div className="space-y-7 pl-6">
                    {currentComments.map((comment: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={comment.author.avatarUrl} />
                          <AvatarFallback>
                            {comment.author.username.slice(0, 3)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="border px-3.5 py-2.5 rounded-md border-alphaborder shadow-sm bg-gray-800">
                          <h4 className="font-semibold text-sm mb-1  text-blue-100">
                            {comment.author?.username || "Anonymous"}
                          </h4>
                          <p className="text-sm">
                            {comment.content || "No content available"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 items-center mt-4 w-full px-14 justify-evenly">
                    <button
                      onClick={handlePrevious}
                      className="px-4 border-2 py-1 rounded-md font-semibold bg-[#222630] disabled:cursor-not-allowed disabled:bg-gray-700 focus:border-[#596A95] border-[#2B3040]"
                      disabled={startIndex === 0}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-4 border-2 py-1 rounded-md font-semibold bg-[#222630] disabled:cursor-not-allowed disabled:bg-gray-700 focus:border-[#596A95] border-[#2B3040]"
                      disabled={startIndex + commentsPerPage >= comments.length}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex gap-4 items-center mt-4">
            <Avatar>
              <AvatarImage src={currentUserAvatarUrl} />
              <AvatarFallback>{currentUserUsername.slice(0, 3)}</AvatarFallback>
            </Avatar>

            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={sendComment || !allowComments ? true : false}
              placeholder="Write a comment..."
              className="py-2 border border-white font-bold input-style"
              style={{ resize: "vertical", maxHeight: "100px" }}
            />
            {allowComments && (
              <SendIcon
                onClick={handleSendComment}
                className={`${
                  sendComment
                    ? "pointer-events-none stroke-gray-400 cursor-not-allowed"
                    : "pointer-events-auto stroke-white hover:stroke-gray-300 cursor-pointer"
                } transition-colors duration-300`}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
