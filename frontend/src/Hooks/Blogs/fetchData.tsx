import axios from "axios";

import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { useResetUserState } from "../../atoms/userAtom";
import { useState } from "react";

const useFetchData = () => {
  const [user, setUser] = useRecoilState(userState);

  const [hasFetched, setHasFetched] = useState(false);
  const resetUserState = useResetUserState();

  const fetchData = async () => {
    if (!user.token) {
      resetUserState();
      return;
    }

    try {
      const response = await axios.get(`/verifyUser`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.data) {
        const { data, message } = response.data;
        console.log(message);
        setUser((prev) => ({
          ...prev,
          id: data.id,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          username: data.username,
          email: data.email,
          isAuthenticated: data.isActive,
          createdAt: data.createdAt,
        }));
        return;
      } else {
        resetUserState();
        return;
      }
    } catch (error: any) {
      console.log(error.response.data.error || error.message);
      resetUserState();
      return;
    } finally {
      setHasFetched(true);
    }
  };

  return { fetchData, hasFetched };
};

export default useFetchData;
