import { useState } from "react";
import type { RGBAColor } from "../cart-layer";
import { BASE_CARTERS } from "../carter-constants";
import CarterExample from "./CarterExample";

type ChangeBaseProps = {
  onBaseSelect: (base: {
    baseImage: HTMLImageElement;
    baseColor: RGBAColor;
  }) => void;
};

export default function ChangeBase({ onBaseSelect }: ChangeBaseProps) {
  const [bookOpen, setBookOpen] = useState<boolean>(false);

  return (
    <>
      <input
        id="open-book"
        type="button"
        value="select base..."
        onClick={() => setBookOpen(true)}
      />
      <fieldset id="feature-select" className={bookOpen ? "open" : undefined}>
        <div className="feature-select-header">
          Select Base:
          <input
            type="button"
            value="back"
            onClick={() => setBookOpen(false)}
          />
        </div>
        <div className="feature-page">
          {Object.values(BASE_CARTERS).map((base) => (
            <button
              key={base.baseImage.src}
              type="button"
              onClick={() => {
                setBookOpen(false);
                onBaseSelect(base);
              }}
            >
              <CarterExample
                baseColor={base.baseColor}
                baseImage={base.baseImage}
                layers={{}}
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
