import { memo } from "react";

export const SectionBar = memo(
  ({
    label,
    section,
    setSection,
  }: {
    label: any;
    section: any;
    setSection: any;
  }) => {
    return (
      <h6
        onClick={() => setSection(label)}
        className={`text-gray-80 cursor-pointer px-5 py-2 rounded-full capitalize font-scribble2 tracking-wide
          ${
            section === label
              ? "font-bold bg-blue-300 text-black"
              : "text-cgray "
          }
        }`}
      >
        {label}
      </h6>
    );
  }
);
