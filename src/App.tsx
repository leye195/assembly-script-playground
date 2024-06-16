import { useCallback, useEffect, useState } from "react";
import * as wasm from "../assembly/build/release";
import { WasmExports, loadWasm } from "./loadWasm";
import "./App.css";

function App() {
  const [wasmModule, setWasmModule] = useState<WasmExports>();
  const [blurData, setBlurData] = useState("");

  const handleBlurFilter = useCallback(async () => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src =
      "https://plus.unsplash.com/premium_photo-1718285552243-85861ac9e179?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%20870w";

    img.addEventListener("load", async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { width, height, data } = imageData;

      const uint8ArrayData = new Uint8Array(data.slice());

      const blurData = wasm.gaussianBlur(width, height, uint8ArrayData, 15, 5);

      for (let i = 0; i < data.length; i++) {
        imageData.data[i] = blurData[i];
      }
      ctx.putImageData(imageData, 0, 0);

      const dataURL = canvas.toDataURL();
      setBlurData(dataURL);
    });
  }, []);

  useEffect(() => {
    const initWasm = async () => {
      const wasm = await loadWasm();

      if (!wasm) return;

      setWasmModule(wasm.instance.exports as unknown as WasmExports);
    };

    initWasm();
  }, []);

  useEffect(() => {
    handleBlurFilter();
  }, [wasmModule, handleBlurFilter]);

  return (
    <div>
      <h2>WASM Load Test</h2>
      <div>
        <p>Add:{wasmModule?.add(1, 2)}</p>
        <p>Subtract:{wasmModule?.subtract(0, -1)}</p>
        <p>Multiply:{wasmModule?.multiply(5, 5)}</p>
        <p>Factorial;{wasmModule?.factorial(22)}</p>
      </div>
      <div>
        <h3>Blur Filter</h3>
        <div>
          <p>origin image</p>
          <img src="https://plus.unsplash.com/premium_photo-1718285552243-85861ac9e179?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%20870w" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>blur image</p>
          {blurData && (
            <>
              <p
                style={{
                  maxWidth: "60vw",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {blurData}
              </p>
              <img src={blurData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
