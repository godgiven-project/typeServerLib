import { existsSync, promises as fs } from 'fs';
import { resolve, dirname } from 'path';

/**
 *
 */
export async function writeJsonFile(path: string, data: unknown, overwrite: boolean = true): Promise<void>
{
  // 'w' - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
  // 'wx' - Like 'w' but fails if path exists.
  const config = { flag: 'w' };

  // Check the path is exist
  path = resolve(path);
  if (!existsSync(path))
  {
    await fs.mkdir(dirname(path), { recursive: true });
  }

  if (overwrite === false) { config.flag = 'wx'; }
  // Convert json to string
  const json = JSON.stringify(data, undefined, 2);

  // Write string to file
  await fs.writeFile(
    path,
    json,
    {
      ...config,
      encoding: 'utf-8'
    }
  );
}
