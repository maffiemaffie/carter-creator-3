import { useRef, useState } from "react";
import type { CartLayerStack, RGBAColor } from "./cart-layer";
import CarterExample from "./components/CarterExample";

type CopyCarterProps = {
  selectedFeatures: CartLayerStack;
  selectedBase: {
    baseColor: RGBAColor;
    baseImage: HTMLImageElement;
  };
};

export default function CopyCarter({
  selectedFeatures,
  selectedBase: { baseColor, baseImage },
}: CopyCarterProps) {
  const copyRef = useRef<Blob>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const getCopyData = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const start = performance.now();
    const canvas = canvasRef.current;

    if (!canvas) return console.log("wuh oh");

    return new Promise((resolve, reject) => {
      const cropped = getCroppedCanvas(canvas);

      cropped.toBlob(async (blob) => {
        if (blob) {
          copyRef.current = blob;
          resolve(blob);
          return;
        }

        reject("Failed to generate data");
      });
    });
  };

  const getCroppedCanvas = (canvas: HTMLCanvasElement) => {
    const bounds = {
      left: 0,
      right: canvas.width,
      top: 0,
      bottom: canvas.height,
    };

    const context = canvas.getContext("2d")!;

    const canvasImageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const alphaAt = (x: number, y: number) => {
      return 4 * (y * canvas.width + x) + 3;
    };

    mainLoop: for (let x = bounds.left; x < bounds.right; x++) {
      for (let y = 0; y < canvas.height; y++) {
        if (canvasImageData.data[alphaAt(x, y)] !== 0) {
          bounds.left = x;
          break mainLoop;
        }
      }
    }

    mainLoop: for (let x = bounds.right - 1; x > bounds.left; x--) {
      for (let y = 0; y < canvas.height; y++) {
        if (canvasImageData.data[alphaAt(x, y)] !== 0) {
          bounds.right = x;
          break mainLoop;
        }
      }
    }

    mainLoop: for (let y = bounds.top; y < bounds.bottom; y++) {
      for (let x = 0; x < canvas.width; x++) {
        if (canvasImageData.data[alphaAt(x, y)] !== 0) {
          bounds.top = y;
          break mainLoop;
        }
      }
    }

    mainLoop: for (let y = bounds.bottom - 1; y > bounds.top; y--) {
      for (let x = 0; x < canvas.width; x++) {
        if (canvasImageData.data[alphaAt(x, y)] !== 0) {
          bounds.bottom = y;
          break mainLoop;
        }
      }
    }

    const croppedImageData = context.getImageData(
      bounds.left,
      bounds.top,
      bounds.right - bounds.left,
      bounds.bottom - bounds.top,
    );
    canvas.width = bounds.right - bounds.left;
    canvas.height = bounds.bottom - bounds.top;
    context.putImageData(croppedImageData, 0, 0);

    const doubleSizeCanvas = document.createElement("canvas");
    doubleSizeCanvas.width = canvas.width * 2;
    doubleSizeCanvas.height = canvas.height * 2;

    const doubleSizeContext = doubleSizeCanvas.getContext("2d")!;
    doubleSizeContext.imageSmoothingEnabled = false;
    doubleSizeContext.drawImage(
      canvas,
      0,
      0,
      doubleSizeCanvas.width,
      doubleSizeCanvas.height,
    );

    return doubleSizeCanvas;
  };

  const copyCanvas = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = copyRef.current || (await getCopyData());

    // const start = performance.now();
    // const canvas = canvasRef.current;

    // if (!canvas) return console.log("wuh oh");

    // const cropped = getCroppedCanvas(canvas);

    // const isSafari =
    //   /^((?!chrome|chromium|android|crios|fxios|edgios|opr|opera).)*safari/i.test(
    //     navigator.userAgent,
    //   );

    if (!data || (data as Blob).type != "image/png") {
      setCopyStatus("Something went wrong.. :(");
      setTimeout(() => setCopyStatus(null), 1000);
      copyRef.current = null;
      return;
    }

    // if (navigator.clipboard && !isSafari) {
    if (navigator.clipboard) {
      // cropped.toBlob(async (blob) => {
      // if (!data || (data as Blob).type != "image/png") {
      //   setCopyStatus("Something went wrong.. :(");
      //   setTimeout(() => setCopyStatus(null), 1000);
      //   return;
      // }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": data as Blob,
          }),
        ]);

        // console.log(performance.now() - start);
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus(null), 1000);
      } catch {
        setCopyStatus("Something went wrong.. :(");
        setTimeout(() => setCopyStatus(null), 1000);
      }
      // });
    } else {
      const newWindow = window.open("about:blank", "_blank");

      // cropped.toBlob(async (blob) => {
      // if (!data || (data as Blob).type != "image/png" || !newWindow) {
      //   setCopyStatus("Something went wrong.. :(");
      //   setTimeout(() => setCopyStatus(null), 1000);
      //   return;
      // }

      if (!newWindow) {
        setCopyStatus("Something went wrong.. :(");
        setTimeout(() => setCopyStatus(null), 1000);
        copyRef.current = null;
        return;
      }

      const url = URL.createObjectURL(data as Blob);
      newWindow.location.href = url;

      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(null), 1000);
      // });
    }

    copyRef.current = null;
  };

  return (
    <button
      id="copy-carter"
      type="button"
      onMouseEnter={getCopyData}
      onFocus={getCopyData}
      onMouseLeave={() => (copyRef.current = null)}
      onBlur={() => (copyRef.current = null)}
      onClick={copyCanvas}
      disabled={!!copyStatus}
    >
      {copyStatus ?? "Copy Carter!"}
      <div style={{ display: "none" }}>
        <CarterExample
          baseColor={baseColor}
          baseImage={baseImage}
          layers={selectedFeatures}
          externalCanvasRef={canvasRef}
        />
      </div>
    </button>
  );
}
