import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { FormErrors } from "../../Types/type";
import { Eye } from "../../assets/svg/Eye";
import { LinkToLogin } from "./Register";

export const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [_, setUser] = useRecoilState(authAtom);
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePassword = () => {
    setIsHidden((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post("/signin", formData);

      if (response.data) {
        const { data, accessToken, refreshToken } = response.data;
        console.log("Data :", data);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...data,
          },
          isAuthenticated: true,
          accessToken: accessToken,
          refreshToken: refreshToken,
        }));

        navigate("/blogs");
      }
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[70%] max-w-[350px]">
      <div className="flex flex-col gap-4 items-center mb-10">
        <h1 className="text-4xl font-medium">Kickstart here</h1>
        <h3 className="text-cgray italic">Join the Circle of Knowledge !</h3>
      </div>
      <form onSubmit={handleSubmit}>
        {errors.submit && <p className="error">{errors.submit}</p>}
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 flex-col">
            <label htmlFor="identifier" className="font-semibold">
              Username or Email
            </label>
            <input
              className="input-style"
              type="text"
              id="identifier"
              name="identifier"
              placeholder="Enter your username or email"
              value={formData.identifier}
              onChange={handleChange}
              autoComplete="true"
              disabled={loading}
            />
            {errors.identifier && <p className="error">{errors.identifier}</p>}
          </div>

          <div className="flex gap-3 flex-col">
            <div className="flex justify-between items-center px-2">
              <label htmlFor="password" className="font-semibold">
                Password:
              </label>

              <Eye hide={isHidden} toggleHide={togglePassword} />
            </div>

            <input
              type={isHidden ? "password" : "text"}
              autoComplete="true"
              placeholder="eg. JhonDoe*345"
              className="input-style"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div className="flex justify-center px-16 pt-8">
            {loading ? (
              <>
                <div
                  className="flex justify-center items-center w-24 py-3 px-4"
                  role="status"
                >
                  <svg
                    aria-hidden="true"
                    className="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-blue-100"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              </>
            ) : (
              <button
                type="submit"
                className={`${
                  loading ? "" : "bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2"
                } rounded-lg py-3 px-4 disabled:cursor-not-allowed font-semibold w-full`}
                disabled={!!(loading && errors["password"])}
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <LinkToLogin
            path="/register"
            text={"If you don't have an account ?"}
          />
        </div>
      </form>
    </div>
  );
};
