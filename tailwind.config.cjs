/** @type {import("tailwindcss").Config} */
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        deirn: "#de1177"
      },
      fontFamily: {
        math: ["Latin Modern Math", "sans-serif"]
      }
    }
  },

  plugins: []
};

module.exports = config;
