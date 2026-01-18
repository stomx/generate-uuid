import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Next.js 기본 ignore 패턴
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // 커스텀 규칙
  {
    rules: {
      // Hydration 패턴에서 필요한 경우가 많음
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
