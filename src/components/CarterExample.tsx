import { useEffect, useRef, type RefObject } from "react";
import type { CartLayerStack, RGBAColor } from "../cart-layer";
import { CART_STACK_ORDER } from "../cart-layer";

type CarterExampleProps = {
  baseColor: RGBAColor;
  baseImage: HTMLImageElement;
  layers: CartLayerStack;
  externalCanvasRef?: RefObject<HTMLCanvasElement | null>;
};

export default function CarterExample({
  baseColor,
  baseImage,
  layers,
  externalCanvasRef,
}: CarterExampleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawBase = () => {
      const base = baseImage;

      if (!base) return;
      const canvas = externalCanvasRef?.current ?? canvasRef.current!;
      const context = canvas.getContext("2d")!;

      canvas.width = base.width;
      canvas.height = base.height;
      context.clearRect(0, 0, base.width, base.height);
      context.drawImage(base, 0, 0);
    };

    drawBase();

    for (const name of CART_STACK_ORDER) {
      const layer = layers[name as keyof CartLayerStack];
      if (!layer || !baseImage || !layer.overlay) continue;

      const { userOffset, overlay } = layer;

      const canvas = externalCanvasRef?.current ?? canvasRef.current!;
      const context = canvas.getContext("2d")!;

      const overlayCanvas = document.createElement("canvas");
      overlayCanvas.width = canvas.width;
      overlayCanvas.height = canvas.height;

      const overlayContext = overlayCanvas.getContext("2d")!;

      const overlayImageData = overlayContext.getImageData(
        0,
        0,
        overlayCanvas.width,
        overlayCanvas.height,
      );

      for (let i = 0; i < overlayImageData.data.length; i += 4) {
        if (!overlay.multiply[i / 4]) continue;
        overlayImageData.data[i + 0] = baseColor.r * overlay.multiply[i / 4].r;
        overlayImageData.data[i + 1] = baseColor.g * overlay.multiply[i / 4].g;
        overlayImageData.data[i + 2] = baseColor.b * overlay.multiply[i / 4].b;
        overlayImageData.data[i + 3] = baseColor.a * overlay.multiply[i / 4].a;
      }

      for (let i = 0; i < overlayImageData.data.length; i += 4) {
        if (!overlay.color[i / 4]) continue;
        overlayImageData.data[i + 0] = overlay.color[i / 4].r;
        overlayImageData.data[i + 1] = overlay.color[i / 4].g;
        overlayImageData.data[i + 2] = overlay.color[i / 4].b;
        overlayImageData.data[i + 3] = overlay.color[i / 4].a;
      }

      overlayContext.putImageData(
        overlayImageData,
        overlay.offset.x + userOffset.x,
        overlay.offset.y + userOffset.y,
      );

      context.drawImage(
        overlayCanvas,
        0,
        0,
        overlayCanvas.width,
        overlayCanvas.height,
      );
    }
  }, [baseImage, layers, baseColor, externalCanvasRef]);

  return (
    <canvas
      id="white-carter-example"
      ref={externalCanvasRef ?? canvasRef}
    ></canvas>
  );
}
