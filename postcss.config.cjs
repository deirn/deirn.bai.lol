/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		require("postcss-nested"),
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		require("tailwindcss"),
		//But others, like autoprefixer, need to run after,
		require("autoprefixer")
	]
};

module.exports = config;
