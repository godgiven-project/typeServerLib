declare global
{
  /**
   * Global signals value type registry.
   */
  interface SignalList
  {
    readonly 'easter-egg': string;
  }
}

/**
 * addSignalListener options type
 */
export interface ListenerOptions
{
  /**
   * If true, the listener will be called only once.
   *
   * @default false
   */
  once?: boolean;

  /**
   * If true, the listener will be called before other.
   *
   * @default false
   */
  priority?: boolean;

  /**
   * If true, the listener will be defined disabled by default.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Calling this listener (callback) with preview signal value (if dispatched before).
   * If Immediate, the listener will be called immediately without any debounce for preview signal.
   *
   * @default true
   */
  receivePrevious?: boolean | 'Immediate';
}

/**
 * dispatchSignal options type
 */
export interface DispatchOptions
{
  /**
   * If true, the dispatch will be send after animation frame debounce.
   * If false, every signal is matter and count.
   * tips: debounce work like throttle this means listeners call with last dispatch value.
   *
   * @default true
   */
  debounce?: boolean;
}

export interface SignalProviderOptions
{
  /**
   * Calling signal provider (request signal callback) with preview signal value (if dispatched before).
   * If Immediate, the listener will be called immediately without any debounce for preview signal.
   *
   * @default true
   */
  receivePrevious?: boolean | 'Immediate';

  /**
   * If true, the dispatch will be send after animation frame debounce.
   * If false, every signal is matter and count.
   * tips: debounce work like throttle this means listeners call with last dispatch value.
   *
   * @default true
   */
  debounce?: boolean;
}

/**
 * Signal listeners callback function type.
 */
export type ListenerCallback<SignalName extends keyof SignalList> = (
  signalValue: SignalList[SignalName]
) => void | Promise<void>;

/**
 * Signal provider function type used to setSignalProvider.
 */
// export type SignalProvider<SignalName extends keyof RequestSignalList> = (
//   requestParam: RequestSignalList[SignalName]
// ) => RequestSignalList[SignalName] | void | Promise<RequestSignalList[SignalName] | void>;

/**
 * Signal listeners object in database.
 */
export interface ListenerObject<SignalName extends keyof SignalList>
{
  /**
   * Unique listener id
   */
  id: number;

  /**
   * If true, the listener will be called only once and removed automatically after first call
   */
  once: boolean;

  /**
   * If true, the listener will be disabled.
   */
  disabled: boolean;

  callback: ListenerCallback<SignalName>;
}

/**
 * Signal object in database.
 */
export interface SignalObject<SignalName extends keyof SignalList>
{
  /**
   * Signal name for direct access.
   */
  name: SignalName;

  /**
   * Last dispatched value.
   */
  value?: SignalList[SignalName];

  /**
   * If true, the signal is disabled.
   */
  disabled: boolean;

  /**
   * Dispatches debounced (delayed).
   * Internal use case for debounce dispatch signal.
   */
  debounced: boolean;

  /**
   * Signal listeners list.
   */
  listenerList: Array<ListenerObject<SignalName>>;
}

/**
 * Signal stack database.
 */
export type SignalStack = {
  [SignalName in keyof SignalList]?: SignalObject<SignalName>;
};
