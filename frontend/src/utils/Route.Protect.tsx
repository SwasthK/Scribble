import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authAtom, useAuthAtomResetValue } from "../atoms/auth.atoms";
import { isTokenExpiringSoon, refreshAccessToken } from "./authHandler";
import { useAuthHandler } from "../Hooks/Blogs/useAuthHandler";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useRecoilValue(authAtom);
  
  const redirectPath = "/home";

  const { handleAuth } = useAuthHandler(redirectPath);

  useEffect(() => {
    handleAuth();
  }, []);

  if (!user.isAuthenticated) return null;

  return <>{children}</>;
};

export const UnProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(authAtom);
  const resetAtom = useAuthAtomResetValue();

  useEffect(() => {
    const checkAuth = async () => {
      if (user.isAuthenticated) {
        if (user.accessToken && isTokenExpiringSoon(user.accessToken)) {
          const { accessToken, user: userData } = await refreshAccessToken(
            user.refreshToken
          );

          if (accessToken) {
            setUser((prev) => ({
              ...prev,
              user: {
                ...prev,
                username: userData.username,
              },
              isAuthenticated: true,
              accessToken: accessToken,
            }));
            navigate("/blogs");
          } else {
            resetAtom();
          }
        } else {
          navigate("/blogs");
        }
      }
    };

    checkAuth();
  }, []);

  if (user.isAuthenticated) return null;

  return <>{children}</>;
};
