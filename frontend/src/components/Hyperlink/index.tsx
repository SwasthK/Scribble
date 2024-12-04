import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export const CustomHyperLink = ({
    path,
    linkText,
    text,
    classNameLink,
    classNameText,
  }: {
    linkText?: string;
    path: string;
    text?: string;
    classNameLink?: string;
    classNameText?: string;
  }) => {
    return (
      <>
        <div className="flex gap-2">
          <Link
            className={cn("font-semibold text-[#4dccf7] ", classNameLink)}
            to={path}
          >
            {linkText || "Click"}
          </Link>
          {text && <p className={cn("", classNameText)}>{text}</p>}
        </div>
      </>
    );
  };