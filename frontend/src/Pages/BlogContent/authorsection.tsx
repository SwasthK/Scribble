import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { GitHubIcon } from "../../assets/svg/GitHubIcon";
import { TwitterIcon } from "../../assets/svg/TwitterIcon";
import { InstagramIcon } from "../../assets/svg/InstagramIcon";
import { memo } from "react";

const AuthorSection = memo(
  ({
    author,
    currentUserId,
    authorId,
  }: {
    author: any;
    currentUserId: string;
    authorId: string;
  }) => {
    return (
      <div className="flex flex-col gap-7">
        {currentUserId !== authorId ? (
          <>
            <Avatar className="sm:h-16 sm:w-16 w-10 h-10 rounded-full border-none">
              <AvatarImage src={author.avatarUrl} />
              <AvatarFallback>{author.username.slice(0, 3)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="sm:text-2xl font-semibold text-xl">
                Written by{" "}
                <Link
                  className="hover:underline text-cyan-300"
                  to={`/view/profile/${author.username}`}
                >
                  {author.username}
                </Link>
              </h1>
              <p className="pt-2 text-giest-100">Socials</p>
            </div>
            <div className="flex items-center gap-5">
              <GitHubIcon size={20} />
              <TwitterIcon size={17} />
              <InstagramIcon size={20} />
            </div>
          </>
        ) : (
          <>
            <div className="author-section z-10">
              <Link
                state={{ profile: false }}
                to={`/profile/@${author.username}`}
                className="text-lg font-semibold text-white hover:underline"
              >
                <p>{`More posts from you - @${author.username}`}</p>
              </Link>
              <blockquote className="text-sm italic text-giest-100 mb-2 mt-4">
                "Writing is the painting of the voice." {"-"} Voltaire
              </blockquote>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default AuthorSection;
