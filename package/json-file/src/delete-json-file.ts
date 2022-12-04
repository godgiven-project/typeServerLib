import { unlinkSync } from 'fs';

/**
 * Enhanced read json file.
 *
 * @example
 * await deleteJsonFile('./file.json');
 */
export async function deleteJsonFile(path: string): Promise<void>
{
  try
  {
    unlinkSync(path);
  }
  catch (err)
  {
    throw new Error('problem');
  }
}
