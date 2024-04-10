import { themeVars } from "../../themes/theme.css";
import { style } from "@vanilla-extract/css";

export const loginContainer = style({
  backgroundColor: themeVars.colors.teal,
  display: "grid",
  alignContent: "center",
  justifyContent: "center",
  height: "100%",
  gap: 20,
});

export const inputStyle = style({
  color: "black",
  borderRadius: 0,
  backgroundColor: "white",
  fontSize: 12,
  paddingLeft: 24,
  marginBottom: 10,
  width: 400,
});

export const buttonStyle = style({
  backgroundColor: "#c1fdfb",
  borderRadius: 6,
  width: 120,
  fontWeight: 900,
});

export const buttonContainer = style({
  display: "grid",
  gridTemplateColumns: "1fr auto auto 1fr",
  alignItems: "center",
});
