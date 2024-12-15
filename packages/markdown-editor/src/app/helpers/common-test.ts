export const COMMON_TEST = `

<https://www.markdownguide.org>

**<https://www.markdownguide.org>**


[Duck Duck Go](https://duckduckgo.com)

**[EFF](https://eff.org)**

***[EFF](https://eff.org)***

> ***[EFF](https://eff.org)***


![test](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=300)

**![test](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=300)**


> ***![test](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=300)***

\`\`\` JS
import { param } from "module";

const btn = document.getElementById('btn');
let count: number = 0;

function render(){
  const regexp = /test^/
  btn.innerText = \`Count: \${count}\`;
}

btn.addEventListener("click", (e) => {
  // Count from 1 to 10.
  if (count < 10){
    count += 1;
    render();
  }
})

const boolean = true
const object = {
  value: boolean
}
const array = [1, "test"]   

\`\`\`
`;
