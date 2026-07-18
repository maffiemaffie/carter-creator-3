import { useEffect, useState } from "react";
import {
  type CartFeature,
  type CartLayerStack,
  type CartOverlay,
  type Offset,
  type RGBAColor,
} from "../cart-layer";
import CarterExample from "./CarterExample";

type FeatureBookProps = {
  featuresPath: string;
  stackSlotName: keyof CartLayerStack;
  userOffset: Offset;
  onFeatureSelect: (overlay: CartOverlay) => void;
  onUpdatePosition: (offset: Offset) => void;
  baseColor: RGBAColor;
  baseImage: HTMLImageElement;
};

export default function FeatureBook({
  featuresPath,
  stackSlotName,
  userOffset,
  onFeatureSelect,
  onUpdatePosition,
  baseColor,
  baseImage,
}: FeatureBookProps) {
  const [features, setFeatures] = useState<CartFeature[]>([]);
  const [page, setPage] = useState<number>(0);
  const [bookOpen, setBookOpen] = useState<boolean>(false);

  const featuresPerPage = 9;

  useEffect(() => {
    const loadFeatures = async () => {
      const loadedFeatures = [
        {
          name: "none",
          overlay: {
            offset: { x: 0, y: 0 },
            multiply: {},
            color: {},
          },
        },
      ];

      const allFeatures = import.meta.glob("../assets/features/*.json");

      const features = (await allFeatures[
        `../assets/features/${featuresPath}.json`
      ]()) as { default: CartFeature[] };

      loadedFeatures.push(...features.default);

      setFeatures(loadedFeatures);
      setPage(0);
      setBookOpen(true);
    };

    loadFeatures();
  }, [featuresPath]);

  const shiftFeature = (direction: "up" | "down" | "left" | "right") => {
    const xOffset = {
      up: 0,
      down: 0,
      left: -1,
      right: 1,
    }[direction];

    const yOffset = {
      up: -1,
      down: 1,
      left: 0,
      right: 0,
    }[direction];

    onUpdatePosition({
      x: userOffset.x + xOffset,
      y: userOffset.y + yOffset,
    });
  };

  return (
    <>
      <fieldset id="offset-buttons">
        <legend>Move {stackSlotName}:</legend>
        <button type="button" onClick={() => shiftFeature("left")}>
          ◀️
        </button>
        <button type="button" onClick={() => shiftFeature("right")}>
          ▶️
        </button>
        <button type="button" onClick={() => shiftFeature("up")}>
          🔼
        </button>
        <button type="button" onClick={() => shiftFeature("down")}>
          🔽
        </button>
      </fieldset>
      <input id="open-book" type="button" value={`select ${stackSlotName}...`} onClick={() => setBookOpen(true)} />
      <fieldset id="feature-select" className={bookOpen ? "open" : undefined}>
        <div className="feature-select-header">
          Select {stackSlotName}:
          <input type="button" value="back" onClick={() => setBookOpen(false)} />
        </div>
        <fieldset id="page-tabs">
          <legend>Page:</legend>
          {Array.from({
            length: Math.ceil(features.length / featuresPerPage),
          }).map((_, index) => (
            <input
              key={index + 1}
              type="button"
              value={index + 1}
              onClick={() => setPage(index)}
              disabled={page === index}
            />
          ))}
        </fieldset>
        <div className="feature-page">
          {features
            .slice(page * featuresPerPage, (page + 1) * featuresPerPage)
            .map((feature) => (
              <button
                key={feature.name}
                type="button"
                onClick={() => {
                  setBookOpen(false);
                  onFeatureSelect(feature.overlay);
                }}
              >
                <CarterExample
                  baseColor={baseColor}
                  baseImage={baseImage}
                  layers={{
                    [stackSlotName]: {
                      userOffset,
                      overlay: feature.overlay,
                    },
                  }}
                  key={feature.name}
                />
                {/* <br />
            {feature.name} */}
              </button>
            ))}
        </div>
      </fieldset>
    </>
  );
}
