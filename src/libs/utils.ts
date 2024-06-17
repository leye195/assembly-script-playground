function generateGaussianKernel(size: number, sigma: number): Float32Array {
  const kernel = new Float32Array(size * size);
  const mean = size / 2;
  let sum = 0.0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value =
        (1.0 / (2.0 * Math.PI * sigma * sigma)) *
        Math.exp(
          -((x - mean) * (x - mean) + (y - mean) * (y - mean)) /
            (2.0 * sigma * sigma),
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

export const gaussianBlur = (
  width: number,
  height: number,
  data: Uint8Array,
  size: number,
  sigma: number,
) => {
  // Define Gaussian kernel
  const kernel = generateGaussianKernel(size, sigma);
  const kernelSize = size;

  const output = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const dx = x + kx - (kernelSize >> 1);
          const dy = y + ky - (kernelSize >> 1);

          if (dx >= 0 && dx < width && dy >= 0 && dy < height) {
            const idx = (dy * width + dx) * 4;
            const k = kernel[ky * kernelSize + kx];

            r += data[idx] * k;
            g += data[idx + 1] * k;
            b += data[idx + 2] * k;
          }
        }
      }

      const outIdx = (y * width + x) * 4;
      output[outIdx] = r;
      output[outIdx + 1] = g;
      output[outIdx + 2] = b;
      output[outIdx + 3] = data[outIdx + 3]; // alpha channel remains unchanged
    }
  }

  return output;
};
