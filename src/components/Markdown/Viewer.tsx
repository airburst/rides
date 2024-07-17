"use client";

import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import markdownIt from "markdown-it";
import { useState } from "react";
import { Button } from "../Button";
import "./markdown.css";

export type ViewerProps = {
  markdown?: string;
  title?: string;
};

const SHORT_TEXT_LENGTH = 300;

const Viewer = ({ markdown, title }: ViewerProps) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  }

  const md = new markdownIt({
    html: true,
    linkify: true,
    typographer: true
  });
  const html = md.render(markdown ?? "");
  // Add a show more/less button if the text is long
  const isLong = html.length > SHORT_TEXT_LENGTH;
  const displayText = showAll ? html : `${html.slice(0, SHORT_TEXT_LENGTH)}${isLong ? "..." : ""}`;
  const notesClass = clsx("col-span-2", showAll ? "mb-4" : "mb-2");
  const showMoreClass = "w-full h-[24px] flex justify-center absolute bottom-4 bg-gradient-to-t from-white";

  return (
    <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
      {title && <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
        {title}
      </div>}

      <div className="relative grid w-full grid-cols-[100px_1fr] items-center justify-between px-2 font-normal md:grid-cols-[220px_1fr] md:justify-start md:gap-4 gap-2">
        <div id="ride-notes" className={notesClass}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: displayText }}
        />
        {isLong && (
          <div className={showMoreClass}>
            <Button className="font-light" link onClick={toggleShowAll}>
              {showAll ? "Show less" : "Show more"}
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Viewer;