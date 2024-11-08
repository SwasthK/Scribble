export const GridIcon = ({ size, fill }: { size: number; fill?: string }) => {
  return (
    <svg
      width={size || "24px"}
      height={size || "24px"}
      stroke="white"
      viewBox="0 0 24 24"
      fill={fill || "none"}
      xmlns="http://www.w3.org/2000/svg"
      color="blue"
    >
      <path
        d="M3 21V3H21V21H3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 16.5H12H21"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 12H21"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M3 7.5H21"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M16.5 3V12V21"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 3V21"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M7.5 3V21"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
