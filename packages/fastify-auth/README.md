# @krainovsd/fastify-auth

The library of helpers for logger fastify with pino transport. 


## Installing

### Package manager

Using pnpm:
```
pnpm install @krainovsd/fastify-auth
```

Using yarn:
```
yarn add @krainovsd/fastify-auth
```

Using npm:
```
npm install @krainovsd/fastify-auth
```


## Usage

```js
import { Auth } from "@krainovsd/fastify-auth"


const auth = new Auth({
  cookieName: "token",
  secretType: "secret",
  tokenSecret: "secret123",
  userNameField: "username",
});
```

