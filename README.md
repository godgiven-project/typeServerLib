# TypeScript server

`TypeScript server` Is a library for building fast API with TypeScript.

TypeScript server lib makes without any framework and developed with Nodejs `HTTP`.

## Package List

- `typeServer`: A base server app with very simple routing and middleware. you can install typeServer with `yarn add @godgiven/typeServer`.
- `signal`: A library for communicate packages with together. you can install signal with `yarn add @godgiven/signal`.

## Uses

```typescript
// For define app
import { App } from '@godgiven/type-server';

// For Rigister function
import { ServerResponse, IncomingMessage } from 'http';
import { sendResponse } from '@godgiven/type-server';


const app = new App();
app.port = 5000;
app.version = 'v1';

app.register('GET', '/', async (_request: IncomingMessage, response: ServerResponse): Promise<void> =>
{
  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
  });
});
```
