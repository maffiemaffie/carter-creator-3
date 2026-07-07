import { useEffect, useState } from "react";
import {
  type CartFeature,
  type CartLayerStack,
  type CartOverlay,
  type Offset,
} from "../cart-layer";
import CarterExample from "./CarterExample";
import { BASE_CARTERS, WHITE_CARTER_BASE_COLOR } from "../carter-constants";

type FeatureBookProps = {
  featuresPath: string;
  stackSlotName: keyof CartLayerStack;
  userOffset: Offset;
  onFeatureSelect: (overlay: CartOverlay) => void;
  onUpdatePosition: (offset: Offset) => void;
};

export default function FeatureBook({
  featuresPath,
  stackSlotName,
  userOffset,
  onFeatureSelect,
  onUpdatePosition,
}: FeatureBookProps) {
  const [features, setFeatures] = useState<CartFeature[]>([]);
  const [page, setPage] = useState<number>(0);

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
        <input type="button" value="◀️" onClick={() => shiftFeature("left")} />
        <input type="button" value="▶️" onClick={() => shiftFeature("right")} />
        <input type="button" value="🔼" onClick={() => shiftFeature("up")} />
        <input type="button" value="🔽" onClick={() => shiftFeature("down")} />
      </fieldset>
      <fieldset id="page-tabs">
        {Array.from({ length: Math.ceil(features.length / 9) }).map(
          (_, index) => (
            <input
              key={index + 1}
              type="button"
              value={index + 1}
              onClick={() => setPage(index)}
              disabled={page === index}
            />
          ),
        )}
      </fieldset>
      <div className="feature-page">
        {features.slice(page * 9, (page + 1) * 9).map((feature) => (
          <button
            key={feature.name}
            type="button"
            onClick={() => onFeatureSelect(feature.overlay)}
          >
            <CarterExample
              baseColor={WHITE_CARTER_BASE_COLOR}
              baseImage={BASE_CARTERS.white.baseImage}
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
    </>
  );
}
