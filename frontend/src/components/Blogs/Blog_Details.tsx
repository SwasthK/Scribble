import { useEffect, useMemo, useState } from "react";
import { UseFormatDate } from "../../Hooks/Blogs/Format_Date";
import { useInView } from "react-intersection-observer";
import { useGetPostByAuthorId } from "../../services/queries";
import { Blog_Recommendation_Skeleton } from "../../Skeleton/Blog_Recommendation_Skeleton";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { EditIcon } from "../../assets/svg/EditIcon";
import { statusType } from "../../Types/type";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { BookMarkIcon } from "../../assets/svg/BookMarkIcon";
import axios from "axios";
import { debounce } from "../../utils/debounce";
import { LikeIcon } from "../../assets/svg/LikeIcon";
import toast from "react-hot-toast";
import { InstagramIcon } from "../../assets/svg/InstagramIcon";
import { TwitterIcon } from "../../assets/svg/TwitterIcon";
import { GitHubIcon } from "../../assets/svg/GitHubIcon";
import { followAtom } from "../../atoms/followAtom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";

import { Check, ChevronsUpDown, SendIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Textarea } from "../ui/textarea";
import { ThreeDotsIcon } from "../../assets/svg/ThreeDotsIcon";
import { Comment_Skeleton } from "../../Skeleton/Comment_Skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const reportCategories = [
  {
    value: "SPAM",
    label: "Spam",
  },
  {
    value: "INAPPROPRIATE",
    label: "Inappropriate",
  },
  {
    value: "HARASSMENT",
    label: "Harassment",
  },
  {
    value: "MISINFORMATION",
    label: "Misinformation",
  },
  {
    value: "COPYRIGHT_VIOLATION",
    label: "Copyright violation",
  },
  {
    value: "HATE_SPEECH",
    label: "Hate speech",
  },
  {
    value: "VIOLENCE",
    label: "Violence",
  },
  {
    value: "SELF_HARM",
    label: "Self harm",
  },
  {
    value: "ILLEGAL_ACTIVITY",
    label: "Illegal activity",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

export const Blog_Details = ({ blogContent }: { blogContent: any }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const {
    id,
    title,
    slug,
    shortCaption,
    coverImage,
    createdAt,
    author,
    authorId,
    body,
    summary,
    allowComments,
    _count: count,
    likes,
    savedBy,
  } = blogContent;

  const {
    refetch: fetchUserPosts,
    data,
    isLoading,
  } = useGetPostByAuthorId(blogContent.authorId || "", slug);

  const { formattedDate } = UseFormatDate(createdAt);

  const [comments, setComments] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const commentsPerPage = 3;
  const [currentComments, setCurrentComments] = useState<any[]>([]);

  useEffect(() => {
    setCurrentComments(
      comments.slice(startIndex, startIndex + commentsPerPage)
    );
  }, [comments, startIndex]);

  const [sorting, setSorting] = useState("newest");

  const sortedComments = useMemo(() => {
    return comments.slice().sort((a, b) => {
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

  const fetchCommnets = async () => {
    try {
      const response = await axios.get(`comment/getNoReply/${id}`, {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setComments(response.data.data.comments);
    } catch (error: any) {
      toast.error(error.response?.data.message || "Something went wrong");
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchUserPosts(), fetchCommnets()]);
  };

  useEffect(() => {
    if (inView && currentUserId !== authorId) {
      fetchData();
    }
  }, [inView]);

  const [loadImage, setLoadImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [saved, setSaved] = useState(savedBy.length > 0 ? true : false);

  const {
    user: { id: currentUserId, avatarUrl: currentUserAvatarUrl },
  } = useRecoilValue(authAtom);

  const location = useLocation();
  const { state } = location;

  const editor = useCreateBlockNote({
    initialContent: state?.body || "",
  });

  useEffect(() => {
    const genrateEditorData = async () => {
      const blocks = await editor.tryParseHTMLToBlocks(body || "");
      editor.replaceBlocks(editor.document, blocks);
    };
    genrateEditorData();
  }, [blogContent]);

  const handleSavePost = async () => {
    let prevSaveState: boolean = saved;
    setSaved(!saved);

    await axios.post(
      `/posts/save/${id}`,
      {
        action: !prevSaveState ? "save" : "unsave",
      },
      {
        headers: {
          accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  };

  const debounceSavePost = debounce(handleSavePost, 500);

  const [likeState, setLikeState] = useState({
    count: count.likes,
    isLiked: likes.length > 0,
    load: false,
  });

  const handleLikeCount = async () => {
    if (likeState.load) {
      return;
    }

    const updatedLikeStatus = !likeState.isLiked;
    setLikeState((prev) => ({
      count: updatedLikeStatus ? prev.count + 1 : prev.count - 1,
      isLiked: updatedLikeStatus,
      load: true,
    }));

    try {
      await axios.post(
        `/post/like/${id}`,
        {},
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error: any) {
      setLikeState((prev) => ({
        ...prev,
        count: updatedLikeStatus ? prev.count - 1 : prev.count + 1,
        isLiked: !updatedLikeStatus,
      }));
      toast.error(error.response?.data.message || "Something went wrong");
    } finally {
      setLikeState((prev) => ({
        ...prev,
        load: false,
      }));
    }
  };

  const [followingAtom, setFollowAtom] = useRecoilState(followAtom);
  const isFollowing = followingAtom.following.includes(authorId);

  const handleFollowRequest = async () => {
    let prevFollowState = isFollowing;
    let optimisticState: string[];

    setFollowAtom((prev) => {
      optimisticState = prev.following;
      if (isFollowing) {
        return {
          ...prev,
          following: prev.following.filter((item) => item !== authorId),
        };
      } else {
        return {
          ...prev,
          following: [...prev.following, authorId],
        };
      }
    });

    try {
      if (prevFollowState) {
        await axios.delete(`/user/profile/${authorId}/unfollow`, {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
      } else {
        await axios.post(
          `/user/profile/${authorId}/follow`,
          {},
          {
            headers: {
              accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }
    } catch (error: any) {
      setFollowAtom((prev) => ({
        ...prev,
        following: optimisticState,
      }));
    }
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReportPost = async () => {
    if (!value) {
      toast.error("Please select a reason type");
      return;
    }
    if (!message) {
      toast.error("Please add a detailed reason");
      return;
    }
    try {
      toast.success("Post reported successfully");
      setDialogOpen(false);
      setMessage("");
      setValue("");
      await axios.post(
        `/post/report/${id}`,
        {
          type: value,
          reason: message,
        },
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error: any) {
      return;
    }
  };

  const [commentContent, setCommentContent] = useState("");
  const [sendComment, setSendComment] = useState(false);

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
          postId: id,
          content: commentContent,
        },
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setComments((prev) => [response.data.data.comment[0], ...prev]);
      setCommentContent("");
    } catch (error: any) {
      toast.error(error.response?.data.message || "Something went wrong");
    } finally {
      setSendComment(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center px-8  pt-8  sm:px-16">
        <div className="w-full flex flex-col gap-8 max-w-[700px]">
          <div className="min-h-96 max-w-3/4 ">
            <h1
              style={{ wordBreak: "break-word", lineHeight: "1.3" }}
              className="text-5xl sm:text-4xl md:text-5xl font-bold"
            >
              {title}
            </h1>
            <p
              className="pt-4 text-lg lg:text-xl"
              style={{ wordBreak: "break-word", lineHeight: "1.9" }}
            >
              {shortCaption}
            </p>
            <div
              className={`flex items-center gap-4 py-4 justify-between pr-8  ${
                currentUserId === authorId && ""
              } `}
            >
              <div className="flex gap-4 items-center justify-center">
                {/* <Avatar size={10} url={} /> */}
                <Avatar>
                  <AvatarImage src={author.avatarUrl} />
                  <AvatarFallback>{author.username.slice(0, 3)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="justify-between flex items-center mb-1">
                    <Link to={`/view/profile/${author.username}`}>
                      {author.username}
                    </Link>

                    {currentUserId !== authorId && (
                      <button
                        onClick={handleFollowRequest}
                        className={`${
                          isFollowing ? " bg-[#162C35]" : "bg-[#0D82DF]"
                        }  text-white font-semibold px-2 rounded-md text-sm py-[0.10rem]`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                  <p>4 min read · {formattedDate}</p>
                </div>
              </div>
              {currentUserId === authorId ? (
                <Link
                  to={"/post/handle"}
                  state={{
                    postId: id,
                    authorId,
                    statusType: statusType.PUBLISHED,
                  }}
                  className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg "
                >
                  <EditIcon size={20} />
                  <p className="italic font-semibold">Edit</p>
                </Link>
              ) : (
                <>
                  <div className="flex gap-8 items-center">
                    <div className="flex items-center gap-3">
                      <LikeIcon
                        size={likeState.isLiked ? 26 : 24}
                        onClick={handleLikeCount}
                        fill={likeState.isLiked ? "red" : "none"}
                        stroke={likeState.isLiked ? "" : "white"}
                        strokeWidth={likeState.isLiked ? "" : "2"}
                      />
                      {likeState.count > 4 && <p>{likeState.count}</p>}
                    </div>
                    <BookMarkIcon
                      onClick={debounceSavePost}
                      fill={saved ? "white" : "none"}
                    ></BookMarkIcon>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger>
                        <ThreeDotsIcon size={18} />
                      </DialogTrigger>
                      <DialogContent className="bg-cdark-300 border border-alphaborder">
                        <DialogHeader>
                          <DialogTitle>Report Unappropriate Post</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. Make sure that you
                            have a valid reason before reporting someone's post.
                          </DialogDescription>
                        </DialogHeader>
                        <p className="text-sm font-semibold">Reason type</p>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between bg-cdark-300 border border-alphaborder"
                            >
                              {value
                                ? reportCategories.find(
                                    (category) => category.value === value
                                  )?.label
                                : "Select Reason..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command className="bg-cdark-300 text-white border border-alphaborder">
                              <CommandInput placeholder="Search Reasons..." />
                              <CommandList>
                                <CommandEmpty>No Results found.</CommandEmpty>
                                <CommandGroup>
                                  {reportCategories.map((category) => (
                                    <CommandItem
                                      key={category.value}
                                      value={category.value}
                                      onSelect={(currentValue) => {
                                        setValue(
                                          currentValue === value
                                            ? ""
                                            : currentValue
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          value === category.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {category.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <div className="grid w-full gap-3.5 py-1.5">
                          <p className="text-sm font-semibold">
                            Detailed Reason
                          </p>
                          <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="py-2 border border-alphaborder"
                            style={{ maxHeight: "100px", resize: "vertical" }}
                            placeholder="Type your message here."
                            id="message"
                          />
                        </div>
                        <Button
                          onClick={handleReportPost}
                          variant="secondary"
                          aria-expanded={open}
                          className="text-black font-semibold"
                        >
                          Report
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
            </div>

            <div className="py-6 pb-3 pt-4">
              {!loadImage && !imageError && (
                <div className="animate-pulse aspect-video bg-gray-200 rounded-xl"></div>
              )}
              {imageError ? (
                <div className="aspect-video bg-gray-800 rounded-xl flex justify-center items-center">
                  <h1 className="text-white font-semibold text-lg">
                    Failed to load the image...!
                  </h1>
                </div>
              ) : (
                <img
                  src={coverImage}
                  alt=""
                  className="aspect-video rounded-xl object-cover"
                  onLoad={() => setLoadImage(true)}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center items-center px-8  pt-8 pb-2 sm:pb-16 sm:px-16"> */}
      <div className="flex justify-center items-center">
        <div className="w-full flex flex-col gap-8 max-w-[800px]">
          <BlockNoteView
            editor={editor}
            editable={false}
            data-theming-css-variables-demo-display-blog
            data-theming-editor
            formattingToolbar={true}
          />
        </div>
      </div>

      <div
        className="flex justify-center items-center px-8 pb-16 sm:px-16 mt-[-3rem]"
        ref={ref}
      >
        <div className="w-full flex flex-col gap-8 max-w-[700px]">
          {summary && (
            <div className="z-10 flex flex-col gap-4">
              <h1 className="italic font-semibold">Summary</h1>
              <div className="bg-[#7663630e] p-6 text-lg">
                <h1 className="text-white">{summary}</h1>
              </div>
            </div>
          )}
          {isLoading ? (
            <Comment_Skeleton />
          ) : (
            <div className="py-3">
              <h1 className="text-base font-semibold mb-4">Comments</h1>
              {allowComments === false ? (
                <p className="text-sm text-gray-400 text-center">
                  Comments are disabled for this post
                </p>
              ) : (
                <>
                  {currentComments.length === 0 && !isLoading ? (
                    <p className="text-sm text-gray-400 text-center">
                      No comments available
                    </p>
                  ) : (
                    <>
                      <div className="mb-4">
                        <select
                          value={sorting}
                          onChange={(e) => setSorting(e.target.value)}
                          className="px-2 py-1 rounded-md text-sm font-semibold cursor-pointer"
                        >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                        </select>
                      </div>
                      <div className="space-y-7 pl-6">
                        {currentComments.map((comment, index) => (
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
                          disabled={
                            startIndex + commentsPerPage >= comments.length
                          }
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
                </Avatar>
                <Textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={sendComment || !allowComments ? true : false}
                  placeholder="Write a comment..."
                  className="py-2 border border-white font-semibold input-style"
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

          <div className="flex flex-col gap-7">
            {currentUserId !== authorId ? (
              <>
                <div className="z-10">
                  <img
                    src={author.avatarUrl}
                    alt=""
                    className="sm:h-16 sm:w-16 w-10 h-10 rounded-full border-none"
                  />
                </div>
                <div>
                  <h1 className="sm:text-2xl font-semibold text-xl">
                    Written by {author.username}
                  </h1>
                  <p className="py-2">53K Followers</p>
                </div>
                <div className="flex items-center gap-5">
                  <GitHubIcon size={20} />
                  <TwitterIcon size={17} />
                  <InstagramIcon size={20} />
                </div>
              </>
            ) : (
              <>
                <div className="author-section z-10">
                  <Link
                    state={{ profile: false }}
                    to={`/profile/@${author.username}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    <p>{`More posts from you - @ ${author.username}`}</p>
                  </Link>
                  <blockquote className="text-sm italic text-gray-600 mb-2">
                    "Writing is the painting of the voice." – Voltaire
                  </blockquote>
                </div>
              </>
            )}
          </div>

          {currentUserId !== authorId ? (
            <>
              {isLoading && <Blog_Recommendation_Skeleton />}
              {data?.length > 0 && (
                <>
                  <h1 className="text-lg font-semibold">
                    More from {author.username}
                  </h1>
                  <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                    {data.map((item: any, index: number) => (
                      <Blog_Recommendation
                        key={index}
                        slug={item.slug}
                        title={item.title}
                        shortCaption={item.shortCaption}
                        coverImage={item.coverImage}
                        author={author}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* <p
              className="pt-6 text-lg lg:text-xl"
              style={{ wordBreak: "break-word", lineHeight: "1.9" }}
            >
              {body}
            </p> */}

      {/* <div className="flex mt-4 gap-4">
              {tag
                ? tag.map((tag: string) => (
                    <div
                      key={tag}
                      className="px-4 py-1 font-semibold border rounded-full text-center bg-gray-300"
                    >
                      {tag}
                    </div>
                  ))
                : null}
            </div> */}
      {/* </div>
         
         
        </div>
      </div> */}
    </>
  );
};

export const Blog_Recommendation = ({
  title,
  coverImage,
  shortCaption,
  author,
  slug,
}: {
  title: string;
  coverImage: string;
  shortCaption: string;
  slug: string;
  author: {
    avatarUrl: string;
    username: string;
  };
}) => {
  return (
    <>
      <Link to={`/blog/${slug}`} className="flex flex-col gap-6">
        <div className="">
          <img
            src={coverImage}
            alt=""
            className="aspect-video rounded-lg object-cover object-center"
          />
        </div>
        <div className="flex flex-col ">
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src={author.avatarUrl} />
              <AvatarFallback>{author.username.slice(0, 3)}</AvatarFallback>
            </Avatar>
            <p>{author.username}</p>
          </div>
          <p className="text-xl font-bold mt-5 mb-2">{title}</p>
          <p>{shortCaption}</p>
        </div>
      </Link>
    </>
  );
};
