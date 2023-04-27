import Dino from "./dino.ts";

import "./dino.scss";

let root = document.querySelector("#app") as HTMLDivElement;

Dino.render(root);
