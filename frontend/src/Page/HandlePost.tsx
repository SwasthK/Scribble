import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar } from "../components/AppBar/AppBar";
import { GlobeIcon } from "../assets/svg/GlobeIcon";
import { Link } from "react-router-dom";
import { SaveFileIcon } from "../assets/svg/SaveFileIcon";

export const HandlePost = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;

  useEffect(() => {
    if (!state) {
      console.log("User is Creating a new post");
    } else {
      console.log("User is Editing a post");
      navigate(location.pathname, { replace: true, state: null });
      setTimeout(() => {}, 5000);
    }
  }, []);

  const [loadDraft, setLoadDraft] = useState(false);
  const [loadPublish, setLoadPublish] = useState(false);
  const [published, setPublished] = useState(!false);

  return (
    <>
      <AppBar />
      <div className="flex justify-center items-center px-8 py-8 sm:px-16">
        <div className="fixed top-24 w-[95%]  max-w-[800px] flex items-center justify-between px-16 bg-slate-800 rounded-full">
          <div className="flex gap-3 items-center  py-3">
            {!loadDraft ? (
              <SaveFileIcon
                color={loadDraft ? "currentColor" : "currentColor"}
              />
            ) : null}
            <p className={`${loadDraft ? "font-semibold" : "font-semibold"}`}>
              {loadDraft ? "Saving . . ." : "Saved"}
            </p>
          </div>
          <div className="flex gap-3 items-center ">
            {published ? (
              <>
                <p className="font-semibold">
                  Live at <span className="text-cgreen ml-2">&#x2022;</span>
                </p>

                <Link to={""}>
                  <GlobeIcon />
                </Link>
              </>
            ) : (
              <>
                <button
                  disabled={loadPublish ? true : false}
                  className={`cursor-pointer disabled:cursor-not-allowed bg-[#007bff] px-3 py-[0.3rem] rounded-lg font-semibold disabled:bg-[#80bdff] w-[5.5rem]`}
                >
                  Publish
                </button>
              </>
            )}

          </div>
        </div>
        <div className="w-[95%] flex flex-col gap-8 max-w-[800px] h-3/4 fixed overflow-y-scroll top-44 pb-24 px-4 sm:px-8 ">
          <div className="rounded-lg py-8 px-8 flex  gap-8 flex-col-reverse md:flex-row bg-[#262932] md:items-center">
            <div className="flex flex-col gap-6 items-start ">
              <div className="flex gap-3 flex-col w-full sm:w-96">
                {/* <label htmlFor="title" className="font-semibold">
                  Main title
                </label> */}
                <p className="text-cgray ml-2 font-semibold">Main title</p>
                <input
                  className="input-style italic  text-xl"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="eg. The ultimate next.js guide - 2024"
                  // value={formData.username}
                  // onChange={handleChange}
                  // disabled={loading}
                />
                {/* {errors.username ? (
                <p className="error">{errors.username}</p>
              ) : (
                <p className="text-cgray">Your public username here.</p>
              )} */}
              </div>

              <div className="flex gap-3 flex-col w-full sm:w-96">
                {/* <label htmlFor="title" className="font-semibold">
                  Short description
                </label> */}
                <p className="text-cgray font-semibold ml-2">
                  Short description
                </p>
                <input
                  className="input-style  text-base italic"
                  type="text"
                  id="title"
                  name="title"
                  placeholder="eg.  Fast-track your Next.js journey - Step-by-step guide for beginners"
                  // value={formData.username}
                  // onChange={handleChange}
                  // disabled={loading}
                />
                {/* {errors.username ? (
                <p className="error">{errors.username}</p>
              ) : (
                <p className="text-cgray">Your public username here.</p>
              )} */}
              </div>
            </div>

            <div className="w-full sm:max-w-96 rounded-lg flex justify-center flex-col gap-3">
              {/* <input type="file" name="" id="" className="border max-w-60" /> */}
              <p className="text-cgray font-semibold ml-2">Cover Image</p>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800 bg-gray-700 border-gray-600 hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus
            iste iure, dolorum obcaecati qui ipsam mollitia explicabo nesciunt
            quisquam corporis.
          </p>
        </div>
      </div>
    </>
  );
};
