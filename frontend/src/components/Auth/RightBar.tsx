import { RightBarType } from "../../Types/type";

export const RightBar: React.FC<RightBarType> = ({
  title,
  author,
  shortNote,
  url,
}) => {
  return (
    <>
      <img
        className="w-full h-full object-cover object-center blur-[3px] brightness-[.7]"
        src={url}
        alt=""
      />
      <RightBarCard title={title} author={author} shortNote={shortNote} />
    </>
  );
};

const RightBarCard = ({ title, author, shortNote }: RightBarType) => {
  const parts = title.split("<br />");
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center font-scribble2">
      <div>
        <h1 className="text-white text-nowrap sm:leading-[1.4rem] md:leading-[1.8rem] lg:leading-[2.3rem] xl:leading-[3rem] sm:pr-0 sm:text-base md:text-xl lg:text-3xl xl:text-[2.5rem] font-semibold leading-[3rem]">
          {parts[0]}
          <br />
          {parts[1]}
        </h1>

        <h5 className="sm:text-sm md:text-base mt-3 text-cgray font-giest font-semibold">
          {`— ${author}`}
        </h5>
        <h6 className="sm:text-xs md:text-sm text-cyan-600 pl-6 mt-2 font-light font-giest">
          {shortNote}
        </h6>
      </div>
    </div>
  );
};
