"use client";
import dynamic from "next/dynamic";
// import MarkdownIt from "markdown-it";
// import Turndown from "turndown";
import "quill/dist/quill.snow.css";
import { useMemo, useState } from "react";

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    ["link"],
    [{ size: ["small", false, "large", "huge"] }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ "indent": "-1" }, { "indent": "+1" }],
    ["clean"]
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "size",
  "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent",
  "link"
]

// // Configure markdown
// const md = new MarkdownIt();
// const td = new Turndown({ headingStyle: "atx" });

// // Add custom style rules
// td.addRule("underline", {
//   filter: ["u"],
//   replacement: function (content) {
//     return "<u>" + content + "</u>";
//   },
// });
// td.addRule("strikethrough", {
//   filter: ["del", "s", "strike"],
//   replacement: function (content) {
//     return "~~" + content + "~~";
//   },
// });

// md.set({ html: true });

export const Editor = () => {
  const [value, setValue] = useState("");
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return (
    <div>
      <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules}
        formats={formats} placeholder="Add ride notes..." />
    </div>
  );
};

// type EditorProps = {
//   placeholder?: string;
//   value?: string;
//   onChange?: (value: string) => void;
// };

// export class Editor extends Component {
//   placeholder: string;

//   constructor(props: EditorProps) {
//     super(props)
//     this.state = { editorHtml: "" }
//     this.handleChange = this.handleChange.bind(this)
//     this.placeholder = props.placeholder ?? "";
//   }

//   handleChange(html) {
//     this.setState({ editorHtml: html });
//   }

//   render() {
//     return (
//       <div>
//         <ReactQuill
//           theme="snow"
//           onChange={this.handleChange}
//           value={this.state.editorHtml}
//           modules={modules}
//           formats={formats}
//           placeholder={this.placeholder}
//         />
//       </div>
//     )
//   }
// }
