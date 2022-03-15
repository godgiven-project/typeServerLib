import { existsSync, promises as fs } from 'fs';
import { resolve } from 'path';
/**
 *
 */
export async function readJsonFile<T extends Record<string | number, unknown>>(path: string): Promise<Error | T>
{
  // Check the path is exist
  path = resolve(path);
  if (!existsSync(path))
  {
    return new Error('NEXIST');
  }

  // Read file
  return fs.readFile(path, { encoding: 'utf-8' }).then((fileContent) =>
  {
    // Parse object
    try
    {
      return JSON.parse(fileContent);
    }
    catch (err)
    {
      return new Error('invalid_json');
    }
  }).catch((e) =>
  {
    // Handel error
    return new Error(e.code);
  });
}
