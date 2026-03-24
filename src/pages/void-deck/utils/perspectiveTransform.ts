type Point = { x: number; y: number };

// Solve 8x8 system using Gaussian elimination
function solve(A: number[][], b: number[]) {
  const n = b.length;

  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }

    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    // Normalize
    const pivot = A[i][i];
    for (let j = i; j < n; j++) A[i][j] /= pivot;
    b[i] /= pivot;

    // Eliminate
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = A[k][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
      b[k] -= factor * b[i];
    }
  }

  return b;
}

// Compute homography matrix
export function getHomography(src: Point[], dst: Point[]) {
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i];
    const { x: u, y: v } = dst[i];

    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);

    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }

  const h = solve(A, b);

  return [
    [h[0], h[1], h[2]],
    [h[3], h[4], h[5]],
    [h[6], h[7], 1],
  ];
}

// Apply inverse homography
export function applyHomography(H: number[][], x: number, y: number) {
  const denom = H[2][0] * x + H[2][1] * y + H[2][2];

  const srcX = (H[0][0] * x + H[0][1] * y + H[0][2]) / denom;
  const srcY = (H[1][0] * x + H[1][1] * y + H[1][2]) / denom;

  return [srcX, srcY];
}