// import CircleButton from "@/components/shared/CircleButton";
// import { spoilerExtension } from "@/utils/editor";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import type { EditorOptions, Editor as EditorType } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import classNames from "classnames";
import React, { useImperativeHandle } from "react";
// import {
//   AiOutlineBold,
//   AiOutlineEyeInvisible,
//   AiOutlineItalic,
//   AiOutlineOrderedList,
//   AiOutlineSend,
//   AiOutlineStrikethrough,
//   AiOutlineUnderline,
//   AiOutlineUnorderedList,
// } from "react-icons/ai";
// import { GrBlockQuote } from "react-icons/gr";

export function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/\n/g, "<br>");
}

export interface EditorProps extends Partial<EditorOptions> {
  defaultContent?: string;
  onSubmit?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  isLoading?: boolean;
  className?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  editorClassName?: string;
}

const Editor = React.forwardRef<EditorType, EditorProps>(
  (
    {
      defaultContent,
      onSubmit,
      placeholder,
      readOnly,
      isLoading,
      className,
      editorClassName,
      ...editorOptions
    },
    ref,
  ) => {
    const editor = useEditor(
      {
        extensions: [
          StarterKit,
          Underline,
          Placeholder.configure({
            placeholder,
            emptyNodeClass:
              "first:before:h-0 first:before:text-gray-500 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
          }),
          Mention.configure({
            HTMLAttributes: {
              class:
                "py-1 bg-primary-800 rounded-md decoration-clone text-white font-semibold",
            },
          }),
          // spoilerExtension(),
        ],
        content: defaultContent,
        editorProps: {
          attributes: {
            class: classNames(
              "!max-w-full prose prose-sm prose-invert focus:outline-none focus:border-none",
              !readOnly && "min-h-[2rem]",
              editorClassName,
            ),
          },
        },
        editable: !readOnly,
        ...editorOptions,
      },
      [readOnly, defaultContent, editorClassName],
    );

    useImperativeHandle(ref, () => editor || ({} as EditorType), [editor]);

    return (
      <div
        className={classNames(!readOnly && "border border-gray-600", className)}
      >
        <EditorContent
          defaultValue={markdownToHtml(defaultContent || "")}
          className={classNames(!readOnly && "p-4")}
          editor={editor}
        />

        {!readOnly && (
          <div className="flex flex-col justify-between gap-2 border-gray-600 border-t p-2 md:flex-row">
            {/* <div className="flex flex-wrap items-center md:gap-2">
              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineBold}
                onClick={() => editor.chain().toggleBold().focus().run()}
                title="Bold"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineUnderline}
                onClick={() => editor.chain().toggleUnderline().focus().run()}
                title="Underline"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineItalic}
                onClick={() => editor.chain().toggleItalic().focus().run()}
                title="Italic"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineUnorderedList}
                onClick={() => editor.chain().toggleBulletList().focus().run()}
                title="Unordered list"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineOrderedList}
                onClick={() => editor.chain().toggleOrderedList().focus().run()}
                title="Ordered list"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineStrikethrough}
                onClick={() => editor.chain().toggleStrike().focus().run()}
                title="Strikethrough"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={GrBlockQuote}
                onClick={() => editor.chain().toggleBlockquote().focus().run()}
                title="Blockquote"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineEyeInvisible}
                onClick={() => editor.chain().setSpoiler().focus().run()}
                title="Spoiler"
              />
            </div> */}
            {/* 
            {onSubmit && (
              <CircleButton
                className="ml-auto max-w-min text-primary-300"
                iconClassName="w-4 h-4"
                secondary
                shortcutKey="enter"
                onClick={() => {
                  if (editor.isEmpty) return;

                  const html = editor.getHTML();

                  onSubmit(html);
                }}
                isLoading={isLoading}
                disabled={editor?.isEmpty}
                LeftIcon={AiOutlineSend}
              />
            )} */}
          </div>
        )}
      </div>
    );
  },
);

Editor.displayName = "Editor";

export default Editor;
