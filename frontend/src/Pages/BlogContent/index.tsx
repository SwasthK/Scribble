import { useNavigate, useParams } from "react-router-dom";
import { Blog_Details } from "../components/Blogs/Blog_Details";
import { Blog_Content_Skeleton } from "../Skeleton/Blog_Content_Skeleton";
import { useGetPostBySlug } from "../services/queries";

const BlogContent = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data, isError, error, isLoading } = useGetPostBySlug(slug);

  return (
    <div>
      {isLoading ? (
        <Blog_Content_Skeleton />
      ) : isError ? (
        <div className="h-screen w-screen flex flex-col justify-center items-center gap-7 bg-cdark-100">
          <h1 className="text-lg font-semibold font-scribble2 tracking-wide ">
            {error.message}
          </h1>
          <button
            onClick={() => navigate("/blogs")}
            className="px-8 py-1.5  hover:bg-[#f1e8e8] hover:text-black rounded-full font-scribble2 font-bold bg-white text-black"
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

export default BlogContent;
