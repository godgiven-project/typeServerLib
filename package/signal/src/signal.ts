declare global
{
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface SignalList {}
}

type CallBackType = <SignalName extends keyof SignalList>(value: SignalList[SignalName]) => void;
interface SignalListener
{
  once: boolean;
  callBack: CallBackType;
}

interface SignalType<SignalName extends keyof SignalList>
{
  value?: SignalList[SignalName];
  dispatchCount: number;
  listenerList: SignalListener[];
}

const messageList: Record<string, SignalType<keyof SignalList>> = {};

/**
 *
 */
export function dispatchSignal<SignalName extends keyof SignalList>(signal: SignalName, value: SignalList[SignalName]): void
{
  if (messageList[signal] == null)
  {
    messageList[signal] = {
      dispatchCount: 0,
      listenerList: []
    };
  }

  messageList[signal].value = value;
  messageList[signal].dispatchCount++;
  for (const listener of messageList[signal].listenerList)
  {
    listener.callBack(value);
  }
}

/**
 *
 */
export function addSignalListener<SignalName extends keyof SignalList>(signal: SignalName, callBack: CallBackType, once: boolean = false): void
{
  if (messageList[signal] == null)
  {
    messageList[signal] = {
      dispatchCount: 0,
      listenerList: []
    };
  }

  const listener: SignalListener = {
    once,
    callBack: callBack
  };
  messageList[signal].listenerList.push(listener);
}

/**
 *
 */
export function getSignalValue<SignalName extends keyof SignalList>(signal: SignalName): SignalList[SignalName] | undefined
{
  return messageList[signal].value;
}
