import LeftBar from "../../components/Auth/LeftBar";
import { Login } from "./login";

const Signin = () => {
  return (
    <div className="flex h-screen bg-cdark-100 ">
      <div className="lg:block hidden sm:w-[60%] relative ">
        <LeftBar
          title="Write what should not <br />
            be forgotten."
          author="Isabel Allende"
          shortNote="Chilean-American writer"
          url={import.meta.env.VITE_SIGNIN_BG_IMAGE}
        />
      </div>
      <div className="w-full lg:w-[40%] text-white py-16 flex justify-center items-center">
        <Login />
      </div>
    </div>
  );
};

export default Signin;
