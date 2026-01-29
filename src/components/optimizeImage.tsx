"use client";

import NextImage, { ImageProps } from "next/image";
import { forwardRef } from "react";

const OptimizedImage = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  return <NextImage {...props} unoptimized ref={ref} />;
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage
