import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4B93FF",
        background: "#05111A",
        "background-light": "#212C34",
        grey: "#5F6A70",
        danger: "#F2506D",
        success: "#25CA98",
      },
    },
  },
  plugins: [],
} satisfies Config;
