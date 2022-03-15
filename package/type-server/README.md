# `@godgiven/type-server`

A base server app with very simple routing and middleware. you can install type-server with:

`yarn add @godgiven/type-server`

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
