export {};

declare global
{
  interface SignalList
  {
    readonly api: {
      version: string;
    };
  }
}
