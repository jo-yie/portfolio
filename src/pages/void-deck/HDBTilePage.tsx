import React, { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Circle } from "react-konva";
import { getHomography, applyHomography } from "./utils/perspectiveTransform";
import { Line } from "react-konva";

type Point = { x: number; y: number };

const TILE_SIZE = 256;

export default function HDBTilePage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [points, setPoints] = useState<Point[]>([
		{ x: 50, y: 50 },
		{ x: 200, y: 50 },
		{ x: 200, y: 200 },
		{ x: 50, y: 200 },
	]);
  const [tiles, setTiles] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load image
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
		img.onload = () => {
			setImage(img);

			// create centered square
			const margin = 50;
			setPoints([
				{ x: margin, y: margin },
				{ x: img.width - margin, y: margin },
				{ x: img.width - margin, y: img.height - margin },
				{ x: margin, y: img.height - margin },
			]);
		};
  };

  // Capture clicks
  // const handleClick = (e: any) => {
  //   if (points.length >= 4) return;

  //   const stage = e.target.getStage();
  //   const pos = stage.getPointerPosition();

  //   if (!pos) return;

  //   setPoints([...points, pos]);
  // };

	const extractTile = () => {
		if (!image || points.length !== 4) return;
		if (!canvasRef.current) return;

		const ctx = canvasRef.current.getContext("2d");
		if (!ctx) return;

		const canvas = canvasRef.current;
		canvas.width = TILE_SIZE;
		canvas.height = TILE_SIZE;

		// 🔥 Sort points (CRITICAL)
		const sortPoints = (pts: Point[]) => {
			const sorted = [...pts].sort((a, b) => a.y - b.y);
			const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
			const bottom = sorted.slice(2, 4).sort((a, b) => a.x - b.x);

			return [
				top[0],
				top[1],
				bottom[1],
				bottom[0],
			];
		};

		const ordered = sortPoints(points);

		const src = ordered;

		const dst = [
			{ x: 0, y: 0 },
			{ x: TILE_SIZE, y: 0 },
			{ x: TILE_SIZE, y: TILE_SIZE },
			{ x: 0, y: TILE_SIZE },
		];

		const H = getHomography(dst, src); 
		// NOTE: mapping FROM output → input

		// Draw original image to temp canvas
		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = image.width;
		tempCanvas.height = image.height;
		const tempCtx = tempCanvas.getContext("2d")!;
		tempCtx.drawImage(image, 0, 0);

		const srcData = tempCtx.getImageData(0, 0, image.width, image.height);
		const destData = ctx.createImageData(TILE_SIZE, TILE_SIZE);

		for (let y = 0; y < TILE_SIZE; y++) {
			for (let x = 0; x < TILE_SIZE; x++) {

				const [sx, sy] = applyHomography(H, x, y);

				// const ix = Math.floor(sx);
				// const iy = Math.floor(sy);
				const ix = Math.round(sx);
				const iy = Math.round(sy);

				if (
					ix >= 0 &&
					ix < image.width &&
					iy >= 0 &&
					iy < image.height
				) {
					const srcIndex = (iy * image.width + ix) * 4;
					const destIndex = (y * TILE_SIZE + x) * 4;

					destData.data[destIndex] = srcData.data[srcIndex];
					destData.data[destIndex + 1] = srcData.data[srcIndex + 1];
					destData.data[destIndex + 2] = srcData.data[srcIndex + 2];
					destData.data[destIndex + 3] = 255;
				}
			}
		}

		ctx.putImageData(destData, 0, 0);

		const dataUrl = canvas.toDataURL();
		setTiles(prev => [...prev, dataUrl]);
		// setPoints([]);
	};

  return (
    <div style={{ padding: "20px" }}>
      <h1>HDB Tile Generator</h1>

      <input type="file" onChange={handleUpload} />

      {image && (
        <>
          <Stage
            width={image.width}
            height={image.height}
            // onClick={handleClick}
          >
						<Layer>
							<KonvaImage image={image} />

							{/* Selection polygon */}
							<Line
								points={points.flatMap(p => [p.x, p.y])}
								stroke="yellow"
								strokeWidth={2}
								closed
							/>

							{/* Draggable corner points */}
							{points.map((p, i) => (
								<Circle
									key={i}
									x={p.x}
									y={p.y}
									radius={8}
									fill="red"
									draggable
									onDragMove={(e) => {
										const newPoints = [...points];
										newPoints[i] = {
											x: e.target.x(),
											y: e.target.y(),
										};
										setPoints(newPoints);
									}}
								/>
							))}
						</Layer>
          </Stage>

          <button onClick={extractTile} className="btn btn-blue">
            Generate Tile
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <h2>Mosaic</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {tiles.map((t, i) => (
          <img key={i} src={t} width={100} height={100} />
        ))}
      </div>
    </div>
  );
}