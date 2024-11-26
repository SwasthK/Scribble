import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProtectedRoute, UnProtectedRoute } from "./utils/Route.Protect";
import { useRecoilState, useSetRecoilState } from "recoil";

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
import { Draft } from "./Page/Draft";
import { Save } from "./Page/Save";
import { Archived } from "./Page/Archived";
import { followAtom } from "./atoms/followAtom";
import { postsAtom } from "./atoms";
import { Followers } from "./Page/Followers";
import { ProfileView } from "./Page/ProfileView";
import { Topic } from "./Page/Topic";
import axios from "axios";

function App() {
  const [user, setUser] = useRecoilState(authAtom);
  const setFollowing = useSetRecoilState(followAtom);
  const setPostsAtom = useSetRecoilState(postsAtom);

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
      path: "/post/draft",
      element: (
        <ProtectedRoute>
          <Draft />
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
      path: "/post/saved",
      element: (
        <ProtectedRoute>
          <Save />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/post/archived",
      element: (
        <ProtectedRoute>
          <Archived />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/user/followers",
      element: (
        <ProtectedRoute>
          <Followers />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/view/profile/:username",
      element: (
        <ProtectedRoute>
          <ProfileView />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
    },

    {
      path: "/topic/:categoryName",
      element: (
        <ProtectedRoute>
          <Topic />
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

    // const {
    //   accessToken,
    //   user: userData,
    //   following,
    //   posts,
    // } = await refreshAccessToken(user.refreshToken);

    const newAccessTokenPromise = refreshAccessToken(user.refreshToken);

    const [newAccessToken, userNames] = await Promise.all([
      refreshAccessToken(user.refreshToken),
      newAccessTokenPromise.then((token) => {
        if (token) {
          return axios.get(`/user/getAllUserNames`, {
            headers: { accessToken: `Bearer ${token.accessToken}` },
          }).then((res) => res.data.data); 
        } else {
          return []; 
        }
      }),
    ]);

    const { accessToken, user: userData, following, posts } = newAccessToken;
    console.log(userNames);

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
      setFollowing((prev: any) => ({ ...prev, following }));
      setPostsAtom(posts);
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
