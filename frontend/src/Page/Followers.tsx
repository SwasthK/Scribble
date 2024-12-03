import { memo, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { FollowerCard_Skeleton } from "../Skeleton/FollowerCard_Skeleton";
import { useGetAllFollowers } from "../services/queries";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

enum pageSection {
  Followers = "Followers",
  Followings = "Followings",
}

const Followers = () => {
  const [activeSection, setActiveSection] = useState(pageSection.Followers);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const { data, isLoading, isError, error } = useGetAllFollowers();

  useEffect(() => {
    setFollowers(data?.followers.followers);
    setFollowings(data?.followings.followings);
  }, [data]);

  const [searchValue, setSearchValue] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("new");

  const filteredList = useMemo(() => {
    const list =
      activeSection === pageSection.Followers ? followers : followings;
    if (!list) return [];
    const filtered = list.filter((user: any) =>
      user.username.toLowerCase().includes(searchValue.toLowerCase())
    );

    return filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (filterCriteria === "new") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  }, [searchValue, activeSection, followers, followings, filterCriteria]);

  return (
    <>
      <div className="flex justify-center flex-col items-center gap-6 mt-10 py-4">
        <div className="flex gap-6">
          <h1
            onClick={() => setActiveSection(pageSection.Followers)}
            className={`${
              activeSection === pageSection.Followers
                ? ""
                : "text-giest-100 font-light"
            } text-md font-bold cursor-pointer`}
          >
            Followers
          </h1>
          <h1
            onClick={() => setActiveSection(pageSection.Followings)}
            className={`${
              activeSection === pageSection.Followings
                ? ""
                : "text-giest-100 font-light"
            } text-md font-bold cursor-pointer `}
          >
            Following
          </h1>
        </div>

        <div className="flex items-center gap-4 input-style h-9">
          <Search size={18}></Search>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            className="bg-transparent outline-none"
            placeholder="Seach username"
          ></input>
        </div>

        <div className="flex justify-center flex-col items-center gap-6 py-4 max-w-96 min-w-72">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <FollowerCard_Skeleton key={index} />
            ))
          ) : isError ? (
            <FollowersSearchBarErrors
              label={error?.message || "An error occurred."}
            />
          ) : (
            <>
              <div className="w-full flex gap-2 items-center">
                <label
                  htmlFor="sort-selector"
                  className="text-sm text-giest-100 font-medium"
                >
                  Sort by :
                </label>
                <select
                  id="sort-selector"
                  value={filterCriteria}
                  onChange={(e) => setFilterCriteria(e.target.value)}
                  className="input-style h-2"
                >
                  <option value="new">Newest First</option>
                  <option value="old">Oldest First</option>
                </select>
              </div>
              {activeSection === pageSection.Followers ? (
                <>
                  {followers?.length === 0 ? (
                    <FollowersSearchBarErrors label="No followers found." />
                  ) : (
                    <>
                      {filteredList.length === 0 ? (
                        <FollowersSearchBarErrors label="No results found." />
                      ) : (
                        <>
                          <div className="w-full">
                            <h1 className="text-sm font-semibold">
                              {followers?.length}{" "}
                              {followers?.length === 1
                                ? "Follower"
                                : "Followers"}
                            </h1>
                          </div>
                          {filteredList?.map((value: any, index: number) => (
                            <UserCards
                              username={value.username}
                              avatarUrl={value.avatarUrl}
                              key={index}
                            />
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {followings?.length === 0 ? (
                    <div className="px-10 rounded-md font-semibold">
                      <h1>No followings found.</h1>
                    </div>
                  ) : (
                    <>
                      {filteredList.length === 0 ? (
                        <FollowersSearchBarErrors label="No results found." />
                      ) : (
                        <>
                          <div className="w-full">
                            <h1 className="text-sm font-semibold">
                              {followings?.length}{" "}
                              {followings?.length === 1
                                ? "Following"
                                : "Followings"}
                            </h1>
                          </div>
                          {filteredList?.map((value: any, index: number) => (
                            <UserCards
                              username={value.username}
                              avatarUrl={value.avatarUrl}
                              key={index}
                            />
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Followers;

const UserCards = memo(
  ({ username, avatarUrl }: { username: string; avatarUrl: string }) => {
    return (
      <Link
        to={""}
        className="shadow-md px-4 p-2 flex  gap-3 items-center w-72 rounded-md bg-cdark-200 "
      >
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <h1 className="font-medium">{username || "Anonymous"}</h1>
      </Link>
    );
  }
);

const FollowersSearchBarErrors = memo(({ label }: { label: string }) => {
  return (
    <div className="px-10 rounded-md font-semibold">
      <h1>{label}</h1>
    </div>
  );
});
