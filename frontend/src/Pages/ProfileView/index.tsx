import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

import {
  Profile_View_About_Skeleton,
  Profile_View_Posts_Skeleton,
} from "./skeleton";

import { useGetUserProfileDetailsAndPostsDetails } from "../../services/queries";

const TabContentProfile = lazy(() => import("./tabcontentprofile"));
const TabContentBlogs = lazy(() => import("./tabcontentblogs"));
// import TabContentBlogs from "./tabcontentblogs";

const ProfileView = () => {
  const { username } = useParams<{ username: string }>();

  const { data, refetch, isLoading, error, isError, isRefetching } =
    useGetUserProfileDetailsAndPostsDetails(username || "");

  return (
    <>
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

          <Suspense fallback={<Profile_View_About_Skeleton />}>
            <TabContentProfile
              isLoading={isLoading}
              data={data}
              refetch={refetch}
              errorMessage={error?.message}
              skeleton={<Profile_View_About_Skeleton />}
              isError={isError}
              isRefetching={isRefetching}
            />
          </Suspense>

          <Suspense fallback={<Profile_View_Posts_Skeleton />}>
            <TabContentBlogs
              isLoading={isLoading}
              data={data}
              refetch={refetch}
              errorMessage={error?.message}
              skeleton={<Profile_View_Posts_Skeleton />}
              isError={isError}
              isRefetching={isRefetching}
            />
          </Suspense>
        </Tabs>
      </div>
    </>
  );
};

export default ProfileView;
