import { atom, useRecoilState } from "recoil";
import { useState,useEffect } from "react";
import axios from "axios";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
}

type BlogCacheState = {
  [key: string]: BlogData;
};

export const blogCacheState = atom<BlogCacheState>({
  key: 'blogCacheState',
  default: {},
});

export const useGetBlogContent = ({ slug }: { slug: string }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogCache, setBlogCache] = useRecoilState(blogCacheState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_AXIOS_BASE_URL}/blog/getBlogContent/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.data || !response.data.data) {
          setError("No data found");
          console.error("No data found");
          setLoading(false);
          return;
        }

        const { data } = response.data;
        console.log(data);

        setBlogCache((prev) => ({
          ...prev,
          [slug]: {
            id: data.id,
            title: data.title,
            slug: data.slug,
            content: data.content,
            author: data.author.username,
            createdAt: data.createdAt,
            tags: data.tags,
          },
        }));

        setLoading(false);
        console.log(blogCache['first-test-1']);
        console.log("Blog ID Cached");
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || "Something went wrong";
        setError(errorMsg);
        console.error(errorMsg);
        setLoading(false);
      }
    };

    if (!blogCache[slug]) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [slug, setBlogCache, blogCache]);

  return { blog: blogCache[slug], loading, error };
};
