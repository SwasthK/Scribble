import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { refreshAccessToken } from "./utils/authHandler";
import { authAtom, useAuthAtomResetValue } from "./atoms/auth.atoms";
import { followAtom } from "./atoms/followAtom";
import { allUsersNames, postsAtom } from "./atoms";
import axios from "axios";
import { Loader } from "./Skeleton/Loader";
import SuspendedComponent from "./Layout/SuspensedComponent";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

// Layout Imports
import { LayoutProtected } from "./Layout/LayoutProtected";
import { LayoutUnProtected } from "./Layout/LayoutUnProtected";

// Public Layout Imports
const Home = lazy(() => import("./Pages/Home/index"));
const Signup = lazy(() => import("./Pages/Signup"));
const Signin = lazy(() => import("./Pages/Signin"));

// Private Layout Imports
const Blogs = lazy(() => import("./Pages/Blogs/index"));
const Profile = lazy(() => import("./Pages/Profile/index"));
const BlogContent = lazy(() => import("./Pages/BlogContent/index"));
const Draft = lazy(() => import("./Pages/Draft/index"));
const HandlePost = lazy(() => import("./Pages/HandlePost/index"));
const Save = lazy(() => import("./Pages/Save/index"));
const Archived = lazy(() => import("./Pages/Archived/index"));
const Followers = lazy(() => import("./Pages/Followers/index"));
const ProfileView = lazy(() => import("./Pages/ProfileView/index"));
const Topic = lazy(() => import("./Pages/Topic/index"));

// Catch-All Route Imports
const NotFound = lazy(() => import("./Pages/NotFound"));

function App() {
  function updateState(
    userData: any,
    accessToken: any,
    following: any,
    posts: any,
    userNames: any
  ) {
    setUser((prev) => ({
      ...prev,
      user: { ...prev.user, ...userData },
      isAuthenticated: true,
      accessToken,
    }));
    setFollowing((prev) => ({ ...prev, following }));
    setPostsAtom(posts);
    setAllUsersNames(userNames);
  }
  const [user, setUser] = useRecoilState(authAtom);
  const setFollowing = useSetRecoilState(followAtom);
  const setPostsAtom = useSetRecoilState(postsAtom);
  const setAllUsersNames = useSetRecoilState(allUsersNames);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const resetAuthAtom = useAuthAtomResetValue();

  const router = createBrowserRouter([
    // Public Layout
    {
      path: "/",
      element: <LayoutUnProtected />,
      errorElement: <NotFound />,
      children: [
        { path: "home", element: SuspendedComponent(Home) },
        { path: "register", element: SuspendedComponent(Signup) },
        { path: "login", element: SuspendedComponent(Signin) },
      ],
    },

    // Protected Layout
    {
      path: "/",
      element: <LayoutProtected />,
      errorElement: <NotFound />,
      children: [
        { path: "blogs", element: SuspendedComponent(Blogs) },
        { path: "profile/:username", element: SuspendedComponent(Profile) },
        { path: "blog/:slug", element: SuspendedComponent(BlogContent) },
        { path: "post/draft", element: SuspendedComponent(Draft) },
        { path: "post/handle", element: SuspendedComponent(HandlePost) },
        { path: "post/saved", element: SuspendedComponent(Save) },
        { path: "post/archived", element: SuspendedComponent(Archived) },
        { path: "user/followers", element: SuspendedComponent(Followers) },
        {
          path: "view/profile/:username",
          element: SuspendedComponent(ProfileView),
        },
        { path: "topic/:categoryName", element: SuspendedComponent(Topic) },
      ],
    },

    // Catch-All Route
    {
      path: "*",
      element: SuspendedComponent(NotFound),
    },
  ]);

  async function checkAuthOnAppMount() {
    if (!user.refreshToken || !user.accessToken) {
      resetAuthAtom();
      return;
    }

    const newAccessTokenPromise = refreshAccessToken(user.refreshToken);

    const [newAccessToken, userNames] = await Promise.all([
      refreshAccessToken(user.refreshToken),
      newAccessTokenPromise.then((token) => {
        if (token) {
          return axios
            .get(`/user/getAllUserNames`, {
              headers: { accessToken: `Bearer ${token.accessToken}` },
            })
            .then((res) => res.data.data);
        } else {
          return [];
        }
      }),
    ]);

    const { accessToken, user: userData, following, posts } = newAccessToken;

    if (accessToken) {
      updateState(userData, accessToken, following, posts, userNames);
      return;
    } else {
      resetAuthAtom();
      return;
    }
  }

  useEffect(() => {
    if (!hasFetched) {
      checkAuthOnAppMount().finally(() => {
        setLoading(false);
        setHasFetched(true);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? <Loader /> : <RouterProvider router={router}></RouterProvider>}
    </>
  );
}

export default App;
