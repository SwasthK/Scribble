import { ChangeEvent, useState } from "react";
import { InputBoxProps } from "../../Types/type";
import { Link, useNavigate } from "react-router-dom";
import { ClientSignupSchema } from "@swasthik/medium-common-types";
import { ClientSigninSchema } from "@swasthik/medium-common-types";
import axios from "axios";

interface FormProps {
  FormType: string;
}

const Form: React.FC<FormProps> = ({ FormType }) => {
  const navigate = useNavigate();

  const [postInputs, setPostInputs] = useState<
    ClientSignupSchema | ClientSigninSchema
  >(
    FormType === "signup"
      ? {
          username: "",
          email: "",
          password: "",
          bio: "",
        }
      : {
          email: "",
          password: "",
        }
  );

  const sendRequest = async () => {
    try {
      const response = await axios.post(
        `/${FormType === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      if (response.data) {
        const { data, msg, token } = response.data;
        console.log(msg);
        console.log(data);
        localStorage.setItem("token", token);
        navigate("/blogs");
      }
    } catch (error: any) {
      console.log(error.response.data.error || error.message);
      return;
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id } = e.target;
    setPostInputs((c) => ({
      ...c,
      [id]: e.target.value,
    }));
  };

  return (
    <div className="border-black h-screen flex flex-col justify-center items-center sm:px-12 md:px-16 lg:px-22 xl:px-28">
      <div className="max-w-96 xl:w-96">
        <h1 className="text-4xl font-bold mb-8 text-center xl:mx-8">
          {FormType === "signup" ? "Create an account" : "Welcome back!"}
        </h1>

        <div className="">
          {FormType === "signup" ? (
            <InputBox
              label="Username"
              type="text"
              placeholder="eg. john_doe"
              onChange={handleChange}
            />
          ) : null}
          <InputBox
            label="Email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
          <InputBox
            label="Password"
            type="password"
            placeholder={
              (FormType == "signup" ? "Create a new " : "Enter your ") +
              "password"
            }
            onChange={handleChange}
          />
          {FormType === "signup" ? (
            <InputBox
              label="Bio *"
              type="textarea"
              placeholder="Write a Bio for your profile"
              onChange={handleChange}
            />
          ) : null}
        </div>

        <button
          onClick={() => {
            sendRequest();
          }}
          type="submit"
          className="text-white w-full bg-black mt-3 hover:bg-[rgb(14,41,41)] focus:outline-none font-medium rounded-lg text-sm  px-5 py-2.5 text-center"
        >
          Continue
        </button>

        <h6 className="mt-3 font-semibold flex justify-between">
          {FormType === "signup"
            ? "Already have an account ?"
            : "New to Medium ?"}
          <Link
            to={FormType === "signup" ? "/signin" : "/signup"}
            className="ml-2 underline text-sky-800"
          >
            {FormType === "signup" ? "Sign in" : "Sign up"}
          </Link>
        </h6>
      </div>
    </div>
  );
};

export default Form;

const InputBox = ({ label, type, placeholder, onChange }: InputBoxProps) => {
  const [hide, sethide] = useState("password");

  return (
    <>
      <div className="flex justify-between">
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        {type === "password" ? (
          <button
            className="border-none focus:outline-none pr-1 font-semibold text-zinc-600 text-sm"
            onClick={() =>
              sethide((prevType) =>
                prevType == "password" ? "text" : "password"
              )
            }
          >
            {hide === "password" ? "Show" : "Hide"}
          </button>
        ) : null}
      </div>

      {type === "textarea" ? (
        <>
          <textarea
            name={label}
            id={label.split(" ")[0].toLowerCase()}
            cols={30}
            rows={2}
            style={{
              resize: "vertical",
              maxHeight: "200px",
              minHeight: "50px",
            }}
            className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-black focus:outline-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={placeholder}
            onChange={onChange}
          ></textarea>
        </>
      ) : (
        <>
          <input
            autoComplete="true"
            type={type === "password" ? hide : type}
            id={label.toLowerCase()}
            className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-black focus:outline-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={placeholder}
            onChange={onChange}
          />
        </>
      )}
    </>
  );
};
