import { initGame } from "./game";

const linkButtons = document.getElementsByClassName("link-button");

for (let i = 0; i < linkButtons.length; i++) {
  const a = linkButtons[i] as HTMLAnchorElement;

  a.onclick = e => {
    e.stopPropagation();
  };
}

initGame();
