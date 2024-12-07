import { useState } from "react";
import { FormErrors } from "../../Types/type";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms/auth.atoms";
import { Cancel } from "../../assets/svg/Cancel";
import { Next } from "../../assets/svg/Next";
import { Eye } from "../../assets/svg/Eye";

import { CustomHyperLink } from "../../components/Hyperlink";
import { Spinner } from "../../components/Global/Spinner";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFileType,
  validateFileSize,
} from "../../validation/register.validate";

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

        const {
          user: userData,
          accessToken,
          refreshToken,
        } = response.data.data;

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
          <h1 className="text-3xl md:text-4xl font-medium font-scribble2">
            Create an account
          </h1>
          <h2 className="text-cgray italic">Join the Circle of Knowledge !</h2>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center mb-8">
            <h1 className="text-cgray italic">
              Explore ideas and stories that inspire !
            </h1>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit}>
        {errors.submit && (
          <p className=" font-giest font-light text-sm text-giest-100 mb-2 error">
            {errors.submit}
          </p>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 flex-col">
              <p className="font-semibold"> Profile Picture (optional):</p>
              <div className="flex  items-center justify-between gap-8 h-[3rem]">
                <div className="h-full w-full flex items-center pr-6 outline-none rounded-lg  font-medium gap-4">
                  {formData.file && (
                    <>
                      <img
                        src={URL.createObjectURL(formData.file)}
                        className="w-[3rem] h-[3rem] rounded-md  object-cover object-center "
                      ></img>
                    </>
                  )}
                  <div className="flex gap-8 justify-center items-center h-full ">
                    <label
                      className={`
                       h-full px-3  rounded-md font-medium bg-cgray-100 border border-b-dark-200 cursor-pointer flex justify-center items-center
                     `}
                      htmlFor="file"
                    >
                      {formData.file ? (
                        <>
                          <div className="flex items-center justify-between text-base w-14 overflow-hidden">
                            <h1>
                              {`${formData.file.name.slice(
                                0,
                                1
                              )}.${formData.file.name.split(".").pop()}` || ""}
                            </h1>
                          </div>
                        </>
                      ) : (
                        <>
                          <h1 className="font-giest font-semibold text-sm">
                            Upload
                          </h1>
                        </>
                      )}
                    </label>

                    {formData.file ? (
                      <>
                        <button
                          id="cancelButton"
                          title="cancel"
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
                <p className=" font-giest font-light text-sm error">
                  {errors.file}
                </p>
              ) : (
                <>
                  {formData.file ? (
                    <p className=" font-giest font-light text-sm text-cgreen">
                      Wow, that's looking great!
                    </p>
                  ) : (
                    <p className=" font-giest font-light text-sm text-giest-100">
                      You can add it later as well.
                    </p>
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
                <p className=" font-giest font-light text-sm error">
                  {errors.username}
                </p>
              ) : (
                <p className=" font-giest font-light text-sm text-giest-100">
                  Your public username here.
                </p>
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
                <p className=" font-giest font-light text-sm error">
                  {errors.email}
                </p>
              ) : (
                <p className=" font-giest font-light text-sm text-giest-100">
                  Your email address
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <CustomHyperLink path="/login" text="If account already exists" />
              <button
                id="nextButton"
                title="next"
                className=" p-3 rounded-full disabled:cursor-not-allowed bg-cgray-100 border border-b-dark-200"
                type="button"
                onClick={nextStep}
                disabled={!formData.username || loading || !formData.email}
              >
                <Next size={20} />
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
                <p className=" font-giest font-light text-sm text-giest-100 error">
                  {errors.password}
                </p>
              ) : (
                <p className=" font-giest font-light text-sm text-giest-100">
                  Your password here.
                </p>
              )}
            </div>
            <div className="flex justify-between pt-8 font-semibold">
              <button
                id="previousButton"
                title="previous"
                className="bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2 rounded-lg py-2 px-5"
                type="button"
                onClick={prevStep}
                disabled={loading}
              >
                Previous
              </button>

              {loading ? (
                <>
                  <Spinner size={5} />
                </>
              ) : (
                <button
                  id="registerButton"
                  title="register"
                  type="submit"
                  className={`${
                    loading
                      ? ""
                      : "bg-custom-gradient-1 cursor-pointer hover:bg-custom-gradient-2"
                  } rounded-lg py-2 px-5 disabled:cursor-not-allowed  w-24`}
                  disabled={!!(loading && errors["password"])}
                >
                  Register
                </button>
              )}
            </div>
            <div className="mt-8">
              <CustomHyperLink path="/login" text="If account already exists" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
