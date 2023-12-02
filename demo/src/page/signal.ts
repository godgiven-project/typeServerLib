import { ServerResponse } from 'http';
import { requestType } from '../middleware/authentication-server';
import { sendResponse } from '@godgiven/type-server';
import { SignalInterface } from '@godgiven/signal';
// import Debug from 'debug';

// const log = Debug('app/page/home');

declare global
{
  interface SignalList
  {
    readonly 'demo': string;
  }
}

const signalDemo = new SignalInterface('demo');
signalDemo.addListener((test) =>
{
  console.log(test);
});
export const pageSignal = async (_request: requestType, response: ServerResponse): Promise<void> =>
{
  console.log('test');
  signalDemo.dispatch('signal is working');
  sendResponse(response, 200, {
    ok: true,
    description: '..:: Welcome ::..',
    // data: {
    //   app: packageJson.description,
    // },
  });
};
