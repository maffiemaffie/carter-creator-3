import { useEffect, useState } from "react";
import FeatureBook from "./components/FeatureBook";
import {
  CART_STACK_ORDER,
  type CartFeature,
  type CartLayerStack,
  type CartOverlay,
  type Offset,
  type RGBAColor,
} from "./cart-layer";
import CarterExample from "./components/CarterExample";
import { BASE_CARTERS, FEATURE_NAMES } from "./carter-constants";
import ChangeBase from "./components/ChangeBase";
import CopyCarter from "./CopyCarter";

export default function CarterBuilder() {
  const title = "Carter Creator 3 2.2.0-alpha";

  const [allFeatures, setAllFeatures] =
    useState<Record<string, CartFeature[]>>();
  const [openNavbar, setOpenNavbar] = useState<boolean>(false);
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

  useEffect(() => {
    const loadFeatures = async () => {
      // const loadedFeatures = [
      //   {
      //     name: "none",
      //     overlay: {
      //       offset: { x: 0, y: 0 },
      //       multiply: {},
      //       color: {},
      //     },
      //   },
      // ];

      const loadedFeatures: Record<string, CartFeature[]> = {};

      console.log("Locating features file...");

      const importFunction = import.meta.glob(
        "./assets/features/features.json",
      );

      console.log("Features file located: ", importFunction);
      console.log("Importing features...")


      const imported = (await importFunction[
        `./assets/features/features.json`
      ]()) as { default: Record<string, CartFeature[]> };

      console.log("Features imported: ", imported);

      for (const [category, features] of Object.entries(imported.default)) {
        console.log(`Organizing ${category}...`)

        loadedFeatures[category] = [
          {
            name: "none",
            overlay: {
              offset: { x: 0, y: 0 },
              multiply: {},
              color: {},
            },
          },
          ...features,
        ];
      }

      console.log("All features loaded successfully");

      setAllFeatures(loadedFeatures);
    };

    loadFeatures();
  }, []);

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

  // console.log(allFeatures);
  if (!allFeatures)
    return (
      <>
        <h1>{title}</h1>
        <div id="carter-builder">Loading carters...</div>
      </>
    );

  return (
    <>
      <main id="carter-builder">
        <h1>{title}</h1>
        <div id="main-carter">
          <CarterExample
            baseColor={selectedBase.baseColor}
            baseImage={selectedBase.baseImage}
            layers={selectedFeatures}
          />
          <CopyCarter
            selectedBase={selectedBase}
            selectedFeatures={selectedFeatures}
          />
        </div>
        <button id="open-nav" onClick={() => setOpenNavbar(true)}>
          select category..
        </button>
        <nav className={openNavbar ? "open" : undefined}>
          <button
            type="button"
            aria-label="bases"
            id="bases-button"
            onClick={() => {
              setSelectedFeaturesPath(null);
              setSelectedStackSlotName(null);
              setOpenNavbar(false);
            }}
            disabled={selectedStackSlotName === null}
          >
            bases
          </button>
          {CART_STACK_ORDER.map((feature) => (
            <button
              key={feature}
              aria-label={feature}
              id={`${feature}-button`}
              type="button"
              onClick={() => {
                setSelectedFeaturesPath(FEATURE_NAMES[feature].path);
                setSelectedStackSlotName(
                  FEATURE_NAMES[feature].slotName as keyof CartLayerStack,
                );
                setOpenNavbar(false);
              }}
              disabled={
                selectedStackSlotName === FEATURE_NAMES[feature].slotName
              }
            >
              {FEATURE_NAMES[feature].path}
            </button>
          ))}
        </nav>
        <form id="features-book">
          {selectedStackSlotName === null && (
            <ChangeBase onBaseSelect={(base) => setSelectedBase(base)} />
          )}
          {selectedStackSlotName !== null && selectedFeaturesPath !== null && (
            <FeatureBook
              features={allFeatures[selectedFeaturesPath]}
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
      </main>
    </>
  );
}
