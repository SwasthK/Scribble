import { Link } from "react-router-dom";
import { LandingBg } from "../../components/Home/LandingBg";
import { GitHubIcon } from "../../assets/svg/GitHubIcon";
import { TwitterIcon } from "../../assets/svg/TwitterIcon";
import { InstagramIcon } from "../../assets/svg/InstagramIcon";
import { Mail } from "lucide-react";
import { CtaButton } from "../../components/Buttons/ctaButton";

const Home = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 z-0">
        <LandingBg />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full w-full overflow-y-scroll">
        <div className="w-[100%] text-white ">
          {/* Hero Section */}
          <div className="h-screen flex justify-center items-center  flex-col gap-10  relative">
            <div className="relative">
              <h1 className="mb-2 text-7xl sm:text-9xl font-scribble2 sm:mb-9 font-bold">
                Scribble .
              </h1>
              <h2 className="text rotate-[-3deg] absolute bottom-[-1.2rem] right-[-1rem] sm:absolute sm:bottom-0 sm:right-0  font-scribble2 sm:text-xl">
                Unleash Your Voice, Share Your Story !
              </h2>
            </div>
            <h3 className=" text-[#8C969B]  text-center">
              Write, connect, and inspire with our modern blogging platform
            </h3>

            <div className="flex gap-5 sm:gap-12 w-full justify-center mt-4 font-scribble2">
              <CtaButton
                label1="Register"
                label2="Continue without Registering &#8594;"
                url1="/login"
                url2="/login"
              />
            </div>
          </div>

          {/* Features Section -1 */}
          <div
            className="rounded-t-xl sm:py-16 py-4 flex flex-col gap-10  md:px-16 sm:mx-10 lg:mx-20 mx-0"
            style={{
              background: "linear-gradient(to bottom, #051E2E, #000)",
            }}
          >
            <div className="flex items-center gap-12 flex-col lg:flex-row lg:gap-24 py-8 justify-center">
              <img
                alt="Block-Note Editor"
                loading="lazy"
                src="/Block-animation.gif"
                className="border border-alphaborder w-[24rem] sm:w-[30rem] object-contain rounded-lg"
              />
              <div className="max-w-[30rem] flex flex-col gap-4 sm:gap-10 font-scribble2 -tracking-wide">
                <h2 className="text-3xl md:text-5xl font-semibold">
                  Rich Text Editing Made Easy .
                </h2>
                <p className="md:text-lg text-neutral-400">
                  Craft beautiful content effortlessly with our intuitive <br />
                  <Link
                    aria-label="Visit the BlockNote editor website"
                    to={"https://www.blocknotejs.org/"}
                    target="_blank"
                    className="text-[#EE9521] hover:underline"
                  >
                    BlockNote editor .
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-12 flex-col lg:flex-row-reverse lg:gap-24 py-8 justify-center">
              <img
                alt="Custom Search "
                loading="lazy"
                src="/Block-animation.gif"
                className="border border-alphaborder w-[24rem] sm:w-[30rem]  object-contain rounded-lg"
              />
              <div className="max-w-[30rem] flex flex-col gap-4 sm:gap-10 font-scribble2 -tracking-wide">
                <h1 className="text-3xl md:text-5xl font-semibold ">
                  Advanced Search .
                </h1>
                <p className="md:text-lg text-neutral-400">
                  Quickly discover posts, categories, and users with <br /> our
                  custom{" "}
                  <Link
                    aria-label="Visit the ShadCN website"
                    to={"https://www.blocknotejs.org/"}
                    target="_blank"
                    className="text-[#EE9521] hover:underline"
                  >
                    ShadCN{" "}
                  </Link>
                  - powered advanced search .
                </p>
              </div>
            </div>
          </div>

          {/* Features Section-2 */}
          <div className=" bg-[#0C0C0C] sm:py-16 sm:pt-20 pb-12 pt-20 flex flex-col gap-10 lg:px-16 sm:px-16  md:px-16 sm:mx-10 lg:mx-20 mx-0   rounded-b-xl font-scribble2">
            <div className=" flex gap-4 flex-col w-full  px-8 sm:px-0">
              <p className="font-semibold w-[100%] md:w-[30rem] text-sm text-[#95959D]">
                Runway | Tools for human imagination.
              </p>
              <p className="font-scribble2 font-[700] text-[#585F69  ] font-[100] sm:text-4xl text-2xl w-[100%]  md:w-[30rem] lg:w-[35rem]">
                We are pioneering general-purpose multimodal simulators of the
                world.
              </p>
              <button className="px-2 py-2 border rounded-full w-28">
                Read more
              </button>
            </div>

            <div className=" grid lg:grid-cols-3 gap-12 sm:gap-14 md:gap-20 lg:gap-10 grid-cols-1 place-items-center sm:mt-16 mt-8">
              <div className="flex gap-2 flex-col items-center  w-full max-w-96">
                <img
                  alt="Draft, Archive, Publish"
                  loading="lazy"
                  src="/Block-animation.gif"
                  className="xl:h-60 mb-4  w-full rounded-md object-cover object-center"
                />
                <h1 className="font-semibold text-[1.1rem]  w-full  ">
                  Draft, Archive, Publish
                </h1>
                <h2 className="text-sm text-giest-100 font-light font-giest w-full  ">
                  "Manage your posts your way — work in progress, organize
                  archived ideas, or share with the world.
                </h2>
              </div>

              <div className="flex gap-2 flex-col items-center  w-full max-w-96">
                <img
                  alt="Draft, Archive, Publish"
                  loading="lazy"
                  src="/Block-animation.gif"
                  className="xl:h-60 mb-4  w-full rounded-md object-cover object-center"
                />
                <h1 className="font-semibold text-[1.1rem]  w-full  ">
                  Engage & Connect
                </h1>
                <h2 className="text-sm text-giest-100 font-light font-giest w-full  ">
                  "Follow creators, comment on posts, and build meaningful
                  connections."
                </h2>
              </div>

              <div className="flex gap-2 flex-col items-center  w-full max-w-96">
                <img
                  loading="lazy"
                  src="/Block-animation.gif"
                  alt="Draft, Archive, Publish"
                  className="xl:h-60 mb-4  w-full rounded-md object-cover object-center"
                />
                <h1 className="font-semibold text-[1.1rem]  w-full  ">
                  Like, Save & Report
                </h1>
                <h2 className="text-sm text--400  w-full text-giest-100 font-light font-giest">
                  "Engage with posts you love, save them for later, or report
                  inappropriate content."
                </h2>
              </div>
            </div>
          </div>

          {/* Features Section-3 */}
          <div className="sm:px-16 sm:pt-32 px-8 pt-8 flex flex-col  justify-center items-center font-scribble2 rounded-xl">
            <div className="text-center">
              <h1 className="text-5xl font-bold">Personalized Profiles</h1>
              <p className="text-[#666] mt-4">
                Set your username, avatar, and social links to showcase your
                unique identity.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-16 mt-8 gap-y-10">
              <img
                loading="lazy"
                src="/Block-animation.gif"
                alt="Profile Feature"
                className="w-96 h-60  rounded-md object-cover"
              />
              <img
                loading="lazy"
                src="/Block-animation.gif"
                alt="Profile Feature"
                className="w-96 h-60  rounded-md object-cover"
              />
            </div>
          </div>

          {/* Features Section-4 */}
          <div className=" sm:px-8 md:py-60 sm:py-48 px-3 py-36 flex flex-col justify-center items-center font-scribble2">
            <div className="sm:text-center pb-8 px-4">
              <h1 className="text-6xl font-bold">
                Ready to Start Your Blogging Journey?
              </h1>
              <p className="text-[#666] mt-4">
                Join thousands of creators sharing their voices and building
                communities.
              </p>
            </div>
            <div className=" flex gap-5 sm:gap-12 w-full justify-center mt-4 font-scribble2">
              <CtaButton
                label1="Register"
                label2="Continue without Registering &#8594;"
                url1="/login"
                url2="/login"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="w-screen font-scribble1 py-12 md:px-10 lg:px-36 text-sm flex justify-between items-center bg-[#09090B] flex-col md:flex-row gap-8 md:gap-0">
            <p className="text-[#95959D]">
              Built by{" "}
              <Link
                aria-label="Visit Developer's Profile"
                to={"https://www.blocknotejs.org/"}
                target="_blank"
                className="text-[#EE9521] hover:underline"
              >
                Swasthik{" "}
              </Link>
              . The source code is available on{" "}
              <Link
                aria-label="Visit the Github Repository"
                to={"https://www.blocknotejs.org/"}
                target="_blank"
                className="text-[#EE9521] hover:underline"
              >
                Github{" "}
              </Link>
              {"."}
            </p>
            <div className="flex gap-10 items-center">
              <p className="text-[#95959D]">Socials</p>
              <div className="flex gap-7 items-center">
                <GitHubIcon size={20} />
                <TwitterIcon size={18} />
                <InstagramIcon size={20} />
                <Mail />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
