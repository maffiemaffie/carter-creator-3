import { useEffect, useRef } from "react";
import type { CartLayer, CartLayerStack, RGBAColor } from "../cart-layer";
import { loadImage } from "../image-loader";
import { CART_STACK_ORDER } from "../cart-layer";

type CarterExampleProps = {
  baseColor: RGBAColor;
  baseUrl: string;
  layers: CartLayerStack;
};

export default function CarterExample({
  baseColor,
  baseUrl,
  layers,
}: CarterExampleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseImage = useRef<HTMLImageElement>(null);

  const drawBase = () => {
    const base = baseImage.current;

    if (!base) return;
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;

    canvas.width = base.width;
    canvas.height = base.height;
    context.clearRect(0, 0, base.width, base.height);
    context.drawImage(base, 0, 0);
  };

  useEffect(() => {
    const drawOverlay = (layer?: CartLayer) => {
      if (!layer || !baseImage.current) return;

      const { userOffset, overlay } = layer;

      const canvas = canvasRef.current!;
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
    };

    loadImage(baseUrl, (image) => {
      baseImage.current = image;
      drawBase();

      for (const layer of CART_STACK_ORDER) {
        drawOverlay(layers[layer as keyof CartLayerStack]);
      }
    });
  }, [baseUrl, layers, baseColor]);

  return <canvas id="white-carter-example" ref={canvasRef}></canvas>;
}
