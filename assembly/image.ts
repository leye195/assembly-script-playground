function generateGaussianKernel(size: i32, sigma: f32): Float32Array {
  const kernel = new Float32Array(size * size);
  const mean: f32 = f32(size / 2);
  let sum: f32 = 0.0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value: f32 = f32(
        (1.0 / (2.0 * Mathf.PI * sigma * sigma)) *
          Mathf.exp(
            -(
              (f32(x) - mean) * (f32(x) - mean) +
              (f32(y) - mean) * (f32(y) - mean)
            ) /
              (2.0 * sigma * sigma),
          ),
      );
      kernel[y * size + x] = value;
      sum += value;
    }
  }

  // Normalize the kernel
  for (let i = 0; i < kernel.length; i++) {
    kernel[i] /= sum;
  }

  return kernel;
}
export function gaussianBlur(
  width: i32,
  height: i32,
  data: Uint8Array,
  size: i32,
  sigma: f32,
): Uint8Array {
  // Define Gaussian kernel
  const kernel = generateGaussianKernel(size, sigma);
  const kernelSize = size;
  // const kernelSum: f32 = 1.0; // 이미 정규화되었으므로 1.0으로 설정

  const output = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r: f32 = 0;
      let g: f32 = 0;
      let b: f32 = 0;

      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const dx = x + kx - (kernelSize >> 1);
          const dy = y + ky - (kernelSize >> 1);

          if (dx >= 0 && dx < width && dy >= 0 && dy < height) {
            const idx = (dy * width + dx) * 4;
            const k = kernel[ky * kernelSize + kx];

            r += f32(data[idx]) * k;
            g += f32(data[idx + 1]) * k;
            b += f32(data[idx + 2]) * k;
          }
        }
      }

      const outIdx = (y * width + x) * 4;
      output[outIdx] = u8(r);
      output[outIdx + 1] = u8(g);
      output[outIdx + 2] = u8(b);
      output[outIdx + 3] = data[outIdx + 3]; // alpha channel remains unchanged
    }
  }

  return output;
}
