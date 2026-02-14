export type Point = {
  x: number;
  y: number;
};

export type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type CropState = {
  crop: Point;
  zoom: number;
  croppedAreaPixels: Area | null;
};
