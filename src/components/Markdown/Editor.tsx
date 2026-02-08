"use client";

import {
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import markdownIt from "markdown-it";
import { useState } from "react";
import "./markdown.css";

const md = new markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

export type MarkdownEditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

const MarkdownEditor = ({
  initialValue = "",
  onChange,
}: MarkdownEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById(
      "markdown-textarea",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    handleChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      insertMarkdown("[", `](${url})`);
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertMarkdown("> ", ""),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`"),
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: insertLink,
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertMarkdown("- ", ""),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("1. ", ""),
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 bg-gray-50">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "edit"
              ? "border-b-2 border-blue-500 bg-white text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            mode === "preview"
              ? "border-b-2 border-blue-500 bg-white text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>

      {mode === "edit" ? (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
            {toolbarButtons.map((button) => {
              const Icon = button.icon;
              return (
                <button
                  key={button.label}
                  type="button"
                  onClick={button.action}
                  title={button.label}
                  className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Write your notes in markdown..."
            className="w-full resize-none border-0 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={12}
          />
        </>
      ) : (
        <div className="min-h-48 p-4">
          <div
            id="markdown-preview"
            className="text-gray-800"
            dangerouslySetInnerHTML={{ __html: md.render(value) }}
          />
        </div>
      )}

      {/* Help text */}
      {mode === "edit" && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          Markdown supported: **bold**, *italic*, [link](url), `code`, &gt;
          quote, - list
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
