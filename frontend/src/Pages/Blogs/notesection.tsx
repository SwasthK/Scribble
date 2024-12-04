import { memo } from "react";
import { Link } from "react-router-dom";

const NoteSection = memo(() => {
  return (
    <div className="bg-[#333331] text-white p-4 rounded-lg mt-3 text-sm font-giest font-normal">
      <p>
        This is a blog application where you can read and share articles on
        various topics.
      </p>
      <p className="mt-5">
        Built by
        <Link
          to={"https://github.com/swasthK"}
          target="_blank"
          className="ml-1 font-semibold text-cyan-200 hover:underline"
        >
          Swasthik
        </Link>
        .
      </p>
    </div>
  );
});

export default NoteSection;
