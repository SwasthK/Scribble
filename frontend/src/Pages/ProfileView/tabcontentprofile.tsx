import { Fragment } from "react/jsx-runtime";
import { GitHubIcon } from "../../assets/svg/GitHubIcon";
import { InstagramIcon } from "../../assets/svg/InstagramIcon";
import { RefreshIcon } from "../../assets/svg/RefreshIcon";
import { TwitterIcon } from "../../assets/svg/TwitterIcon";
import ErrorBar from "../../components/Error";
import {
  AvatarFallback,
  AvatarImage,
  Avatar,
} from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import { TabsContent } from "../../components/ui/tabs";

const TabContentProfile = ({
  data,
  isLoading,
  errorMessage,
  isError,
  refetch,
  skeleton,
  isRefetching,
}: {
  data: any;
  isLoading: boolean;
  errorMessage: string | undefined;
  isError: boolean;
  refetch: any;
  skeleton: any;
  isRefetching: boolean;
}) => {
  return (
    <>
      <TabsContent value="profile" className="rounded-xl">
        {isLoading || isRefetching ? (
          skeleton
        ) : isError ? (
          <ErrorBar
            label={errorMessage}
            parentClass="w-full h-[430px] flex justify-center items-center"
            childClass="px-16 py-2 rounded-md bg-error font-semibold"
          />
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

              <h1
                className={`input-style ${
                  !data?.userProfileDetails.bio ? "text-center" : ""
                }`}
              >
                {data?.userProfileDetails.bio || (
                  <p className="text-giest-100 text-sm">Bio Not Added</p>
                )}
              </h1>
            </div>
            <div className="py-2 flex flex-col gap-3  max-w-[400px]">
              <span className="text-[0.800rem] pl-2 text-gray-400 font-semibold">
                Socials
              </span>
              <div className="flex justify-evenly input-style">
                {data?.userProfileDetails.socials.length === 0 ? (
                  <p className="text-giest-100 text-sm">No Socials Found</p>
                ) : (
                  data?.userProfileDetails.socials.map(
                    (social: any, index: number) => (
                      <Fragment key={index}>
                        {social.platform === "github" ? (
                          <GitHubIcon url={social.url} target={"_blank"} />
                        ) : social.platform === "instagram" ? (
                          <InstagramIcon url={social.url} target={"_blank"} />
                        ) : social.platform === "twitter" ? (
                          <TwitterIcon url={social.url} target={"_blank"} />
                        ) : null}
                      </Fragment>
                    )
                  )
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </TabsContent>
    </>
  );
};

export default TabContentProfile;
