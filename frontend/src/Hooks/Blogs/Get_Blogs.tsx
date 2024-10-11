
import axios from "axios";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";

// interface Blog {
//   title: string;
//   content: string;
//   id: number;
//   createdAt: string;
//   tags: string[];
//   slug: string;
//   author: { username: string };
// }

export const useGetBlogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<any>([]);
  const {accessToken}=useRecoilValue(authAtom)

  async function fetchData() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_AXIOS_BASE_URL}/posts/getall`, {
        headers: {
          accessToken:`Bearer ${accessToken}`,
        },
      });
      if (response.data.data) {
        console.log(response.data.data  );
        setBlogs(response.data.data);
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.log(error.response.data.error || error.message);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  }

  return { blogs, loading, fetchData };
};
