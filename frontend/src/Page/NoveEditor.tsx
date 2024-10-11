import { useCallback } from "react";
import Editor from "./Novel";
import axios from "axios";

function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const NovelEditor = () => {
  const handleChange = (content: string) => {
    console.log("Content changed: ", content);
    saveContentToBackend(content);
  };

  const saveContentToBackend = async (content: any) => {
    console.log("Content : \n", content);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AXIOS_BASE_URL}/posts/upsert`,
        {
          title: "Novel1 title and its a very long title",
          shortCaption: "Novel1 short caption and its a very long caption",
          body: JSON.stringify(content),
          summary: "Novel1 summary and its a very long summary",
          allowComments: true,
        },
        {
          headers: {
            accessToken: `Bearer ` + localStorage.getItem("accessToken"),
          },
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to save content");
      }

      console.log("Content saved successfully");
    } catch (error) {
      console.error("Error saving content: ", error);
    }
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 1000), []);
  return (
    <div className="flex justify-center items-center py-16 ">
      <div className="w-full flex flex-col gap-8 max-w-[800px] border">
        <div className="min-h-96 max-w-3/4 ">
          <Editor onChange={debouncedHandleChange} />
        </div>
      </div>
    </div>
  );
};

export default NovelEditor;
