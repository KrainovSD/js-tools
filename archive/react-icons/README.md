# @krainovsd/react-icons

The library of React icon presets.

## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/react-icons
```

Using yarn:
```
yarn add @krainovsd/react-icons
```

Using npm:
```
npm install @krainovsd/react-icons
```


## Usage

```js
import { Icon, type IconName } from "@krainovsd/react-icons"

<Icon icon={"Module" as IconName} size={24} color={"black"} />
```
or with tree-shaking 
```js
import { Module} from "@krainovsd/react-icons"

<Module size={24} color={"black"} />
```