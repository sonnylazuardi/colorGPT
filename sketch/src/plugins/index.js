export function getBundleUrl() {
  if (process.env.NODE_ENV === "production") {
    return require("../../resources/index.html");
  } else {
    return "http://localhost:3000";
  }
}
