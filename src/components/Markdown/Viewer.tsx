import markdownIt from "markdown-it";
import "./markdown.css";

export type ViewerProps = {
  markdown?: string;
  title?: string;
};

const Viewer = ({ markdown, title }: ViewerProps) => {
  const md = new markdownIt({
    html: true,
    linkify: true,
    typographer: true
  });
  const html = md.render(markdown ?? "");

  return (
    <div className="flex w-full flex-col gap-2 rounded bg-white py-2 shadow-md">
      {title && <div className="px-2 text-xl font-bold tracking-wide text-neutral-700">
        {title}
      </div>}

      <div className="grid w-full grid-cols-[100px_1fr] items-center justify-between px-2 font-medium md:grid-cols-[220px_1fr] md:justify-start md:gap-4 gap-2">
        <div id="ride-notes" className="col-span-2"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export default Viewer;