import type {
  DispatchOptions,
  ListenerCallback,
  ListenerObject,
  ListenerOptions,
  SignalObject,
  // SignalProvider,
  // SignalProviderOptions,
  SignalStack
} from './type.js';

/**
 * Listener `id`
 */
let _lastListenerId = 0;

/**
 * Signal stack database.
 */
const _signalStack: SignalStack = {};

/**
 * Get signal object by name, If not available, it will create a new signal with default options.
 *
 * Example:
 *
 * ```ts
 * const signal = _getSignalObject('content-change');
 * signal.disabled = true;
 * ```
 */
export function _getSignalObject<SignalName extends keyof SignalList>(
  signalName: SignalName
): SignalObject<SignalName>
{
  if (_signalStack[signalName] == null)
  {
    _signalStack[signalName] = {
      name: signalName,
      disabled: false,
      debounced: false,
      listenerList: []
    };
  }
  return _signalStack[signalName] as unknown as SignalObject<SignalName>;
}

/**
 *
 */
function _callListeners<SignalName extends keyof SignalList>(signal: SignalObject<SignalName>): void
{
  if (signal.value === undefined)
  {
    return;
  }

  for (const listener of signal.listenerList)
  {
    if (listener.disabled) { continue; }
    try
    {
      const ret = listener.callback(signal.value);
      if (ret instanceof Promise)
      {
        // ret.catch((err) =>
        // );
      }
    }
    catch (err)
    {
      // logger.error('_callListeners', 'call_listener_failed', err, {
      //   signalName: signal.name
      // });
    }
  }

  signal.listenerList
    .filter((listener) => !listener.disabled && listener.once)
    .forEach((listener) => _removeSignalListener(signal, listener.id));
}

/**
 * Adds a new listener to the signal.
 *
 * Example:
 *
 * ```ts
 * const signal = _getSignalObject('content-change')
 * const listener = _addSignalListener(signal, (content) => console.log(content));
 * ```
 */
export function _addSignalListener<SignalName extends keyof SignalList>(
  signal: SignalObject<SignalName>,
  listenerCallback: ListenerCallback<SignalName>,
  options: ListenerOptions = {}
): ListenerObject<SignalName>
{
  options.once ??= false;
  options.disabled ??= false;
  options.receivePrevious ??= true;
  options.priority ??= false;

  const listener: ListenerObject<SignalName> = {
    id: ++_lastListenerId,
    once: options.once,
    disabled: options.disabled,
    callback: listenerCallback
  };

  let callbackCalled = false;

  // Run callback for old dispatch signal
  if (signal.value !== undefined)
  {
    // null is a valid value for signal.
    if (options.receivePrevious === 'Immediate')
    {
      try
      {
        void listenerCallback(signal.value);
      }
      catch (err)
      {
        // logger.error('_addSignalListener', 'call_signal_callback_failed', err, {
        //   signalName: signal.name
        // });
      }
      callbackCalled = true;
    }
    else if (options.receivePrevious === true)
    {
      if (typeof process === 'undefined')
      {
        requestAnimationFrame(() =>
        {
          if (signal.value !== undefined)
          {
            // null is a valid value for signal.
            void listenerCallback(signal.value);
          }
        });
      }
      else
      {
        if (signal.value !== undefined)
        {
          // null is a valid value for signal.
          void listenerCallback(signal.value);
        }
      }
      callbackCalled = true; // must be outside of requestAnimationFrame.
    }
  }

  // if once then must remove listener after fist callback called! then why push it to listenerList?!
  if (!(options.once === true && callbackCalled === true))
  {
    if (options.priority === true)
    {
      signal.listenerList.unshift(listener);
    }
    else
    {
      signal.listenerList.push(listener);
    }
  }

  return listener;
}

/**
 * Removes a listener from the signal.
 *
 * Example:
 *
 * ```ts
 * const signal = _getSignalObject('content-change')
 * const listener = _addSignalListener(signal, ...);
 * _removeSignalListener(signal, listener);
 * ```
 */
export function _removeSignalListener<SignalName extends keyof SignalList>(
  signal: SignalObject<SignalName>,
  listenerId: number
): void
{
  // logger.logMethodArgs('_removeSignalListener', { signalName: signal.name, listenerId });
  const listenerIndex = signal.listenerList.findIndex((_listener) => _listener.id === listenerId);
  if (listenerIndex !== -1)
  {
    signal.listenerList.splice(listenerIndex, 1);
  }
}

/**
 * Dispatch (send) signal to all listeners.
 * @example
 * const signal = _getSignalObject('content-change')
 * _dispatchSignal(signal, content);
 */
export function _dispatchSignal<SignalName extends keyof SignalList>(
  signal: SignalObject<SignalName>,
  value: SignalList[SignalName],
  options: DispatchOptions = {}
): void
{
  options.debounce ??= true;

  // logger.logMethodArgs('dispatchSignal', { signalName: signal.name, value, options });

  // set value before check signal.debounced for act like throttle (call listeners with last dispatch value).
  signal.value = value;

  if (signal.disabled) { return; } // signal is disabled.
  if (options.debounce === true && signal.debounced === true) { return; } // last dispatch in progress.

  if (options.debounce !== true)
  {
    // call listeners immediately.
    _callListeners(signal);
    return;
  }
  // else: call listeners in next frame.
  signal.debounced = true;
  if (typeof process === 'undefined')
  {
    requestAnimationFrame(() =>
    {
      _callListeners(signal);
      signal.debounced = false;
    });
  }
  else
  {
    _callListeners(signal);
    signal.debounced = false;
  }
}

/**
 * Defines the provider of the signal that will be called when the signal requested (addRequestSignalListener).
 *
 * Example:
 *
 * ```ts
 * const signal = _getSignalObject('content-change');
 * const requestSignal = _getSignalObject('request-content-change');
 * _setSignalProvider(signal, requestSignal, async (requestParam) => {
 *   const content = await fetchNewContent(requestParam);
 *   if (content != null) {
 *     return content; // dispatchSignal('content-change', content);
 *   }
 *   else {
 *     dispatchSignal('content-not-found');
 *   }
 * }
 * ```
 */
