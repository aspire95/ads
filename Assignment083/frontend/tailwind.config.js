/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1e3a8a",
                secondary: "#1d4ed8",
                accent: "#3b82f6",
            },
        },
    },
    plugins: [],
}
