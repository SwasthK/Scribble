import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { refreshAccessToken } from "./utils/authHandler";
import { authAtom, useAuthAtomResetValue } from "./atoms/auth.atoms";
import { followAtom } from "./atoms/followAtom";
import { Loader } from "./components/Global/Loader";
import SuspendedComponent from "./Layout/SuspensedComponent";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

// Layout Imports
import { LayoutProtected } from "./Layout/LayoutProtected";
import { LayoutUnProtected } from "./Layout/LayoutUnProtected";

// Public Layout Imports
const Home = lazy(() => import("./Pages/Home/index"));
const Signup = lazy(() => import("./Pages/Signup/index"));
const Signin = lazy(() => import("./Pages/Signin/index"));

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
const NotFound = lazy(() => import("./Pages/PageNotFound/NotFound"));

function App() {
  function updateState(userData: any, accessToken: any, following: any) {
    setUser((prev) => ({
      ...prev,
      user: { ...prev.user, ...userData },
      isAuthenticated: true,
      accessToken,
    }));
    setFollowing((prev) => ({ ...prev, following }));
  }
  const [user, setUser] = useRecoilState(authAtom);
  const setFollowing = useSetRecoilState(followAtom);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
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

    const {
      accessToken,
      user: userData,
      following,
    } = await refreshAccessToken(user.refreshToken);

    if (accessToken) {
      updateState(userData, accessToken, following);
      return;
    } else {
      resetAuthAtom();
      return;
    }
  }

  useEffect(() => {
    let interval: any;
    const startTime = Date.now();

    if (!hasFetched) {
      interval = setInterval(() => {
        setProgress((prev:any) => Math.min(prev + 5, 100));
      }, 100);
      checkAuthOnAppMount().finally(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsedTime);
        setTimeout(() => {
          setProgress(100);
          setLoading(false);
          setHasFetched(true);
        }, remainingTime);
      });
    } else {
      setLoading(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loader progress={progress} />
      ) : (
        <RouterProvider router={router}></RouterProvider>
      )}
    </>
  );
}

export default App;
