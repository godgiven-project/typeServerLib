import { existsSync, promises as fs } from 'fs';
import { resolve, dirname } from 'path';
/**
 *
 */
export async function writeJsonFile(path: string, data: unknown): Promise<void>
{
  // Check the path is exsist
  path = resolve(path);
  if (!existsSync(path))
  {
    await fs.mkdir(dirname(path), { recursive: true });
  }

  // Convert json to string
  const json = JSON.stringify(data, undefined, 2);

  // Write string to file
  try
  {
    await fs.writeFile(path, json, { encoding: 'utf-8' });
  }
  catch (err)
  {
    throw new Error('write_file_error');
  }
}
