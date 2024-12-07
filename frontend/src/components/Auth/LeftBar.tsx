import { LeftBarType } from "../../Types/type";

const LeftBar: React.FC<LeftBarType> = ({ title, author, shortNote, url }) => {
  const parts = title.split("<br />");
  return (
    <>
      <img
        className="w-[60vw] h-[100vh] object-cover object-center blur-[3px] brightness-[.7]"
        src={url}
        loading="lazy"
        alt="Signin Bg"
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center font-scribble2">
        <div>
          <h1 className="text-white text-nowrap sm:leading-[1.4rem] md:leading-[1.8rem] lg:leading-[2.3rem] xl:leading-[3rem] sm:pr-0 sm:text-base md:text-xl lg:text-3xl xl:text-[2.5rem] font-semibold leading-[3rem]">
            {parts[0]}
            <br />
            {parts[1]}
          </h1>

          <h2 className="sm:text-sm md:text-base mt-3 text-cgray font-giest font-semibold">
            {`— ${author}`}
          </h2>
          <h3 className="sm:text-xs md:text-sm text-cyan-600 pl-6 mt-2 font-light font-giest">
            {shortNote}
          </h3>
        </div>
      </div>
    </>
  );
};

export default LeftBar;
