import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useGetAllFollowers } from "../../services/queries";
import { pageSection } from "../../Types/type";

import { FollowerCard_Skeleton } from "../../Skeleton/FollowerCard_Skeleton";
import ErrorBar from "../../components/Error";
const UserCards = lazy(() => import("./usercards"));

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const { data, isLoading, isError, error } = useGetAllFollowers();
  const [searchValue, setSearchValue] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("new");
  const [activeSection, setActiveSection] = useState(pageSection.Followers);

  useEffect(() => {
    setFollowers(data?.followers.followers);
    setFollowings(data?.followings.followings);
  }, [data]);

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
            <ErrorBar label={error?.message || "An error occurred."} />
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
                    <ErrorBar label="No followers found." />
                  ) : (
                    <>
                      {filteredList.length === 0 ? (
                        <ErrorBar label="No results found." />
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

                          <Suspense fallback={<FollowerCard_Skeleton />}>
                            <UserCards filteredList={filteredList} />
                          </Suspense>
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
                        <ErrorBar label="No results found." />
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
                          <Suspense fallback={<FollowerCard_Skeleton />}>
                            <UserCards filteredList={filteredList} />
                          </Suspense>
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
