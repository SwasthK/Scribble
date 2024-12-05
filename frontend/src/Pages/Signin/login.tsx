import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { FormErrors } from "../../Types/type";
import { Eye } from "../../assets/svg/Eye";
import { CustomHyperLink } from "../../components/Hyperlink";
import { Spinner } from "../../components/Global/Spinner";

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
        const { user: userData, accessToken, refreshToken } = response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser((prev) => ({
          ...prev,
          user: { ...prev.user, ...userData },
          isAuthenticated: true,
          accessToken,
          refreshToken,
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
        <h1 className="text-4xl font-medium font-scribble2">Welcome Back!</h1>
        <h3 className="text-cgray italic">
          Your journey of discovery continues here.
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
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
          </div>
          {errors.submit && (
            <p className="error font-giest font-light text-sm text-giest-100">
              {errors.submit}
            </p>
          )}
          <div className="flex justify-center px-16 ">
            {loading ? (
              <>
                <Spinner size={7}></Spinner>
              </>
            ) : (
              <button
                type="submit"
                className={`${
                  loading
                    ? ""
                    : "bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2"
                } rounded-lg py-3 px-4 disabled:cursor-not-allowed font-semibold w-full`}
                disabled={!!(loading && errors["password"])}
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <CustomHyperLink
            path="/register"
            text={"If you don't have an account ?"}
          />
        </div>
      </form>
    </div>
  );
};
