"use client";

import type { Area, Point } from "@/types/crop";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

export type ImageCropEditorProps = {
  imageSrc: string;
  onCropComplete: (croppedAreaPixels: Area) => void;
};

const ImageCropEditor = ({ imageSrc, onCropComplete }: ImageCropEditorProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete],
  );

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={handleCropComplete}
        showGrid={true}
        minZoom={1}
        maxZoom={3}
        objectFit="contain"
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <label htmlFor="zoom" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Zoom
          </label>
          <input
            id="zoom"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            aria-label="Zoom slider"
          />
          <span className="text-sm text-gray-600 min-w-[3ch]">{zoom.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCropEditor;
