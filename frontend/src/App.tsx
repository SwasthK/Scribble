import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProtectedRoute, UnProtectedRoute } from "./utils/Route.Protect";
import { useRecoilState } from "recoil";

import Home from "./Page/Home";
import { NotFound } from "./Page/NotFound";
import { Signup } from "./Page/Signup";
import { BlogContent } from "./Page/BlogContent";
import { Publish } from "./Page/Publish";
import { Loader } from "./Skeleton/Loader";
import { Profile } from "./Page/Profile";
import { refreshAccessToken } from "./utils/authHandler";
import { authAtom, useAuthAtomResetValue } from "./atoms/auth.atoms";
import { VideoPlayer } from "./components/Auth/VideoPlayer";
import { Signin } from "./Page/Signin";
import { Blogs } from "./Page/Blogs";
import NoveEditor from "./Page/NoveEditor";
import { NovelPreview } from "./Page/NovelPreview";
import { HandlePost } from "./Page/HandlePost";

function App() {
  const [user, setUser] = useRecoilState(authAtom);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        // <UnProtectedRoute>
          <Home />
        // </UnProtectedRoute>
      ),
    },

    {
      path: "/register",
      element: (
        <UnProtectedRoute>
          <Signup />
        </UnProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/login",
      element: (
        <UnProtectedRoute>
          <Signin />
        </UnProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/blogs",
      element: (
        <ProtectedRoute>
          <Blogs></Blogs>
        </ProtectedRoute>
      ),
    },

    {
      path: "/profile/:username",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "blog/:slug",
      element: (
        <ProtectedRoute>
          <BlogContent />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/post/handle",
      element: (
        <ProtectedRoute>
          <HandlePost />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/noveledit",
      element: <NoveEditor />,
      errorElement: <NotFound />,
    },

    {
      path: "/novelpreview",
      element: <NovelPreview />,
      errorElement: <NotFound />,
    },

    {
      path: "/videoplayer",
      element: <VideoPlayer />,
    },

    {
      path: "publish",
      element: (
        <ProtectedRoute>
          <Publish />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    { path: "*", element: <NotFound /> },
  ]);

  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const resetAuthAtom = useAuthAtomResetValue();

  async function checkAuthOnAppMount() {
    if (!user.refreshToken || !user.accessToken) {
      resetAuthAtom();
      return;
    }

    const { accessToken, user: userData } = await refreshAccessToken(
      user.refreshToken
    );

    if (accessToken) {
      setUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          ...userData,
        },
        isAuthenticated: true,
        accessToken: accessToken,
      }));
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
