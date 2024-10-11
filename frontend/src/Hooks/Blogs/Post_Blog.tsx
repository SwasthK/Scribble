import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const usePostBlog = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const postBlog = async (
    title: string,
    content: string,
    published: boolean,
    tags: string[]
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AXIOS_BASE_URL}/blog`,
        {
          title,
          content,
          published,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        console.log("No data found");
        setLoading(false);
        return;
      }
      console.log(response.data);
      navigate(`/blog/${response.data.data.slug}`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.error || error.message);
      return;
    } finally {
      setLoading(false);
    }
  };
  return { loading, postBlog };
};
