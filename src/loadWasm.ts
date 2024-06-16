export interface WasmExports {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  factorial(n: number): number;
  filterEmptyStrings(arr: string[]): number[];
  filterEvenNumbers(arr: number[]): number[];
  filterOddNumbers(arr: number[]): string[];
  gaussianBlur(width: number, height: number, data: Uint8Array): number[];
}

export const loadWasm = async () => {
  try {
    const response = await fetch("../assembly/build/release.wasm");
    const wasmBuffer = await response.arrayBuffer();

    // assembly 인스턴스화
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 1024, maximum: 2048 }),
        abort: () => console.log("abort called"),
      },
    });
    return wasmModule;
  } catch (error) {
    console.error("Failed to load WebAssembly module:", error);
  }
};
