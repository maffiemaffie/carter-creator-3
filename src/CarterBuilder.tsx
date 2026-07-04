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
import { FEATURE_NAMES, WHITE_CARTER_BASE_COLOR } from "./carter-constants";
import whiteCarter from "./assets/carters/white-carter-base.png";
import ChangeBase from "./components/ChangeBase";

export default function CarterBuilder() {
  const [selectedFeatures, setSelectedFeatures] = useState<CartLayerStack>({});
  const [selectedFeaturesPath, setSelectedFeaturesPath] =
    useState<string>("eyes");
  const [selectedStackSlotName, setSelectedStackSlotName] = useState<
    keyof CartLayerStack | null
  >("eyes");
  const [selectedBase, setSelectedBase] = useState<{
    baseColor: RGBAColor;
    baseUrl: string;
  }>({
    baseColor: WHITE_CARTER_BASE_COLOR,
    baseUrl: whiteCarter,
  });

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
        <div id="main-carter">
          <CarterExample
            baseColor={selectedBase.baseColor}
            baseUrl={selectedBase.baseUrl}
            layers={selectedFeatures}
          />
        </div>
        <div>
          <div>
            <input
              type="button"
              value={"bases"}
              onClick={() => {
                setSelectedFeaturesPath("bases");
                setSelectedStackSlotName(null);
              }}
              disabled={selectedFeaturesPath === "bases"}
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
          </div>
          <div>
            {selectedStackSlotName === null && (
              <ChangeBase onBaseSelect={(base) => setSelectedBase(base)} />
            )}
            {selectedStackSlotName !== null && (
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
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
