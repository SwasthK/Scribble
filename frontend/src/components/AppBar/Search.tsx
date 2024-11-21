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
import { postsAtom } from "../../atoms";
import { authAtom } from "../../atoms/auth.atoms";

export const SearchComponent = memo(() => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const posts = useRecoilValue(postsAtom);
  const { user } = useRecoilValue(authAtom);
  console.log(user);

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

  const handleSearch = (query: string) => {
    console.log(query);
    setSearchQuery(query);
    if (query) {
      setFilteredPosts(
        posts.filter((post) => post.toLowerCase().includes(query.toLowerCase()))
      );
    } else {
      setFilteredPosts(posts.slice(0, 3));
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

            <CommandGroup heading="Other">
              <CommandItemLink url={'/post/saved'} className="px-5">
                Saved
              </CommandItemLink>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Command>
    </>
  );
});
