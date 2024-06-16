// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function subtract(a: i32, b: i32): i32 {
  return a - b;
}

export function multiply(a: i32, b: i32): i32 {
  return a * b;
}

export function factorial(n: u32): u32 {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
