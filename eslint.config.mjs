import nextConfig from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextConfig,
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Hydration 패턴에서 필요한 경우가 많음
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
