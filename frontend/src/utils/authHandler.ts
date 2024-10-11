import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const isTokenExpiringSoon = (token: string, bufferTime = 120000) => {
  const { exp } = jwtDecode<{ exp: number }>(token);
  return Date.now() >= exp * 1000 - bufferTime;
};

export const refreshAccessToken = async (refreshToken: string | null) => {
  try {
    if (refreshToken) {
      const response = await axios.post("/refreshAccessToken", {},
        {
          headers: {
            refreshToken: `Bearer ${refreshToken}`,
          },
        }
      );
      const newAccessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};