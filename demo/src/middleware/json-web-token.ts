import * as _jsonwebtoken from 'jsonwebtoken';

import {
  sign as signType,
  verify as verifyType,
  SignOptions,
  VerifyOptions,
  Algorithm
} from 'jsonwebtoken';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonwebtoken = _jsonwebtoken as any;

const sign: typeof signType = jsonwebtoken.default.sign;

const verify: typeof verifyType = jsonwebtoken.default.verify;
export {
  sign,
  verify,
  Algorithm,
  SignOptions,
  VerifyOptions
};
