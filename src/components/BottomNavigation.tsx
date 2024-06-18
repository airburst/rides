import { ChevronLeftIcon, CloseIcon, MessageIcon, PlusIcon } from "./Icon";

// https://flowbite.com/docs/components/bottom-navigation/
export const BottomNavigation = () => (
  <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
    <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">

      <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
        <ChevronLeftIcon className="fill-neutral-700 w-5 h-5 mb-2 group-hover:fill-blue-600" />
        <span className="text-sm text-gray-500 group-hover:text-blue-600">BACK</span>
      </button>

      <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <MessageIcon className="fill-neutral-700 w-5 h-5 mb-2 group-hover:fill-blue-600" />
        <span className="text-sm text-gray-500 group-hover:text-blue-600">MESSAGE</span>
      </button>

      <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
        <PlusIcon className="fill-neutral-700 w-5 h-5 mb-2 group-hover:fill-blue-600" />
        <span className="text-sm text-gray-500 group-hover:text-blue-600">JOIN</span>
      </button>

      <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
        <CloseIcon className="fill-neutral-700 w-5 h-5 mb-2 group-hover:fill-blue-600" />
        <span className="text-sm text-gray-500 group-hover:text-blue-600">LEAVE</span>
      </button>
    </div>
  </div>
)