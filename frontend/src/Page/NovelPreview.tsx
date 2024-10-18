import axios from "axios";
import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export const NovelPreview = () => {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);
  //   const [htmlFromBlocks, setHtmlFromBlocks] = useState();

  const editor = useCreateBlockNote();

  useEffect(() => {
    setLoading(true);
    const handleMount = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_AXIOS_BASE_URL
          }/posts/get/b46502bd-20ca-4bee-89c9-b2f7df8e761d`,
          {
            headers: {
              accessToken: `Bearer ` + localStorage.getItem("accessToken"),
            },
          }
        );

        const { data } = response.data;
        const receivedBlock = JSON.parse(data.body);
        console.log("Received Block: ", receivedBlock);

        // if (Array.isArray(receivedBlock)) {
        //   console.log("It is an array.");

        //   const allObjects = receivedBlock.every(
        //     (item) => typeof item === "object" && !Array.isArray(item)
        //   );

        //   if (allObjects) {
        //     console.log("All elements are objects.");
        //   } else {
        //     console.log("Not all elements are objects.");
        //   }
        // } else {
        //   console.log("It is not an array.");
        // }

        const blocks = await editor.tryParseHTMLToBlocks(receivedBlock);
        editor.replaceBlocks(editor.document, blocks);
        

        setBlocks(receivedBlock);
      } catch (error: any) {
        console.error("Error occurred:", error);
      } finally {
        setLoading(false);
      }
    };
    handleMount();
  }, []);

  return (
    <div className="flex justify-center items-center py-16 ">
      <div className="w-full flex flex-col gap-8 max-w-[900px] border">
        <div className="min-h-96 max-w-3/4 ">
          <div className="border">
            <BlockNoteView
              editor={editor}
              editable={false}
              data-theming-css-variables-demo
              formattingToolbar={false}
              linkToolbar={false}
              filePanel={false}
              sideMenu={false}
              slashMenu={false}
              tableHandles={false}
            />
          </div>

          {/* <BlockNoteView editor={editor} editable={false} /> */}
          {/* {<BlockNoteView editor={editor} />}

          {htmlFromBlocks && (
            <div className="bn-container border">
              <div
                className=" bn-default-styles"
                dangerouslySetInnerHTML={{ __html: htmlFromBlocks }}
              />
            </div> */}

          {/* {!loading && !blocks && <div>No content available.</div>}
          )} */}

          {/* {!loading && htmlFromBlocks && (
            <div className="bn-container">
              <div
                className="bn-default-styles"
                dangerouslySetInnerHTML={{ __html: htmlFromBlocks }} // Insert the HTML safely
              />
            </div>
          )} */}
          {/* {!loading && !htmlFromBlocks && <div>No content available.</div>} */}
        </div>
      </div>
    </div>
  );
};
