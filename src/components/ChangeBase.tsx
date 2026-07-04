import type { RGBAColor } from "../cart-layer";
import { BASE_CARTERS } from "../carter-constants";
import CarterExample from "./CarterExample";

type ChangeBaseProps = {
  onBaseSelect: (base: { baseUrl: string; baseColor: RGBAColor }) => void;
};

export default function ChangeBase({ onBaseSelect }: ChangeBaseProps) {
  return (
    <div className="feature-page">
      {Object.values(BASE_CARTERS).map((base) => (
        <button type="button" onClick={() => onBaseSelect(base)}>
          <CarterExample
            baseColor={base.baseColor}
            baseUrl={base.baseUrl}
            layers={{}}
            key={base.baseUrl}
          />
          {/* <br />
            {feature.name} */}
        </button>
      ))}
    </div>
  );
}
