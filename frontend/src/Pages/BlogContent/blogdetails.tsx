import { lazy, memo, Suspense, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import toast from "react-hot-toast";

import { useGetPostByAuthorId } from "../../services/queries";
import { UseFormatDate } from "../../Hooks/Blogs/Format_Date";
import { statusType } from "../../Types/type";
import { minCaluclate } from "../../utils/minCaluclate";
import { debounce } from "../../utils/debounce";

import { useRecoilState, useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { followAtom } from "../../atoms/followAtom";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

import { EditIcon } from "../../assets/svg/EditIcon";
import { BookMarkIcon } from "../../assets/svg/BookMarkIcon";
import { LikeIcon } from "../../assets/svg/LikeIcon";

const ReportPost = lazy(() => import("../../Pages/BlogContent/reportpost"));
const Comment = lazy(() => import("../../Pages/BlogContent/comment"));
const AuthorSection = lazy(
  () => import("../../Pages/BlogContent/authorsection")
);
const Blog_Recommendation = lazy(
  () => import("../../Pages/BlogContent/blogrecommendation")
);

export const Blog_Details = memo(({ blogContent }: { blogContent: any }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const [comments, setComments] = useState<any[]>([]);

  const commentsPerPage = 3;


  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  const { state } = location;
  const editor = useCreateBlockNote({ initialContent: state?.body || "" });

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

  const { formattedDate } = UseFormatDate(createdAt);
  const [saved, setSaved] = useState(savedBy.length > 0 ? true : false);
  const [likeState, setLikeState] = useState({
    count: count.likes,
    isLiked: likes.length > 0,
    load: false,
  });

  const {
    refetch: fetchUserPosts,
    data,
    isLoading,
  } = useGetPostByAuthorId(blogContent.authorId || "", slug);

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

  const {
    user: {
      id: currentUserId,
      avatarUrl: currentUserAvatarUrl,
      username: currentUserUsername,
    },
  } = useRecoilValue(authAtom);

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

  return (
    <>
      <div className="flex justify-center items-center px-8  pt-8  sm:px-16 font-scribble2">
        <div className="w-full flex flex-col gap-8 max-w-[700px]">
          <div className="min-h-96 max-w-3/4 ">
            <h1
              style={{ wordBreak: "break-word", lineHeight: "1.3" }}
              className="text-4xl md:text-5xl font-semibold tracking-wide"
            >
              {title}
            </h1>
            <p
              className="pt-2 text-base md:text-lg  font-giest text-giest-100 "
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
                <Avatar>
                  <AvatarImage src={author.avatarUrl} />
                  <AvatarFallback>
                    <h1>{author.username.slice(0, 3)}</h1>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="justify-between flex items-center mb-1 ">
                    <Link to={`/view/profile/${author.username}`}>
                      {author.username}
                    </Link>

                    {currentUserId !== authorId && (
                      <button
                        onClick={handleFollowRequest}
                        className={`${
                          isFollowing ? " bg-[#162C35]" : "bg-[#0D82DF]"
                        }  text-white font-semibold px-2 rounded-md text-sm py-[0.10rem] font-giest`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                  <p className="font-giest font text-giest-100 text-sm">
                    {minCaluclate(title)} min read · {formattedDate}
                  </p>
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

                    <Suspense fallback={<></>}>
                      <ReportPost postId={id} />
                    </Suspense>
                  </div>
                </>
              )}
            </div>

            <div className="py-6 pb-3 pt-4">
              {imageError ? (
                <div className="aspect-video bg-cdark-100 rounded-xl flex justify-center items-center">
                  <h1 className="text-white font-semibold text-lg">
                    Failed to load an image !
                  </h1>
                </div>
              ) : (
                <img
                  loading="lazy"
                  src={coverImage}
                  alt=""
                  className="aspect-video rounded-xl object-cover "
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

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
            <div className="z-10 flex flex-col gap-4 font-giest">
              <h1 className="text-base font-semibold">Summary</h1>
              <div className="bg-[#7663630e] p-6 text-sm md:text-base italic">
                <h1 className="  text-giest-100">{summary}</h1>
              </div>
            </div>
          )}

          <Suspense fallback={<></>}>
            <Comment
              postId={id}
              isLoading={isLoading}
              comments={comments}
              setComments={setComments}
              currentUserAvatarUrl={currentUserAvatarUrl}
              currentUserUsername={currentUserUsername}
              commentsPerPage={commentsPerPage}
              allowComments={allowComments}
            />
          </Suspense>

          <Suspense fallback={<></>}>
            <AuthorSection
              author={author}
              currentUserId={currentUserId}
              authorId={authorId}
            />
          </Suspense>

          <Suspense fallback={<></>}>
            <Blog_Recommendation
              authorName={author.username}
              authorAvatarurl={author.avatarUrl}
              authorId={authorId}
              currentUserId={currentUserId}
              data={data}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
});
