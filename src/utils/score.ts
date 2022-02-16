import SecureLS from "secure-ls";
import { updateHighscoreView } from "../game";
import { Pool } from "./pool";

let score = 0;
const ls = new SecureLS({ encodingType: "aes" });

const scoreDiv = document.getElementById("score") as HTMLDivElement;

const scoreSpans = new Pool<HTMLSpanElement>(() => {
  const span = document.createElement("span");
  scoreDiv.appendChild(span);

  return span;
}, 8);

const numStrs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const blank = "";

function resetScoreText(span: HTMLSpanElement) {
  span.textContent = blank;
}

export function setScore(v: number) {
  score = v;

  scoreSpans.getAll().forEach(resetScoreText);
  scoreSpans.clear();

  let n = Math.floor(v);

  if (score === 0) {
    const span = scoreSpans.obtain();
    span.textContent = numStrs[0];
    return;
  }

  while (n) {
    const d = n % 10;

    const span = scoreSpans.obtain();
    span.textContent = numStrs[d];

    n = Math.floor(n / 10);
  }
}

export function addScore(v: number) {
  setScore(score + v);
}

export function getScore() {
  return score;
}

export function updateHighscore(v: number) {
  ls.set("highscore", v);
  updateHighscoreView(v.toString());
}

export function getHighscore() {
  try {
    const v = ls.get("highscore");
    return v || 0;
  } catch (_e) {
    ls.set("highscore", 0);
    return 0;
  }
}
