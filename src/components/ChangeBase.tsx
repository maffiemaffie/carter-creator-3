import type { RGBAColor } from "../cart-layer";
import { BASE_CARTERS } from "../carter-constants";
import CarterExample from "./CarterExample";

type ChangeBaseProps = {
  onBaseSelect: (base: { baseImage: HTMLImageElement; baseColor: RGBAColor }) => void;
};

export default function ChangeBase({ onBaseSelect }: ChangeBaseProps) {
  return (
    <div className="feature-page">
      {Object.values(BASE_CARTERS).map((base) => (
        <button
          key={base.baseImage.src}
          type="button"
          onClick={() => onBaseSelect(base)}
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
  );
}
