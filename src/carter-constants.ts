import type { CartLayerStack, RGBAColor } from "./cart-layer";
import whiteCarter from "./assets/carters/white-carter-base.png";
import tanCarter from "./assets/carters/tan-carter-base.png";
import brownCarter from "./assets/carters/brown-carter-base.png";
import blackCarter from "./assets/carters/black-carter-base.png";
import { loadImagePromise } from "./image-loader";

export const WHITE_CARTER_BASE_COLOR = Object.freeze({
  r: 221,
  g: 196,
  b: 169,
  a: 255,
});

export const TAN_CARTER_BASE_COLOR = Object.freeze({
  r: 213,
  g: 171,
  b: 136,
  a: 255,
});

export const BROWN_CARTER_BASE_COLOR = Object.freeze({
  r: 175,
  g: 126,
  b: 87,
  a: 255,
});

export const BLACK_CARTER_BASE_COLOR = Object.freeze({
  r: 124,
  g: 83,
  b: 62,
  a: 255,
});

export const BASE_CARTER_IMAGES: {
  [key: string]: HTMLImageElement;
} = Object.freeze({
  white: await loadImagePromise(whiteCarter),
  tan: await loadImagePromise(tanCarter),
  brown: await loadImagePromise(brownCarter),
  black: await loadImagePromise(blackCarter),
});

export const BASE_CARTERS: {
  [key: string]: {
    baseColor: RGBAColor;
    baseImage: HTMLImageElement;
    baseName: string;
  };
} = Object.freeze({
  white: {
    baseColor: WHITE_CARTER_BASE_COLOR,
    baseImage: BASE_CARTER_IMAGES.white,
    baseName: "white carter"
  },
  tan: {
    baseColor: TAN_CARTER_BASE_COLOR,
    baseImage: BASE_CARTER_IMAGES.tan,
    baseName: "tan carter"
  },
  brown: {
    baseColor: BROWN_CARTER_BASE_COLOR,
    baseImage: BASE_CARTER_IMAGES.brown,
    baseName: "brown carter"
  },
  black: {
    baseColor: BLACK_CARTER_BASE_COLOR,
    baseImage: BASE_CARTER_IMAGES.black,
    baseName: "black carter"
  },
});

export const FEATURE_NAMES: {
  [key: string]: {
    path: string;
    slotName: keyof CartLayerStack;
  };
} = Object.freeze({
  eyes: {
    path: "eyes",
    slotName: "eyes",
  },
  mouth: {
    path: "mouths",
    slotName: "mouth",
  },
  eyebrows: {
    path: "eyebrows",
    slotName: "eyebrows",
  },
  glasses: {
    path: "glasses",
    slotName: "glasses",
  },
  hair: {
    path: "hairstyles",
    slotName: "hair",
  },
  hands: {
    path: "hands",
    slotName: "hands",
  },
  blush: {
    path: "blush",
    slotName: "blush",
  },
  fx: {
    path: "fx",
    slotName: "fx",
  },
  hat: {
    path: "hats",
    slotName: "hat",
  },
  mustache: {
    path: "mustaches",
    slotName: "mustache",
  },
});
