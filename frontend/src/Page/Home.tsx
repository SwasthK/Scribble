// import React from 'react';
// import { AppBar } from "../components/AppBar/AppBar";
import { LandingBg } from "../components/Home/LandingBg";
// import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    // <>
    //   <AppBar />
    //   <div>
    //     <Outlet></Outlet>
    //   </div>
    // </>
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0">
        <LandingBg />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full w-full overflow-y-scroll">
        <div className="w-[90%] mx-auto text-white ">
          <div className="h-screen flex justify-center items-center  flex-col gap-16">
            <div className="relative">
              <h1 className="mb-2 text-7xl sm:text-9xl font-scribble2 sm:mb-9">
                Scribble .
              </h1>
              <h3 className="text rotate-[-3deg] absolute bottom-[-1.2rem] right-[-1rem] sm:absolute sm:bottom-0 sm:right-0  font-scribble2 sm:text-xl">
                Unleash Your Voice, Share Your Story !
              </h3>
            </div>
            <div className=" flex gap-5 sm:gap-12 w-full justify-center">
              <button className="px-6 py-2 sm:px-10 sm:py-5 rounded-full border text-black bg-white font-extralight">
                Register
              </button>
              {/* <div className="flex flex-col"> */}
              <button className="font-scribble2 px-6 py-2 sm:px-10 sm:py-5 rounded-full border text-white bg-cdark-300">
                Continue without Registering &#8594;
              </button>
              {/* <h1></h1> */}
              {/* </div> */}
            </div>
          </div>

          {/* First Section */}
          <div className="flex items-center gap-8 flex-col lg:flex-row lg:gap-24 py-8 justify-center">
            <img
              src="/Block-animation.gif"
              className="border border-alphaborder w-[30rem] object-contain rounded-lg"
            ></img>
            <div className="max-w-[30rem] flex flex-col gap-10">
              <h1 className="text-3xl md:text-5xl font-semibold">
                Rich Text Editing Made Easy
              </h1>
              <p className="md:text-lg text-neutral-400">
              Craft beautiful content effortlessly with our intuitive BlockNote editor.
              </p>
            </div>
          </div>

          {/* Second Section */}
          <div className="w-full bg-[#0C0C0C] sm:px-16 sm:py-16 p-16 rounded-xl">
            <div className=" flex gap-4 flex-col w-full">
              <p className="font-semibold w-[100%]  md:w-[30rem]">
                Runway | Tools for human imagination.
              </p>
              <p className="font-scribble1 text-[#585F69  ] font-[100] sm:text-4xl text-2xl w-[100%]  md:w-[30rem] lg:w-[35rem]">
                We are pioneering general-purpose multimodal simulators of the
                world.
              </p>
              <button className="px-2 py-2 border rounded-full w-28">
                Read more
              </button>
            </div>

            <div className=" grid lg:grid-cols-3 gap-12 sm:gap-14 md:gap-20 lg:gap-10 grid-cols-1 place-items-center mt-8 ">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 flex-col items-center  w-full max-w-96"
                >
                  <img
                    src="https://cdn.wccftech.com/wp-content/uploads/2023/07/Cyberpunk-2077-Project-AI.jpg"
                    alt=""
                    className="xl:h-60 mb-4  w-full rounded-xl object-cover object-center"
                  />
                  <h1 className="font-semibold text-[1.1rem]  w-full  ">
                    Lorem, ipsum dolor sit amet consectetur
                  </h1>
                  <h6 className="text-sm text-gray-400  w-full  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Qui, quis.
                  </h6>
                </div>
              ))}
            </div>

            <div className="h-48 w-96 bg-[#252525]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
//   {/* Header */}
//   {/* <header className="w-full text-center py-8">
//     <h1 className="text-5xl font-bold">Welcome to My Blog</h1>
//     <p className="mt-4 text-lg">Your go-to platform for insightful articles and stories</p>
//   </header> */}

//   {/* Main Content */}
//   {/* <main className="flex-1 flex flex-col justify-center items-center">
//     <div className="max-w-2xl text-center">
//       <h2 className="text-4xl font-semibold">Explore. Learn. Share.</h2>
//       <p className="mt-4 text-xl">
//         Dive into a world of curated content, written by thought leaders and enthusiasts from various fields. Whether you’re here to read, write, or simply get inspired, you’ve come to the right place.
//       </p>
//       <button className="mt-8 px-6 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:bg-purple-700 hover:text-white transition duration-300">
//         Get Started
//       </button>
//     </div>
//   </main> */}

//   {/* Footer */}
//   {/* <footer className="w-full text-center py-6">
//     <p>&copy; 2024 My Blog. All rights reserved.</p>
//   </footer> */}
// // </div>
