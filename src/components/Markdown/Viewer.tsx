import { NOTES_SHOW_MORE_LENGTH } from "@/constants";
import { cn } from "@/lib/utils";
import { renderHtml } from "@tanstack/markdown/html";
import { ChevronDown } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../Button";
import "./markdown.css";

export type ViewerProps = {
  markdown?: string;
  title?: string;
};

const Viewer = ({ markdown, title }: ViewerProps) => {
  const [showAll, setShowAll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleShowAll = useCallback(() => setShowAll((prev) => !prev), []);

  // Raw HTML is escaped and executable URL schemes stripped by default
  const html = useMemo(() => renderHtml(markdown ?? ""), [markdown]);
  const isLong = html.length > NOTES_SHOW_MORE_LENGTH;

  return (
    <div className="flex w-full flex-col gap-2 rounded bg-white py-2 lg:py-4 shadow-md">
      {title && (
        <div className="px-2 text-xl font-bold tracking-wide text-neutral-700 lg:px-4">
          {title}
        </div>
      )}

      <div className="relative px-2 font-normal lg:px-4">
        <div
          ref={contentRef}
          className={cn(
            "relative overflow-hidden transition-[max-height] duration-300 ease-in-out",
            !showAll && isLong && "max-h-30",
          )}
          style={
            showAll || !isLong
              ? { maxHeight: contentRef.current?.scrollHeight ?? "none" }
              : undefined
          }
        >
          <div id="ride-notes" dangerouslySetInnerHTML={{ __html: html }} />
          {isLong && (
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-white to-transparent transition-opacity duration-300",
                showAll && "opacity-0",
              )}
            />
          )}
        </div>
        {isLong && (
          <div className="flex w-full justify-center">
            <Button className="font-light" link onClick={toggleShowAll}>
              {showAll ? "Show less" : "Show more"}
              <ChevronDown
                className="h-4 w-4 transition-transform duration-300"
                style={{
                  transform: showAll ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewer;
