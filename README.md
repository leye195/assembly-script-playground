# WebAssembly

## AssemblyScript

- ts 문법 기반으로 WebAssembly를 쉽게 작성 할 수 있도록 해주는 언어로 ts와 유사함,
- js 대신 webassembly 바이너리로 컴파일 됨
- 프론트 개발자가 좀 더 쉽게 assembly 코드를 테스트 할 수 있음
- 웹에서 고성능 애플리케이션을 개발 할 수 있도록 해주며, js보다 빠른 실행속도를 제공할 수 있게 해줌
- 하지만 아직 정식 버전이 안 나옴 현재 0.27.27 버전까지 나옴. 이걸로 뭘 할 수 있을지 고민 좀 해봐야겠음 (간단하게 블러이미지 생성기 만들어볼까?)

### react 프로젝트내 적용 방법

`assemblyScript` 사용을 하기 위해서는 우선 아래 2가지 패키지를 설치해줘야 됨

- assemblyscript
- vite-plugin-wasm: vite인 경우 WebAssembly 모듈을 쉽게 로드하고 사용할 수 있도록 도와주는 플러그인

```
 pnpm i -D assemblyscript vite-plugin-wasm
```

이후 `npx asinit .` 명령을 실행하면 assemblyscript 관련 파일 및 테스트 코드가 자동으로 생성됨

- assembly: AssemblyScript 코드를 작성하는 디렉터리. 기본적으로 index.ts 파일이 포함됨
- tests: 작성한 AssemblyScript의 테스트 코드를 작성하는 디렉터리.
- asconfig.json: AssemblyScript 컴파일러 옵션을 설정하는 파일. 빌드 타겟, 출력 디렉터리 등을 정의할 수 있음
- build: 컴파일된 WebAssembly 바이너리 파일과 JavaScript 래퍼 파일이 저장되는 디렉터리

```
// ex 아래 명령어를 통해 빌드를 실행
npx asc assembly/index.ts
// or
npx asc assembly/index.ts
```

build 후 내부에 아래 파일들이 생성됨

- release.d.ts: Typescript 타입 정의 파일
- release.js: Javascript 인터페이스 파일, 이 파일로 Javascript 코드에서 WebAssembly 모듈을 불러오고 사용 가능
- release.wasm: WebAssembly 바이너리 파일
- release.wasm.map: 소스 맵 파일(디버깅용)로
- release.wat: WebAssembly 바이너리 파일의 텍스트 표현

### wasm 실행하기

생성된 wasm 파일을 실행하는 방법은 다음과 같습니다.

1. release.wasm 바이너리 파일 직접 불러와 사용하기

- wasm 불러오기

```
export interface WasmExports {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  factorial(n: number): number;
  filterEmptyStrings(arr: string[]): number[];
  filterEvenNumbers(arr: number[]): number[];
  filterOddNumbers(arr: number[]): string[];
}

export const loadWasm = async () => {
  try {
    const response = await fetch("../assembly/build/release.wasm");
    const wasmBuffer = await response.arrayBuffer();

    // assembly 인스턴스화
    const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 512, maximum: 1024 }), // 메모리를 더 늘림
        abort: () => console.log("abort called"),
      },
    });
    return wasmModule;
  } catch (error) {
    console.error("Failed to load WebAssembly module:", error);
  }
};

```

- exports한 모듈들을 가져와 활용

```
import {useEffect} from 'react';

// code ...

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
      <p>{wasmModule?.add(1, 2)}</p>
      <p>{wasmModule?.subtract(0, -1)}</p>
      <p>{wasmModule?.multiply(5, 5)}</p>
      <p>{wasmModule?.factorial(22)}</p>
    </div>
  </div>
);

```

2. release.js 파일 사용하기

```
import {useEffect} from 'react';
import * as wasm from '../assembly/build/release';

// code...

useEffect(() => {
  const initWasm = async () => {
    const { add, subtract, multiply } = wasm;
    console.log(add(1, 2), subtract(1, 1), multiply(2, 2));
  };
  initWasm();
},[]);

```

- https://www.assemblyscript.org/
- https://meetup.nhncloud.com/posts/121
