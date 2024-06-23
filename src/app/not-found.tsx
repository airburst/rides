import { BackButton } from "@/components/Button";
import { CircleQuestionIcon } from "@/components/Icon";
import { MainContent } from "@/components/Layout/MainContent";

const NotFound = () => (
  <MainContent>
    <div className=" text-neutral-800">
      <div className="flex h-64 items-center justify-center text-8xl text-sky-500">
        <CircleQuestionIcon className="fill-teal-500 w-24 h-24" />
      </div>
      <div className="flex items-center p-4 text-center text-2xl text-neutral-700">
        Sorry - we can&apos;t find this page.
      </div>
      <div className="flex items-center justify-center p-4  text-neutral-700">
        <BackButton />
      </div>
    </div>
  </MainContent>
);

export default NotFound;
