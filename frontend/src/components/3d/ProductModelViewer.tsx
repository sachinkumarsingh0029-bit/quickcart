import React from "react";

type ProductModelViewerProps = {
  modelUrl?: string | null;
  className?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        poster?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "shadow-intensity"?: string | number;
        exposure?: string | number;
        "interaction-prompt"?: string;
        ar?: boolean;
        "ar-modes"?: string;
      };
    }
  }
}

const ProductModelViewer: React.FC<ProductModelViewerProps> = ({
  modelUrl,
  className = "",
}) => {
  if (!modelUrl) {
    return (
      <div className={`flex items-center justify-center h-80 ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          3D view is not available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-xl ${className}`}>
      <model-viewer
        src={modelUrl}
        camera-controls
        auto-rotate
        shadow-intensity="0.8"
        interaction-prompt="auto"
        ar
        ar-modes="webxr scene-viewer quick-look"
        style={{ width: "100%", height: "100%" }}
      ></model-viewer>
    </div>
  );
};

export default ProductModelViewer;

