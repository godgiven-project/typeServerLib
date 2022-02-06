# `@godgiven/signal`

A library for communicate packages with together. you can install signal with:

```bash
yarn add @godgiven/signal
```

## Uses

```typescript
import { dispatchSignal } from '@godgiven/signal';

declare global
{
  interface SignalList
  {
    readonly test: string;
  }
}

void dispatchSignal('test', 'Every thing is ok');

console.log(getSignalValue('test') ?? 'Every thing is bad');
```
