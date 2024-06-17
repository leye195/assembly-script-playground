import { SyntheticEvent, useCallback, useState } from "react";
import * as wasm from "../../assembly/build/release";

const AssemblyBlur = () => {
  const [blurData, setBlurData] = useState<string | undefined>();

  const handleBlur = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      if (blurData) return;

      console.time("assembly blur time");
      const { src } = e.currentTarget;

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = src;

      img.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { width, height, data } = imageData;

        const uint8ArrayData = new Uint8Array(data.slice());

        const blurData = wasm.gaussianBlur(
          width,
          height,
          uint8ArrayData,
          20,
          5,
        );

        for (let i = 0; i < data.length; i++) {
          imageData.data[i] = blurData[i];
        }
        ctx.putImageData(imageData, 0, 0);

        const dataURL = canvas.toDataURL();
        setBlurData(dataURL);
        console.timeEnd("assembly blur time");
      });
    },
    [blurData],
  );

  return (
    <img
      src={
        blurData ??
        "https://plus.unsplash.com/premium_photo-1718285552243-85861ac9e179?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%20870w"
      }
      onLoad={handleBlur}
    />
  );
};

export default AssemblyBlur;
