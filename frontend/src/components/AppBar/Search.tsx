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
import {  allUsersNames, postsAtom } from "../../atoms";
import { authAtom } from "../../atoms/auth.atoms";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQueryClient } from "@tanstack/react-query";

export const SearchComponent = memo(() => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const posts = useRecoilValue(postsAtom);
  const { user } = useRecoilValue(authAtom);
  const userNames = useRecoilValue(allUsersNames);

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

  const [filteredPosts, setFilteredPosts] = useState(posts.slice(0, 3));
  const [filteredUsers, setFilteredUsers] = useState<any>(
    userNames.slice(0, 3)
  );
  const [filteredCategories, setFilteredCategories] = useState<any>([]);

  useEffect(() => {
    setFilteredCategories(categoryData?.categories);
  }, [categoryData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setFilteredPosts(
        posts.filter((post) => post.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredUsers(
        userNames.filter((user: any) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredPosts(posts.slice(0, 3));
      setFilteredUsers(userNames.slice(0, 3));
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
        className="flex gap-8 justify-between items-center p-2 sm:rounded-md sm:px-4 rounded-full  bg-slate-800 sm:bg-transparent  sm:border sm:border-[#ffffff54]"
      >
        <Search size={18} />
        <p className="hidden sm:block text-sm font-semibold bg-[#2E2E2E] px-2 rounded-md ">
          Ctrl + K
        </p>
      </button>

      <Command>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Search posts, profile, write..."
            value={searchQuery}
            onValueChange={(e: string) => handleSearch(e)}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Commands">
              <div className="flex gap-4 px-2 w-full items-center justify-center mb-1.5">
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
                          {user.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <h1>{user.username}</h1>
                    </div>
                  </CommandItemLink>
                </>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup
              heading="Search Posts by keywords"
              className="mt-1.5 "
            >
              {filteredPosts.length > 0
                ? filteredPosts.map((slug, index) => (
                    <CommandItemLink
                      onClick={handleSearchClick}
                      url={`/blog/${slug}`}
                      className="px-5"
                      key={index}
                    >
                      {convertSlugToText(slug)}
                    </CommandItemLink>
                  ))
                : null}
            </CommandGroup>

            <CommandSeparator />

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
