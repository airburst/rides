"use client";
import dynamic from "next/dynamic";
import markdownIt from "markdown-it";
import "quill/dist/quill.snow.css";
import { useState } from "react";
import Turndown from "turndown";

// Lazy load ReactQuill to reduce initial bundle size
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-32 items-center justify-center rounded border border-gray-300 bg-gray-50">
      <span className="loading loading-spinner loading-sm" />
    </div>
  ),
});

// Configure Quill
const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
];

// Configure markdown
const md = new markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});
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

export type EditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

const Editor = ({ initialValue = "", onChange }: EditorProps) => {
  const html = md.render(initialValue);
  const [value, setValue] = useState(html);

  const handleChange = (html: string) => {
    setValue(html);
    onChange?.(td.turndown(html));
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
