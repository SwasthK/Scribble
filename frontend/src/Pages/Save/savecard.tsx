import { memo } from "react";
import { Link } from "react-router-dom";

const SaveCard = memo(({ data }: { data: any }) => {
  return (
    <>
      {data?.map((post: any) => (
        <div className="relative overflow-hidden rounded-lg group">
          <img
            loading="lazy"
            src={post.coverImage}
            className="aspect-square object-cover group-hover:scale-[1.2] duration-500
              transofrm transition-all cursor-pointer ease-out"
          />
          <div className="flex justify-center items-center absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <Link
              to={`/blog/${post.slug}`}
              className="font-semibold border px-2 py-1 text-sm bg-white text-black rounded-lg focus:bg-gray-300 focus:outline-none border-none"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </>
  );
});

export default SaveCard;
