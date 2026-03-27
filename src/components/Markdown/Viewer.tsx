import { cn } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import { ChevronRight } from "lucide-react";
import markdownIt from "markdown-it";
import { useCallback, useRef, useState } from "react";
import "./markdown.css";

export type ViewerProps = {
  markdown?: string;
  title?: string;
};

const Viewer = ({ markdown, title }: ViewerProps) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const md = new markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
  const html = md.render(markdown ?? "");
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded bg-white",
        !open && "pb-4",
      )}
    >
      {title && (
        <button
          type="button"
          onClick={toggle}
          className="flex w-full cursor-pointer items-center justify-between p-4"
        >
          <span className="text-xl font-bold tracking-wide text-neutral-700">
            {title}
          </span>
          <ChevronRight
            className={cn(
              "text-neutral-500 transition-transform duration-300",
              open && "rotate-90",
            )}
          />
        </button>
      )}

      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{
          maxHeight: open
            ? `${contentRef.current?.scrollHeight ?? 9999}px`
            : "3.5rem",
        }}
      >
        <div className="px-4 pb-4 font-normal">
          <div
            id="ride-notes"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </div>
    </div>
  );
};

export default Viewer;
