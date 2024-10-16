import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";

import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  TextAlignButton,
} from "@blocknote/react";

interface EditorProps {
  onChange?: (value: string) => void;
  initalContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, editable }: EditorProps) => {
  const editor: BlockNoteEditor = useCreateBlockNote({});

  const [blog, setBlog] = useState<any>();

  return (
    <div className="border border-white">
      <BlockNoteView
        editor={editor}
        editable={editable}
        formattingToolbar={false}
        data-changing-font-demo  
        data-theming-css-variables-demo
      >
        {/* // onChange={async () => {
        //   function formatHTML(html:any) {
        //     return html.replace(/<p><\/p>/g, "<br>");
        //   }
        //   const html = await editor.blocksToHTMLLossy(editor.document);
        //   const formattedHTML = formatHTML(html);
        //   if (onChange) {
        //     onChange(formattedHTML);
        //   }
        // }}
      /> */}

        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key={"blockTypeSelect"} />

              <FileCaptionButton key={"fileCaptionButton"} />
              <FileReplaceButton key={"replaceFileButton"} />

              <BasicTextStyleButton
                basicTextStyle={"bold"}
                key={"boldStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"italic"}
                key={"italicStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"underline"}
                key={"underlineStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"strike"}
                key={"strikeStyleButton"}
              />
              {/* Extra button to toggle code styles */}
              <BasicTextStyleButton
                key={"codeStyleButton"}
                basicTextStyle={"code"}
              />

              <TextAlignButton
                textAlignment={"left"}
                key={"textAlignLeftButton"}
              />
              <TextAlignButton
                textAlignment={"center"}
                key={"textAlignCenterButton"}
              />
              <TextAlignButton
                textAlignment={"right"}
                key={"textAlignRightButton"}
              />

              <ColorStyleButton key={"colorStyleButton"} />

              <CreateLinkButton key={"createLinkButton"} />
            </FormattingToolbar>
          )}
        />
        
      </BlockNoteView>

      <button
        className="px-8 py-4 border bg-sky-500 text-black"
        onClick={async () => {
          const html = await editor.blocksToHTMLLossy(editor.document);
          setBlog(html);
          if (onChange) {
            onChange(blog);
          }
        }}
      >
        Publish Post
      </button>
    </div>
  );
};

export default Editor;
