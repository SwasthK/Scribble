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
        <div className="w-[90%] mx-auto text-white pt-8">
          {/* First Section */}
          <div className="flex items-center gap-8 flex-col lg:flex-row lg:gap-24 py-8 justify-center">
            <img src="https://cdn.wccftech.com/wp-content/uploads/2023/07/Cyberpunk-2077-Project-AI.jpg" className="h-60  w-full max-w-[30rem] object-cover object-center rounded-lg"></img>
            <div className="max-w-[30rem] flex flex-col gap-5">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Google for India 2023: Partnering India's success in a new
                digital paradigm
              </h1>
              <p className="md:text-lg">
                With India looking at a billion connected people in the near
                future, the country's digital journey is underpinned by the
                large strides it has taken in a short timespan by
              </p>
            </div>
          </div>

          {/* Second Section */}
          <div className="w-full bg-cdark-100 sm:px-16 sm:py-16 p-16 rounded-xl">
            <div className=" flex gap-4 flex-col w-full">
              <p className="font-semibold w-[100%]  md:w-[30rem]">
                Runway | Tools for human imagination.
              </p>
              <p className="sm:text-3xl text-2xl font-semibold w-[100%]  md:w-[30rem] lg:w-[35rem]">
                We are pioneering general-purpose multimodal simulators of the
                world.
              </p>
              <button className="px-2 py-2 border rounded-full w-28">
                Read more
              </button>
            </div>

            <div className=" grid lg:grid-cols-3 gap-12 sm:gap-14 md:gap-20 lg:gap-10 grid-cols-1 place-items-center mt-8 ">
    
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex gap-2 flex-col items-center  w-full max-w-96">
                  <img src="https://cdn.wccftech.com/wp-content/uploads/2023/07/Cyberpunk-2077-Project-AI.jpg" alt="" className="xl:h-60 mb-4  w-full rounded-xl object-cover object-center" />
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
