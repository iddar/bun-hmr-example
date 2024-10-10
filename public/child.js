if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      console.log(`hot reload for $import.meta.url`);
      document.querySelector("#child").replaceWith(newModule.Child());
    }
  });
}

/** @param {HTMLDivElement} parent */
export function Child() {
  const $child = document.createElement("div");
  $child.id = "child";
  $child.textContent = `I'm a child component my rID is ${(Math.random() * 100).toFixed(0)}`;

  return $child;
}
