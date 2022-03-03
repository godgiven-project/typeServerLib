import { existsSync, promises as fs } from 'fs';
import { resolve, dirname } from 'path';

// eslint-disable-next-line @typescript-eslint/prefer-as-const
const trueValue: true = true;

/**
 *
 */
export async function writeJsonFile(path: string, data: unknown, overwrite: boolean = true): Promise<Error | true>
{
  // 'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
  // 'wx' - Like 'w' but fails if path exists.
  const config = { flag: 'w' };

  // Check the path is exist
  path = resolve(path);
  if (!existsSync(path)) { await fs.mkdir(dirname(path), { recursive: true }); }

  if (overwrite === false) { config.flag = 'wx'; }
  // Convert json to string
  const json = JSON.stringify(data, undefined, 2);

  // Write string to file
  return fs.writeFile(
    path,
    json,
    {
      ...config,
      encoding: 'utf-8'
    }
  ).then(() =>
  {
    return trueValue;
  }).catch((err) =>
  {
    return new Error(err.code);
  });
}
