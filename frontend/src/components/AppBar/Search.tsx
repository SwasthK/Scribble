import { memo, useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandItemLink,
  CommandList,
  CommandSeparator,
} from "../../components/ui/command";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllPostsNameAndGetAllUsersName } from "../../services/queries";

export const SearchComponent = memo(() => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllPostsNameAndGetAllUsersName();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useRecoilValue(authAtom);

  const categoryData: any = queryClient.getQueryData([
    "allCategoriesAndMostLikedPost",
  ]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchQuery("");
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearchClick = () => {
    setOpen(!open);
  };

  const [filteredPosts, setFilteredPosts] = useState<any>([]);
  const [filteredUsers, setFilteredUsers] = useState<any>([]);
  const [filteredCategories, setFilteredCategories] = useState<any>([]);

  useEffect(() => {
    if (data?.allPosts && data?.allUsers && !isLoading) {
      setFilteredPosts(data.allPosts?.slice(0, 3));
      setFilteredUsers(data.allUsers?.slice(0, 3));
    }
  }, [data]);

  useEffect(() => {
    setFilteredCategories(categoryData?.categories);
  }, [categoryData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      const filteredPosts = data?.allPosts.filter((post: any) =>
        post.slug.toLowerCase().includes(normalizedQuery)
      );

      const filteredUsers = data?.allUsers.filter((user: any) =>
        user.username.toLowerCase().includes(normalizedQuery)
      );

      setFilteredPosts(filteredPosts || []);
      setFilteredUsers(filteredUsers || data?.allUsers.slice(0, 3));
    } else {
      setFilteredPosts(data?.allPosts.slice(0, 3));
      setFilteredUsers(data?.allUsers.slice(0, 3));
    }
  };

  const convertSlugToText = (slug: string) => {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char: string) => char.toUpperCase())
      .trim();
  };

  return (
    <>
      <button
        onClick={handleSearchClick}
        className="flex gap-5 justify-between items-center p-2 sm:rounded-full sm:px-8 rounded-full border border-b-dark-200 bg-[#383434]"
      >
        <Search size={18} />
        <p className="hidden sm:block text-sm font-semibold px-3 rounded-md ">
          Ctrl + K
        </p>
      </button>

      <Command>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="mt-1">
            <CommandInput
              disabled={isLoading}
              placeholder="Search posts, profile, write..."
              value={searchQuery}
              onValueChange={(e: string) => handleSearch(e)}
            />
          </div>
          <CommandList>
            <CommandEmpty className="text-giest-100 text-sm px-4 py-20 flex justify-center items-center">
              <h1>No results found.</h1>
            </CommandEmpty>

            <CommandGroup heading="Commands">
              <div className="flex gap-4 px-2 w-full items-center justify-center mb-1.5 ">
                <CommandItem className="w-full flex justify-center">
                  <Link
                    to={"/post/handle"}
                    className="hover:text-gray-300 text-center w-full h-full cursor-pointer"
                  >
                    Write
                  </Link>
                </CommandItem>
                <CommandItem className="w-full flex justify-center">
                  <Link
                    to={`/profile/${user.username}`}
                    state={{ section: "blogs" }}
                    className="hover:text-gray-300 text-center w-full h-full cursor-pointer"
                  >
                    Posts
                  </Link>
                </CommandItem>
                <CommandItem className="w-full flex justify-center">
                  <Link
                    to={"/post/draft"}
                    className="hover:text-gray-300 text-center w-full h-full cursor-pointer"
                  >
                    Drafts
                  </Link>
                </CommandItem>
                <CommandItem className="w-full flex justify-center">
                  <Link
                    to={"/post/archived"}
                    className="hover:text-gray-300 text-center w-full h-full cursor-pointer"
                  >
                    Archived
                  </Link>
                </CommandItem>
                <CommandItem className="w-full flex justify-center">
                  <Link
                    to={`/profile/${user.username}`}
                    state={{ section: "profile" }}
                    className="hover:text-gray-300 text-center w-full h-full cursor-pointer"
                  >
                    Profile
                  </Link>
                </CommandItem>
              </div>
            </CommandGroup>

            <CommandSeparator />

            {isLoading ? (
              <div className="flex flex-col gap-2 h-full mx-6 mt-1.5">
                <p className="text-muted-foreground text-xs">
                  Fetching More Info...
                </p>
                <div className="rounded-md skeleton-parent h-2 w-60">
                  <div className="skeleton-child h-3"></div>
                </div>
                <div className="rounded-md skeleton-parent h-2 w-32">
                  <div className="skeleton-child h-3"></div>
                </div>
              </div>
            ) : (
              <>
                <CommandGroup
                  heading="Search authors by username"
                  className="mt-1.5 "
                >
                  {filteredUsers.map((user: any) => (
                    <>
                      <CommandItemLink
                        onClick={handleSearchClick}
                        url={`/view/profile/${user.username}`}
                        className="px-5"
                      >
                        <div className="flex w-full gap-4">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>
                              <h1> {user.username.slice(0, 2)}</h1>
                            </AvatarFallback>
                          </Avatar>

                          <h1>{user.username}</h1>
                        </div>
                      </CommandItemLink>
                    </>
                  ))}
                </CommandGroup>

                <CommandGroup
                  heading="Search Posts by keywords"
                  className="mt-1.5 "
                >
                  {filteredPosts.length > 0
                    ? filteredPosts?.map((post: any) => (
                        <CommandItemLink
                          onClick={handleSearchClick}
                          url={`/blog/${post.slug}`}
                          className="px-5"
                          key={post.slug}
                        >
                          {convertSlugToText(post.slug)}
                        </CommandItemLink>
                      ))
                    : null}
                </CommandGroup>

                <CommandSeparator />
              </>
            )}

            {filteredCategories?.length > 0 && (
              <>
                <CommandGroup
                  heading="Search Posts by Category"
                  className="mt-1.5 "
                >
                  {filteredCategories.map((category: any, index: number) => (
                    <CommandItemLink
                      onClick={handleSearchClick}
                      url={`/topic/${category.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="px-5"
                      key={index}
                    >
                      {`# ${category.name}`}
                    </CommandItemLink>
                  ))}
                </CommandGroup>
              </>
            )}

            <CommandGroup heading="Other">
              <CommandItemLink url={"/post/saved"} className="px-5">
                Saved
              </CommandItemLink>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </>
  );
});
