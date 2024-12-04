import LeftBar from "../../components/Auth/LeftBar";
import { Register } from "./register";
const Signup = () => {
  return (
    <div className="flex h-screen bg-cdark-100">
      <div className="lg:block hidden sm:w-[60%] relative ">
        <LeftBar
          title="The art of writing is the art of <br />
            discovering what you believe."
          author="Gustave Flaubert"
          shortNote="French novelist"
          url={import.meta.env.VITE_SIGNUP_BG_IMAGE}
        />
      </div>

      <div className="w-full lg:w-[40%] text-white py-16 flex justify-center items-center">
        <Register />
      </div>
    </div>
  );
};

export default Signup;
