/* eslint-disable no-console */
import { Editor } from "@/module";
import "./global.css";

const fullExample = `# Heading level 1
## Heading level 2
### Heading level 3
#### Heading level 4
##### Heading level 5
###### Heading level 6
Heading level 1
===============
Heading level 2
---------------
I just love **bold text**.
I just love __bold text__.
Love**is**bold

Italicized text is the *cat's meow*.
Italicized text is the _cat's meow_.
A*cat*meow

This text is ***really important***.
This text is ___really important___.
This text is __*really important*__.
This text is **_really important_**.
This is really***very***important text.

> Dorothy followed her through many of the beautiful rooms in her castle.
>
> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.

1. First item
2. Second item
3. Third item
4. Fourth item

- First item
- Second item
- Third item
    - Indented item
    - Indented item
- Fourth item

+ First item
+ Second item
+ Third item
+ Fourth item

\`\`Use \`code\` in your Markdown file.\`\`
\`\`
use code
\`\`

\`\`\`js
const string = "string"
const bool = true
\`\`\`
---
***
____

[Duck Duck Go](https://duckduckgo.com)

<https://www.markdownguide.org>
**[EFF](https://eff.org)**

![test](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=300)

   
`;
const viewFull = false;
const root = document.querySelector<HTMLElement>("#root");

if (!root) throw new Error("Hasn't root");

const editor = new Editor({
  root,
  initialText: viewFull
    ? fullExample
    : `test ![test](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=300) test


![test](https://mdg.imgix.net/assets/images/san-juan-mountains.jpg?auto=format&fit=clip&q=40&w=300)
`,
  // onChange: (view) => {
  //   console.log(view.state.doc.toString());
  // },
  // onBlur: (state) => {
  //   console.log("blur ", state.doc.toString());
  // },
  // onFocus: (state) => {
  //   console.log("focus ", state.doc.toString());
  // },
  // onEnter: (view) => {
  //   console.log("enter ", view.state.doc.toString());
  // },
  vimMode: false,
  readonly: false,
});

let theme: "dark" | "light" = "light";
const themeButton = document.createElement("button");
themeButton.textContent = "Сменить тему";
document.body.appendChild(themeButton);
themeButton.addEventListener("click", () => {
  editor.setTheme(theme === "light" ? "dark" : "light");
  theme = theme === "light" ? "dark" : "light";
});

let readonly = false;
const readonlyButton = document.createElement("button");
readonlyButton.textContent = "Сменить режим";
document.body.appendChild(readonlyButton);
readonlyButton.addEventListener("click", () => {
  editor.setReadonly(!readonly);
  readonly = !readonly;
});

let vimMode = false;
const vimButton = document.createElement("button");
vimButton.textContent = "Сменить vim режим";
document.body.appendChild(vimButton);
vimButton.addEventListener("click", () => {
  editor.setVimMode(!vimMode);
  vimMode = !vimMode;
});
