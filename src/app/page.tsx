import { MainContent } from "@/components";

export default function HomePage() {
  return (
    <MainContent>
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          No planned rides before
        </div>
      </div>
    </MainContent>
  );
}
