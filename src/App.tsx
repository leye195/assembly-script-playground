import { useEffect, useState } from "react";
import { WasmExports, loadWasm } from "./loadWasm";
import AssemblyBlur from "./components/AssemblyBlur";
import NormalBlur from "./components/NormalBlur";
import "./App.css";

function App() {
  const [wasmModule, setWasmModule] = useState<WasmExports>();

  useEffect(() => {
    const initWasm = async () => {
      const wasm = await loadWasm();

      if (!wasm) return;

      setWasmModule(wasm.instance.exports as unknown as WasmExports);
    };

    initWasm();
  }, []);

  return (
    <div>
      <h2>WASM Load Test</h2>
      <div>
        <p>Add:{wasmModule?.add(1, 2)}</p>
        <p>Subtract:{wasmModule?.subtract(0, -1)}</p>
        <p>Multiply:{wasmModule?.multiply(5, 5)}</p>
      </div>
      <div>
        <h3>Blur Filter</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>
            <b>assembly:</b> blur image
          </p>
          <AssemblyBlur />
          <br />
          <p>
            <b>ts:</b> blur image
          </p>
          <NormalBlur />
        </div>
      </div>
    </div>
  );
}

export default App;
