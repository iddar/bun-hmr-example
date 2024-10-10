import { Child } from "./child.js";

export function mount() {
  const $app = document.querySelector("#app");
  const now = new Date().toLocaleTimeString();

  console.log("appd.js");
  $app.innerHTML = `Hello, World! ${now}\n\n<br />`;
  $app.appendChild(Child());
}
