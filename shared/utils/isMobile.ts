export const isMobile = () => {
  // No attached device supports hover
  return typeof window !== "undefined"
    ? window.matchMedia("(any-hover: none)").matches
    : false;
};
