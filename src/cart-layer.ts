export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type CartOverlay = {
  offset: Offset;
  multiply: {
    [key: number]: RGBAColor;
  };
  color: {
    [key: number]: RGBAColor;
  };
};

export type Offset = {
  x: number;
  y: number;
};

export type CartLayer = {
  overlay: CartOverlay;
  userOffset: Offset;
}

export type CartLayerStack = {
  hair?: CartLayer;
  hat?: CartLayer;
  blush?: CartLayer;
  eyebrows?: CartLayer;
  mouth?: CartLayer;
  mustache?: CartLayer;
  eyes?: CartLayer;
  fx?: CartLayer;
  glasses?: CartLayer;
  hands?: CartLayer;
};

export const CART_STACK_ORDER = Object.freeze([
  "hair",
  "hat",
  "blush",
  "mouth",
  "mustache",
  "eyes",
  "eyebrows",
  "fx",
  "glasses",
  "hands",
]);

export type CartFeature = {
  name: string;
  overlay: CartOverlay;
};
