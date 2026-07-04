import "./App.css";
import { useRef, useState } from "react";
import CarterExample from "./components/CarterExample";
import type { CartOverlay } from "./cart-layer";
import {
  WHITE_CARTER_BASE_COLOR,
  BLACK_CARTER_BASE_COLOR,
  BROWN_CARTER_BASE_COLOR,
  TAN_CARTER_BASE_COLOR,
  BASE_CARTERS,
} from "./carter-constants";

export default function OverlayEditor() {
  const layerEditorCanvasRef = useRef<HTMLCanvasElement>(null);
  const layerMaskCanvasRef = useRef<HTMLCanvasElement>(null);

  const [overlay, setOverlay] = useState<CartOverlay>();
  const [name, setName] = useState<string>("");

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
    callback: (image: HTMLImageElement) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // for reading the file
    const reader = new FileReader();

    // once the file loads
    reader.onload = (readerEvent) => {
      // create an html image
      const image = new Image();

      // when the image loads, draw to the canvas
      image.onload = () => {
        callback(image);
      };

      // load the image
      image.src = readerEvent.target?.result as string;
    };

    // read the file
    reader.readAsDataURL(file);

    // drawExamples();
  };

  const displayLayer = (image: HTMLImageElement) => {
    if (!layerEditorCanvasRef.current) return;

    const canvas = layerEditorCanvasRef.current;
    const context = canvas.getContext("2d")!;

    canvas.width = image.width;
    canvas.height = image.height;
    // context.fillStyle = "grey";
    // context.fillRect(0, 0, image.width, image.height);
    context.drawImage(image, 0, 0);
    calculateOverlay();
  };

  const displayMask = (image: HTMLImageElement) => {
    if (!layerMaskCanvasRef.current) return;

    const canvas = layerMaskCanvasRef.current;
    const context = canvas.getContext("2d")!;

    canvas.width = image.width;
    canvas.height = image.height;
    // context.fillStyle = "grey";
    // context.fillRect(0, 0, image.width, image.height);
    context.drawImage(image, 0, 0);
    calculateOverlay();
  };

  const round = (num: number) => Math.round(num * 100) / 100;

  const calculateOverlay = () => {
    const colorCanvas = layerEditorCanvasRef.current!;
    const colorImageData = colorCanvas
      .getContext("2d")!
      .getImageData(0, 0, colorCanvas.width, colorCanvas.height);

    const maskCanvas = layerMaskCanvasRef.current!;
    const maskImageData = maskCanvas
      .getContext("2d")!
      .getImageData(0, 0, maskCanvas.width, maskCanvas.height);

    const overlayLayer: CartOverlay = {
      offset: {
        x: 0,
        y: 0,
      },
      multiply: {},
      color: {},
    };

    for (let i = 0; i < colorImageData.data.length; i += 4) {
      if (colorImageData.data[i + 3] === 0) continue;

      if (maskImageData.data[i + 0] === 0) {
        // multiply
        overlayLayer.multiply[i / 4] = {
          r: round(colorImageData.data[i + 0] / WHITE_CARTER_BASE_COLOR.r),
          g: round(colorImageData.data[i + 1] / WHITE_CARTER_BASE_COLOR.g),
          b: round(colorImageData.data[i + 2] / WHITE_CARTER_BASE_COLOR.b),
          a: colorImageData.data[i + 3],
        };
      } else {
        //color
        overlayLayer.color[i / 4] = {
          r: colorImageData.data[i + 0],
          g: colorImageData.data[i + 1],
          b: colorImageData.data[i + 2],
          a: colorImageData.data[i + 3],
        };
      }
    }

    setOverlay(overlayLayer);
  };

  return (
    <>
      <div id="wrapper">
        <div>
          <label htmlFor="carter-upload">Upload Carter: </label>
          <input
            id="carter-upload"
            type="file"
            accept="image/png"
            onChange={(e) => handleImage(e, displayLayer)}
          />
          <label htmlFor="mask-upload">Upload Mask: </label>
          <input
            id="mask-upload"
            type="file"
            accept="image/png"
            onChange={(e) => handleImage(e, displayMask)}
          />
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
          />
          <div id="canvas-container">
            <canvas id="cart-layer-editor" ref={layerEditorCanvasRef}></canvas>
            <canvas id="mask-layer-editor" ref={layerMaskCanvasRef}></canvas>
          </div>
          <input
            type="button"
            value="<"
            onClick={() => {
              if (!overlay) return;
              setOverlay({
                ...overlay,
                offset: {
                  x: overlay.offset.x - 1,
                  y: overlay.offset.y,
                },
              });
            }}
          />
          <input
            type="button"
            value=">"
            onClick={() => {
              if (!overlay) return;
              setOverlay({
                ...overlay,
                offset: {
                  x: overlay.offset.x + 1,
                  y: overlay.offset.y,
                },
              });
            }}
          />
          <input
            type="button"
            value="^"
            onClick={() => {
              if (!overlay) return;
              setOverlay({
                ...overlay,
                offset: {
                  x: overlay.offset.x,
                  y: overlay.offset.y - 1,
                },
              });
            }}
          />
          <input
            type="button"
            value="v"
            onClick={() => {
              if (!overlay) return;
              setOverlay({
                ...overlay,
                offset: {
                  x: overlay.offset.x,
                  y: overlay.offset.y + 1,
                },
              });
            }}
          />

          <div id="carter-examples">
            <CarterExample
              baseColor={WHITE_CARTER_BASE_COLOR}
              baseImage={BASE_CARTERS.white.baseImage}
              layers={{ fx: { userOffset: { x: 0, y: 0 }, overlay: overlay! } }}
            />
            <CarterExample
              baseColor={TAN_CARTER_BASE_COLOR}
              baseImage={BASE_CARTERS.tan.baseImage}
              layers={{ fx: { userOffset: { x: 0, y: 0 }, overlay: overlay! } }}
            />
            <CarterExample
              baseColor={BROWN_CARTER_BASE_COLOR}
              baseImage={BASE_CARTERS.brown.baseImage}
              layers={{ fx: { userOffset: { x: 0, y: 0 }, overlay: overlay! } }}
            />
            <CarterExample
              baseColor={BLACK_CARTER_BASE_COLOR}
              baseImage={BASE_CARTERS.black.baseImage}
              layers={{ fx: { userOffset: { x: 0, y: 0 }, overlay: overlay! } }}
            />
          </div>
        </div>
        <div>
          <a href={`data:application/json;base64,${window.btoa(JSON.stringify({name, overlay}))}`} download={`${name.replaceAll(' ', '-')}.json`}>download json</a>
          overlay:
          <pre>
            {JSON.stringify({
              name,
              overlay,
            })}
          </pre>
        </div>
      </div>
    </>
  );
}
