import { useNavigate, useParams } from "react-router-dom";
import { Blog_Details } from "../components/Blogs/Blog_Details";
import { Blog_Content_Skeleton } from "../Skeleton/Blog_Content_Skeleton";
import { AppBar } from "../components/AppBar/AppBar";
import { useGetPostBySlug } from "../services/queries";

export const BlogContent = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data, isError, error, isLoading } =
    useGetPostBySlug(slug);

  return (
    <div>
      <AppBar />

      {isLoading ? (
        <Blog_Content_Skeleton />
      ) : isError ? (
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-semibold">{error.message}</h1>
          <button
            onClick={() => navigate("/blogs")}
            className="px-10 py-3 border border-white hover:bg-slate-800 rounded-md font-semibold"
          >
            Explore
          </button>
        </div>
      ) : (
        <>
          <Blog_Details
            blogContent={
              data?.find((post: { slug: string }) => post.slug === slug) || []
            }
          />
        </>
      )}
    </div>
  );
};
