/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production"
      ? { "./postcss-obfuscator": {} }
      : {}),
  },
};

export default config;
