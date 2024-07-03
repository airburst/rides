"use client";
import MarkdownIt from "markdown-it";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import { useMemo, useState } from "react";
import Turndown from "turndown";

// Configure Quill
const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"]
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

const formats = [
  "size",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent",
  "link"
]

// Configure markdown
const md = new MarkdownIt();

md.set({ html: true });

const td = new Turndown();

// Add custom style rules
td.addRule("underline", {
  filter: ["u"],
  replacement: function (content) {
    return "<u>" + content + "</u>";
  },
});
td.addRule("strikethrough", {
  filter: ["s"],
  replacement: function (content) {
    return "~~" + content + "~~";
  },
});

type EditorProps = {
  onChange?: (value: string) => void;
}

export const Editor = ({ onChange }: EditorProps) => {
  const [value, setValue] = useState("");
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  const handleChange = (html: string) => {
    setValue(html);
    onChange?.(td.turndown(html));
  }

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats} />
    </div>
  );
};
