import { useState } from "react";
import FeatureBook from "./components/FeatureBook";
import {
  CART_STACK_ORDER,
  type CartLayerStack,
  type CartOverlay,
  type Offset,
  type RGBAColor,
} from "./cart-layer";
import CarterExample from "./components/CarterExample";
import { BASE_CARTERS, FEATURE_NAMES } from "./carter-constants";
import ChangeBase from "./components/ChangeBase";

export default function CarterBuilder() {
  const [selectedFeatures, setSelectedFeatures] = useState<CartLayerStack>({});
  const [selectedFeaturesPath, setSelectedFeaturesPath] = useState<
    string | null
  >(null);
  const [selectedStackSlotName, setSelectedStackSlotName] = useState<
    keyof CartLayerStack | null
  >(null);
  const [selectedBase, setSelectedBase] = useState<{
    baseColor: RGBAColor;
    baseImage: HTMLImageElement;
  }>(BASE_CARTERS.white);

  const setStackLayer = (
    slotName: keyof CartLayerStack,
    newOverlay?: CartOverlay,
  ) => {
    setSelectedFeatures({
      ...selectedFeatures,
      [slotName]: {
        userOffset: selectedFeatures[slotName]?.userOffset ?? { x: 0, y: 0 },
        overlay: newOverlay,
      },
    });
  };

  const updateFeaturePosition = (
    slotName: keyof CartLayerStack,
    newPosition: Offset,
  ) => {
    setSelectedFeatures({
      ...selectedFeatures,
      [slotName]: {
        ...selectedFeatures[slotName],
        userOffset: newPosition,
      },
    });
  };

  return (
    <>
      <div id="carter-builder">
        <h1>Carter Creator 3 1.0.0-alpha</h1>
        <div id="main-carter">
          <CarterExample
            baseColor={selectedBase.baseColor}
            baseImage={selectedBase.baseImage}
            layers={selectedFeatures}
          />
        </div>
        <nav>
          <input
            type="button"
            value={"bases"}
            onClick={() => {
              setSelectedFeaturesPath(null);
              setSelectedStackSlotName(null);
            }}
            disabled={selectedStackSlotName === null}
          />
          {CART_STACK_ORDER.map((feature) => (
            <input
              key={feature}
              type="button"
              value={FEATURE_NAMES[feature].path}
              onClick={() => {
                setSelectedFeaturesPath(FEATURE_NAMES[feature].path);
                setSelectedStackSlotName(
                  FEATURE_NAMES[feature].slotName as keyof CartLayerStack,
                );
              }}
              disabled={
                selectedStackSlotName === FEATURE_NAMES[feature].slotName
              }
            />
          ))}
        </nav>
        <form id="features-book">
          {selectedStackSlotName === null && (
            <ChangeBase onBaseSelect={(base) => setSelectedBase(base)} />
          )}
          {selectedStackSlotName !== null && selectedFeaturesPath !== null && (
            <FeatureBook
              featuresPath={selectedFeaturesPath}
              stackSlotName={selectedStackSlotName}
              userOffset={
                selectedFeatures[selectedStackSlotName]?.userOffset ?? {
                  x: 0,
                  y: 0,
                }
              }
              onFeatureSelect={(overlay) =>
                setStackLayer(selectedStackSlotName, overlay)
              }
              onUpdatePosition={(newPosition) =>
                updateFeaturePosition(selectedStackSlotName, newPosition)
              }
              baseColor={selectedBase.baseColor}
              baseImage={selectedBase.baseImage}
            />
          )}
        </form>
      </div>
    </>
  );
}
