import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useEffect, useRef, useState } from "react";
import { UserIcon } from "../../assets/svg/UserIcon";
import { EditIcon } from "../../assets/svg/EditIcon";
import { LogoutIcon } from "../../assets/svg/LogoutIcon";
import { FollowersIcon } from "../../assets/svg/FollowersIcon";
import { SavedIcon } from "../../assets/svg/SavedIcon";
import { authAtom, useAuthAtomResetValue } from "../../atoms/auth.atoms";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { DraftIcon } from "../../assets/svg/DraftIcon";
import { ArchiveIcon } from "../../assets/svg/ArchiveIcon";
import { SearchComponent } from "./Search";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

export const AppBar = () => {
  const { user: currentUser } = useRecoilValue(authAtom);
  const resetAuthAtom = useAuthAtomResetValue();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  let lastScrollY = 0;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      queryClient.clear();
      await axios.post(
        `${import.meta.env.VITE_AXIOS_BASE_URL}/logout`,
        {},
        {
          headers: {
            accessToken: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      resetAuthAtom();
      navigate("/login", { replace: true });
      setLogoutLoading(false);
    }
  };

  return (
    <>
      {/* // <div className="sticky top-7 shadow-lg border-none mx-8 rounded-full z-50 bg-white/5 backdrop-blur-md flex justify-between items-center text-4xl md:hidden border-b py-4 px-10 font-bold text-white transition-all duration-300"> */}
      <div
        className={`font-scribble2 sticky transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }  top-0 shadow-lg border-none  z-50 bg-[#272727] flex justify-between items-center text-3xl sm:text-4xl  sm:px-16 md:pl-24  border-b py-4 px-6 font-bold text-white transition-all duration-300`}
      >
        <Link to={"/blogs"} className="font-semibold">
          Scribble
        </Link>
        <div className="flex justify-between items-center gap-4 md:gap-6 md:pr-4">
          <div className="">
            <SearchComponent></SearchComponent>
          </div>

          <div ref={avatarRef}>
            <Avatar onClick={toggleMenu} className="h-9 w-9 cursor-pointer">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>
                <h1> {currentUser.username.slice(0, 2)}</h1>
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-[0rem] z-[100] text-white right-0  py-6 px-5 font-semibold rounded-md shadow-xl bg-base-200 h-screen sm:min-w-72
            transition-all duration-300 ease-in-out
            ${
              showMenu
                ? "translate-x-[0] opacity-100"
                : " translate-x-[20rem] pointer-events-none opacity-0"
            }`}
        ref={menuRef}
      >
        <div className="pb-10 font-scribble2 flex py-8 ">
          <>
            <Avatar>
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>
                <h1>{currentUser.username.slice(0, 2)}</h1>
              </AvatarFallback>
            </Avatar>

            <Link
              to={`/profile/@${currentUser.username}`}
              className="px-4 pr-20 py-[0.6rem]"
            >
              {currentUser.username}{" "}
              <span className="text-cgreen ml-3">&#x2022; Active</span>
            </Link>
          </>
        </div>
        <div className="menu flex flex-col gap-2 text-base">
          <MenuItems icon={EditIcon} label="Write" url={"/post/handle"} />
          <hr className="opacity-30 mt-2 mb-1" />
          <MenuItems
            icon={UserIcon}
            url={`/profile/@${currentUser.username}`}
            label="User"
          />
          <MenuItems icon={SavedIcon} label="Saved" url="/post/saved" />
          <MenuItems
            icon={FollowersIcon}
            label="Followers"
            url="/user/followers"
          />
          <MenuItems icon={DraftIcon} url={"/post/draft"} label="Draft" />
          <MenuItems
            icon={ArchiveIcon}
            label="Archieved"
            url="/post/archived"
          />

          {currentUser.email && (
            <h1 className="mt-4 text-cgray menuItems font-light">
              {currentUser.email}
            </h1>
          )}

          <MenuItems
            onclick={handleLogout}
            icon={LogoutIcon}
            label={logoutLoading ? "Please wait" : "Logout"}
            className={`${
              logoutLoading
                ? "disabled:cursor-not-allowed disabled"
                : "enabled:cursor-pointer"
            }  absolute bottom-16`}
          />
        </div>
      </div>
    </>
  );
};

const MenuItems = ({
  onclick,
  url,
  icon: Icon,
  label,
  className,
}: {
  onclick?: any;
  url?: string;
  icon?: any;
  label?: string;
  className?: string;
}) => {
  return (
    <>
      {url ? (
        <Link
          onClick={onclick || undefined}
          className={`${className} menuItems`}
          to={url}
        >
          {Icon && <Icon />}
          {label && <h1>{label.charAt(0).toUpperCase() + label.slice(1)}</h1>}
        </Link>
      ) : (
        <div
          onClick={onclick || undefined}
          className={`${className} menuItems`}
        >
          {Icon && <Icon />}
          {label && <h1>{label.charAt(0).toUpperCase() + label.slice(1)}</h1>}
        </div>
      )}
    </>
  );
};
