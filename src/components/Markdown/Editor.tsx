import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  X,
} from "lucide-react";
import markdownIt from "markdown-it";
import TurndownService from "turndown";
import { useCallback, useEffect, useState } from "react";
import "./markdown.css";

const md = new markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

const mdToHtml = (markdown: string) => md.render(markdown);
const htmlToMd = (html: string) => turndown.turndown(html);

export type MarkdownEditorProps = {
  initialValue?: string;
  onChange?: (value: string) => void;
};

const MOBILE_BREAKPOINT = 768;

type ToolbarProps = {
  editor: ReturnType<typeof useEditor>;
  className?: string;
  onFullscreenClose?: () => void;
};

const Toolbar = ({ editor, className, onFullscreenClose }: ToolbarProps) => {
  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: () => {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        const url = prompt("Enter URL:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: editor.isActive("link"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 bg-gray-50 p-2",
        className,
      )}
    >
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <button
            key={button.label}
            type="button"
            onClick={button.action}
            title={button.label}
            className={cn(
              "rounded p-2 transition-colors",
              button.isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900",
            )}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
      {onFullscreenClose && (
        <button
          type="button"
          onClick={onFullscreenClose}
          title="Close fullscreen"
          className="ml-auto rounded p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const MarkdownEditor = ({
  initialValue = "",
  onChange,
}: MarkdownEditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your notes..." }),
    ],
    content: initialValue ? mdToHtml(initialValue) : "",
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      // Tiptap returns <p></p> for empty content
      const markdown = html === "<p></p>" ? "" : htmlToMd(html);
      onChange?.(markdown);
    },
  });

  const handleFocus = useCallback(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      setIsFullscreen(true);
    }
  }, []);

  useEffect(() => {
    if (!editor) return;
    editor.on("focus", handleFocus);
    return () => {
      editor.off("focus", handleFocus);
    };
  }, [editor, handleFocus]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-gray-300 bg-white",
        isFullscreen && "fixed inset-0 z-50 flex flex-col rounded-none",
      )}
    >
      {isFullscreen ? (
        <>
          <div className="flex items-center justify-between border-b p-2">
            <span className="font-medium">Notes</span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="rounded px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
            >
              Done
            </button>
          </div>
          <EditorContent
            editor={editor}
            className="flex-1 overflow-y-auto p-4"
          />
          <Toolbar
            editor={editor}
            className="border-t"
            onFullscreenClose={() => setIsFullscreen(false)}
          />
        </>
      ) : (
        <>
          <Toolbar editor={editor} className="border-b border-gray-200" />
          <EditorContent editor={editor} className="min-h-36 p-4" />
        </>
      )}
    </div>
  );
};

export default MarkdownEditor;
