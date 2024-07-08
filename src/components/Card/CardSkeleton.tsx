import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const CardSkeleton = () => (
  <div className="md:mx-auto text-neutral-600 box-border flex w-full cursor-pointer gap-2 rounded bg-white shadow-md hover:text-neutral-700 hover:shadow-lg md:gap-2">
    <div className="grid w-full grid-cols-[auto_1fr_68px] pl-1">
      <div className="col-span-2 p-1 font-bold uppercase tracking-wide">
        <Skeleton />
      </div>
      <div className="justify-self-center" />

      <div className="p-1 font-bold tracking-wide text-neutral-600">00:00</div>
      <div className="p-1">
        <Skeleton />{" "}
      </div>
      <div className="flex flex-row items-center justify-center gap-1 p-1">
        <Image
          src="/static/images/biking-neutral-500-64.png"
          width={16}
          height={16}
          alt="Number of riders"
        />
        <span className="text-xl font-bold">0</span>
      </div>
    </div>
  </div>
);
