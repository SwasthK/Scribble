import { useState } from "react";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateFileType,
  validateFileSize,
} from "./register.validate";
import { FormErrors } from "../../Types/type";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { Cancel } from "../../assets/svg/Cancel";
import { Upload } from "../../assets/svg/Upload";
import { Next } from "../../assets/svg/Next";
import { Eye } from "../../assets/svg/Eye";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    file: null as File | null,
  });

  const [_, setUser] = useRecoilState(authAtom);
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let stepErrors: FormErrors = {};
    let error: string | undefined = undefined;

    switch (name) {
      case "username":
        if (value !== "") {
          error = validateUsername(value);
        }
        break;
      case "email":
        if (value !== "") {
          error = validateEmail(value);
        }
        break;
      case "password":
        if (value !== "") {
          error = validatePassword(value);
        }
        break;
      default:
        break;
    }

    if (error) {
      stepErrors[name] = error;
    } else {
      stepErrors[name] = "";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...stepErrors,
    }));

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileTypeError = validateFileType(file.type);
      const fileSizeError = validateFileSize(file.size);
      if (fileTypeError || fileSizeError) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: fileTypeError || fileSizeError,
        }));
        return;
      }
      setErrors((prevErrors) => ({ ...prevErrors, file: undefined }));
      setFormData((prevData) => ({ ...prevData, file }));
    }
  };

  const cleanUpState = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      file: null,
    });
    setStep(1);
    setErrors({});
  };

  const validateStep = () => {
    if (step === 1) {
      return !errors["username"] && !errors["email"];
    }

    if (step === 2) {
      return !errors["password"];
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: passwordError,
      }));
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const response = await axios.post("/signup", data, {});

      if (response.data) {
        cleanUpState();
        const { data, accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser((prev) => ({
          ...prev,
          user: {
            username: data.username,
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

  const nextStep = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const togglePassword = () => {
    setIsHidden((prevState) => !prevState);
  };

  return (
    <div className="w-[70%] max-w-[350px]">
      {step === 1 ? (
        <div className="flex flex-col gap-4 items-center mb-10">
          <h1 className="text-4xl font-medium">Create an account</h1>
          <h3 className="text-cgray italic">Join the Circle of Knowledge !</h3>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center mb-8">
            <h3 className="text-cgray italic">
              Explore ideas and stories that inspire !
            </h3>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit}>
        {errors.submit && <p>{errors.submit}</p>}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 flex-col">
              <p className="font-semibold"> Profile Picture (optional):</p>
              <div className="flex  items-center justify-between gap-8 h-[3.4rem]">
                <img
                  src={
                    formData.file
                      ? URL.createObjectURL(formData.file)
                      : import.meta.env.VITE_SIGNUP_PROFILE_ICON || ""
                  }
                  className=" border-none h-full rounded-full w-[3.4rem] border  object-cover object-center hover:object-top transition-all duration-300"
                ></img>

                <div className="h-full w-full flex items-center pr-6 outline-none rounded-lg  font-medium ">
                  <div className="flex gap-8 justify-center items-center h-full">
                    <label
                      className={`
                        p-4 rounded-full font-medium  
                        bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2
                     `}
                      htmlFor="file"
                    >
                      {formData.file ? (
                        <>
                          <div className="flex items-center justify-between text-base w-14 overflow-hidden">
                            <span>
                              {`${formData.file.name.slice(
                                0,
                                3
                              )}.${formData.file.name.split(".").pop()}` || ""}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload></Upload>
                        </>
                      )}
                    </label>

                    {formData.file ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              file: null,
                            }));
                          }}
                        >
                          <Cancel color="red" />
                        </button>
                      </>
                    ) : null}

                    <input
                      className="hidden"
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {errors.file ? (
                <p className="error">{errors.file}</p>
              ) : (
                <>
                  {formData.file ? (
                    <p className="text-cgreen">Wow, that's looking great!</p>
                  ) : (
                    <p className="text-cgray">You can add it later as well.</p>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-3 flex-col">
              <label htmlFor="username" className="font-semibold">
                Username
              </label>
              <input
                className="input-style"
                type="text"
                id="username"
                name="username"
                placeholder="eg. JohnDoe"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.username ? (
                <p className="error">{errors.username}</p>
              ) : (
                <p className="text-cgray">Your public username here.</p>
              )}
            </div>

            <div className="flex gap-3 flex-col">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                className="input-style"
                type="email"
                id="email"
                name="email"
                placeholder="eg. johndoe@gmail.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="true"
                disabled={loading}
              />

              {errors.email ? (
                <p className="error">{errors.email}</p>
              ) : (
                <p className="text-cgray">Your email address</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <LinkToLogin path="/login" text={"If account already exists ."} />
              <button
                className="bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2 p-3 rounded-full disabled:cursor-not-allowed"
                type="button"
                onClick={nextStep}
                disabled={!formData.username || loading || !formData.email}
              >
                <Next />
                <div className=""></div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex gap-3 flex-col">
              <div className="flex justify-between items-center px-2">
                <label htmlFor="password" className="font-semibold">
                  Password
                </label>

                <Eye hide={isHidden} toggleHide={togglePassword} />
              </div>
              <input
                className="input-style"
                type={isHidden ? "password" : "text"}
                id="password"
                name="password"
                autoComplete="true"
                placeholder="eg. JhonDoe*345"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password ? (
                <p className="error">{errors.password}</p>
              ) : (
                <p className="text-cgray">Your password here.</p>
              )}
            </div>
            <div className="flex justify-between pt-8">
              <button
                className="bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2 rounded-lg py-3 px-4"
                type="button"
                onClick={prevStep}
                disabled={loading}
              >
                Previous
              </button>

              {loading ? (
                <>
                  <div
                    className="flex justify-center items-center w-24 py-3 px-4"
                    role="status"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-100"
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
                    loading
                      ? ""
                      : "bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2"
                  } rounded-lg py-3 px-4 disabled:cursor-not-allowed font-semibold w-24`}
                  disabled={!!(loading && errors["password"])}
                >
                  Register
                </button>
              )}
            </div>
            <div className="mt-4">
              <LinkToLogin path="/login" text={"If account already exists ."} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export const LinkToLogin = ({ path, text }: { path: string; text: string }) => {
  return (
    <>
      <div className="flex gap-2">
        <Link className="font-semibold text-[#4dccf7] " to={path}>
          Click
        </Link>
        <p>{text}</p>
      </div>
    </>
  );
};
