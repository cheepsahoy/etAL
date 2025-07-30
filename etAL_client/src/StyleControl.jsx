import { MantineProvider, createTheme } from "@mantine/core";
import * as d3 from "d3";

//Color schemes for the app
const milkyPurple = [
  "#f7ecff",
  "#e7d6fc",
  "#caabf1",
  "#ad7de7",
  "#9356de",
  "#8946db",
  "#7c31d8",
  "#6a24c0",
  "#5e1eac",
  "#511798",
];

const amberPulse = [
  "#fff7e6",
  "#ffe6bf",
  "#ffd699",
  "#ffc266",
  "#ffad33",
  "#ff9900",
  "#cc7a00",
  "#995c00",
  "#663d00",
  "#331f00",
];

const plasmaCore = Array.from({ length: 10 }, (_, i) =>
  d3.interpolatePlasma(i / 9)
);

const oracleGreen = [
  "#0a0f0d",
  "#0d2f24",
  "#155d47",
  "#1f7d60",
  "#26a37c",
  "#30c999",
  "#66e4b5",
  "#99f2d1",
  "#c0fbe7",
  "#e3fff8",
];

const theme = createTheme({
  //colors
  colors: {
    milkyPurple: milkyPurple,
    amberPulse: amberPulse,
    plasmaCore: plasmaCore,
    oracleGreen: oracleGreen,
  },
  primaryColor: "milkyPurple",
  //fonts
  fontFamily: "Inter, sans-serif",
  //sizes
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  lineHeights: {
    xs: "1",
    sm: "1.2",
    md: "1.4",
    lg: "1.6",
    xl: "1.8",
  },
  defaultRadius: "md",

  //global radii
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "20px",
  },

  //shadows
  shadows: {
    xs: "0 1px 2px rgba(0,0,0,0.1)",
    sm: "0 2px 4px rgba(0,0,0,0.1)",
    md: "0 4px 8px rgba(0,0,0,0.12)",
    lg: "0 8px 16px rgba(0,0,0,0.14)",
    xl: "0 12px 24px rgba(0,0,0,0.16)",
  },

  //
});

function StyleControl({ children }) {
  return (
    <MantineProvider theme={theme} withCssVariables defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}

export default StyleControl;
