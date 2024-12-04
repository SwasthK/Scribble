import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const UserCards = memo(({ filteredList }: { filteredList: any }) => {
  return (
    <>
      {filteredList?.map((value: any, index: number) => (
        <Link
          key={index}
          to={""}
          className="shadow-md px-4 p-2 flex  gap-3 items-center w-72 rounded-md bg-cdark-200 "
        >
          <Avatar>
            <AvatarImage src={value.avatarUrl} />
            <AvatarFallback>{value.username.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <h1 className="font-medium">{value.username || "Anonymous"}</h1>
        </Link>
      ))}
    </>
  );
});

export default UserCards;
