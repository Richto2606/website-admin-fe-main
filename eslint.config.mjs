import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Tambahkan blok rules di sini untuk menonaktifkan pengecekan yang ketat
    rules: {
      "@typescript-eslint/no-explicit-any": "off",     // Mengizinkan penggunaan 'any'
      "@typescript-eslint/no-unused-vars": "off",      // Mengizinkan variabel yang tidak terpakai
      "prefer-rest-params": "off"                      // Mengizinkan penggunaan 'arguments'
    },
  },
];

export default eslintConfig;