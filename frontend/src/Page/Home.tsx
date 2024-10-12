// import React from 'react';
import { LandingBg } from "../components/Home/LandingBg";

const Home = () => {
  return (
    <div className="relative w-screen h-screen p-8 flex justify-center">
      <LandingBg />
      <div className="relative z- h-full text-white w-[90%]">
        <div className="flex items-center gap-8 flex-col lg:flex-row lg:gap-24 py-8 justify-center">
          <div className="h-60 border w-full max-w-[30rem] bg-gray-50 rounded-lg"></div>
          <div className="max-w-[30rem] flex flex-col gap-5">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Google for India 2023: Partnering India's success in a new digital
              paradigm
            </h1>
            <p className="md:text-lg">
              With India looking at a billion connected people in the near
              future, the country's digital journey is underpinned by the large
              strides it has taken in a short timespan by
            </p>
          </div>
        </div>

        <div className="w-full bg-cdark-100  border">
          <div className="w-[40%] border flex gap-4 flex-col">
            <p className="font-semibold">Runway | Tools for human imagination.</p>
            <p className="text-3xl font-semibold">
              We are pioneering general-purpose multimodal simulators of the
              world.
            </p>
            <button className="px-2 py-2 border rounded-full w-28">Read more</button>
          </div>
          <div className="grid grid-cols-3 gap-6 place-items-center">
            <div className="flex gap-2 flex-col">
              <img src="" alt="" className="h-36 w-48" />
            </div>
            <div className="flex gap-2 flex-col">
              <img src="" alt="" className="h-36 w-48" />
            </div>
            <div className="flex gap-2 flex-col">
              <img src="" alt="" className="h-36 w-48" />
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
