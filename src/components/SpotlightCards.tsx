import { motion } from "framer-motion";
import React from "react";
import Spotlight, { SpotlightCard } from "./spotlight";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
  isFeatured?: boolean;
}

interface SpotlightCardsProps {
  features: Feature[];
}

const SpotlightCards: React.FC<SpotlightCardsProps> = ({ features }) => {
  return (
    <Spotlight className="group mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <SpotlightCard key={index}>
            <div
              className={`relative z-20 h-full overflow-hidden rounded-[inherit] ${
                feature.isFeatured ? "bg-slate-800" : "bg-slate-900"
              } p-6 pb-8`}
            >
              {feature.isFeatured && (
                <div className="absolute right-2 top-2 rounded-full bg-indigo-500 px-2 py-1 text-xs font-bold text-white">
                  Featured
                </div>
              )}
              {/* Radial gradient */}
              <div
                className="pointer-events-none absolute bottom-0 left-1/2 -z-10 aspect-square w-1/2 -translate-x-1/2 translate-y-1/2"
                aria-hidden="true"
              >
                <div className="translate-z-0 absolute inset-0 rounded-full bg-slate-800 blur-[80px]"></div>
              </div>
              <div className="flex h-full flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900">
                  {feature.icon}
                </div>
                {/* Text */}
                <div className="flex grow flex-col items-center">
                  <h2 className="mb-1 flex min-h-[3rem] items-center justify-center text-xl font-bold text-slate-200">
                    {feature.title}
                  </h2>
                  <p className="flex min-h-[4rem] items-center justify-center text-sm text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      ))}
    </Spotlight>
  );
};

export default SpotlightCards;
