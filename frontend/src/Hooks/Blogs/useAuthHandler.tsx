import { useRecoilState } from "recoil";
import { authAtom, useAuthAtomResetValue } from "../../atoms/auth.atoms";
import { useNavigate } from "react-router-dom";
import {
  isTokenExpiringSoon,
  refreshAccessToken,
} from "../../utils/authHandler";

export const useAuthHandler = (redirectPath: string) => {
  const [user, setUser] = useRecoilState(authAtom);
  const navigate = useNavigate();
  const resetAtom = useAuthAtomResetValue();

  const handleAuth = async () => {
    if (!user.accessToken || !user.refreshToken || !user.isAuthenticated) {
      resetAtom();
      navigate(redirectPath);
      return;
    }

    if (isTokenExpiringSoon(user.accessToken)) {
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
        return;
      } else {
        resetAtom();
        navigate(redirectPath);
      }
    }
    return;
  };
  return { handleAuth };
};
