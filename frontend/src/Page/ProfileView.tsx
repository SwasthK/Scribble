import { Link, useParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AppBar } from "../components/AppBar/AppBar";
import { ScrollArea } from "../components/ui/scroll-area";
import { GitHubIcon } from "../assets/svg/GitHubIcon";
import { InstagramIcon } from "../assets/svg/InstagramIcon";
import { TwitterIcon } from "../assets/svg/TwitterIcon";
import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import {
  Profile_View_About_Skeleton,
  Profile_View_Posts_Skeleton,
} from "../Skeleton/Profile_View_Skeleton";
import { useGetUserProfileDetailsAndPostsDetails } from "../services/queries";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { RefreshIcon } from "../assets/svg/RefreshIcon";

export const ProfileView = () => {
  const { username } = useParams<{ username: string }>();

  const { data, refetch, isLoading, error, isError, isRefetching } =
    useGetUserProfileDetailsAndPostsDetails(username || "");

  return (
    <>
      <AppBar></AppBar>
      <div className="flex justify-center  py-20  items-center">
        <Tabs
          defaultValue="profile"
          className="w-[400px] sm:w-[600px] lg:w-[600px] max-h-[500px] h-[500px] border-[3px] border-[#596a9535] p-2 bg-[#212020] rounded-xl overflow-y-scroll"
        >
          <TabsList className=" w-full gap-2">
            <TabsTrigger value="profile" className="w-full ">
              Profile
            </TabsTrigger>
            <TabsTrigger value="blogs" className="w-full ">
              Blogs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="rounded-xl">
            {isLoading || isRefetching ? (
              <Profile_View_About_Skeleton />
            ) : isError ? (
              <ErrorComponent label={error.message} />
            ) : (
              <ScrollArea className="w-full rounded-md  p-4 py-0 h-[430px]">
                <div className=" py-3 flex items-center gap-6 relative">
                  <Avatar>
                    <AvatarImage src={data?.userProfileDetails.avatarUrl} />
                    <AvatarFallback>
                      {data?.userProfileDetails.username.slice(0, 3)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-semibold text-2xl mb-1">
                      {data?.userProfileDetails.username}
                    </h1>
                    <h6 className="text-sm text-gray-400 font-semibold">
                      {data?.userProfileDetails.email}
                    </h6>
                  </div>
                </div>
                <RefreshIcon
                  className="absolute right-5 top-5"
                  size={16}
                  onClick={() => refetch()}
                ></RefreshIcon>

                <div className="py-0 flex flex-col gap-3 max-w-[400px]">
                  <span className="text-[0.800rem] pl-2 text-gray-400 font-semibold">
                    About
                  </span>

                  <h1 className="input-style">
                    {data?.userProfileDetails.bio}
                  </h1>
                </div>
                <div className="py-2 flex flex-col gap-3  max-w-[400px]">
                  <span className="text-[0.800rem] pl-2 text-gray-400 font-semibold">
                    Socials
                  </span>
                  <div className="flex justify-evenly input-style">
                    {data?.userProfileDetails.socials.length === 0
                      ? "No Socials Found"
                      : data?.userProfileDetails.socials.map((social: any) => (
                          <>
                            {social.platform === "github" ? (
                              <GitHubIcon url={social.url} target={"_blank"} />
                            ) : social.platform === "instagram" ? (
                              <InstagramIcon
                                url={social.url}
                                target={"_blank"}
                              />
                            ) : social.platform === "twitter" ? (
                              <TwitterIcon url={social.url} target={"_blank"} />
                            ) : null}
                          </>
                        ))}
                  </div>
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="blogs">
            {isLoading || isRefetching ? (
              <Profile_View_Posts_Skeleton />
            ) : isError ? (
              <ErrorComponent label={error.message} />
            ) : data?.userPostDetails.length === 0 ? (
              <ErrorComponent label={"No Blogs Found"} />
            ) : (
              <ScrollArea className="h-[430px] w-full rounded-md  p-4 py-0 ">
                <h1 className="font-semibold text-2xl mb-1 py-3">
                  {data?.userPostDetails.length}
                  {data?.userPostDetails.length === 1 ? " Post" : " Posts"}
                </h1>
                <RefreshIcon
                  className="absolute right-5 top-5"
                  size={16}
                  onClick={() => refetch()}
                ></RefreshIcon>

                <div className="flex items-center gap-2">
                  <h1 className="h-1 w-1 bg-green-500 rounded-full"></h1>
                  <h1 className="text-sm text-green-500 opacity-90  font-semibold">
                    <ActiveSince date={data?.userProfileDetails.createdAt} />
                  </h1>
                </div>

                <div className="py-2 flex flex-col gap-4 max-w-[500px] ">
                  <span className="text-[0.800rem] pl-2 text-gray-400 font-semibold">
                    Posts
                  </span>
                </div>
                <div className="w-full flex  gap-4 flex-col">
                  {data?.userPostDetails.map((post: any) => (
                    <PostCards
                      key={post.slug}
                      coverImage={post.coverImage}
                      slug={post.slug}
                      title={post.title}
                      createdAt={post.updatedAt}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const PostCards = memo(
  ({
    slug,
    coverImage,
    title,
    createdAt,
  }: {
    slug: string;
    title: string;
    coverImage: string;
    createdAt: string;
  }) => {
    return (
      <Link
        to={`/blog/${slug}`}
        className="flex gap-4 sm:h-20 overflow-hidden py-1 "
      >
        <img
          src={coverImage}
          alt=""
          className="h-full rounded-md w-36 object-center object-cover  hidden sm:block"
        />
        <div className="flex input-style border  flex-col gap-1 w-full overflow-hidden">
          <h1 className="">
            {title.length > 30 ? `${title.slice(0, 30)}...` : title}
          </h1>
          <h6 className="text-[0.800rem] text-gray-400 font-semibold">
            <ReactTimeAgo
              date={new Date(createdAt)}
              locale="en-US"
              timeStyle={"round-minute"}
              updateInterval={1000}
            />
          </h6>
        </div>
      </Link>
    );
  }
);

const ErrorComponent = memo(({ label }: { label: string }) => {
  return (
    <div className="w-full h-[430px] flex justify-center items-center">
      <h1 className="px-16 py-2 rounded-md bg-error font-semibold">{label}</h1>
    </div>
  );
});

const ActiveSince = memo(({ date }: { date: any }) => {
  TimeAgo.addDefaultLocale(en);

  const timeAgo = new TimeAgo("en-US");

  const formattedTime = timeAgo
    .format(new Date(date), "round-minute")
    .replace(" ago", "");

  return `Active since ${formattedTime}`;
});
