/** @type {import("tailwindcss").Config} */
const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {
			colors: {
				deirn: "#de1177"
			}
		}
	},

	plugins: []
};

module.exports = config;
