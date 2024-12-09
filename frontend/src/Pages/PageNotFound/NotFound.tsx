import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-black h-screen w-screen flex items-center justify-center flex-col gap-4">
      <p className="text-white text-lg font-semibold blur-fade font-giest">
        Page Not Found ...!
      </p>
      <div>
        <p className="text-giest-100 text-sm font-giest blur-fade">
          It seems you are lost.{" "}
          <Link to={"/blogs"} className="text-blue-500">
            Click here
          </Link>{" "}
          to go back to the blogs page.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
