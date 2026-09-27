// Tailwind CSS v4 — the PostCSS bridge is REQUIRED for the CSS-first
// directives (@theme / @source / @plugin / @utility) to be processed.
// Without it, globals.css is dead text and utilities never generate.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
