import { Web3Storage } from 'web3.storage';

function getAccessToken(): string {
  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
  if (!token) {
    throw new Error('Missing NEXT_PUBLIC_WEB3_STORAGE_TOKEN environment variable');
  }
  return token;
}

export function makeStorageClient(): Web3Storage {
  return new Web3Storage({ token: getAccessToken() });
}

export async function storeFiles(files: File[]): Promise<string> {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log('Stored files with CID:', cid);
  return cid;
}

export async function storeJson(data: object, fileName: string = 'data.json'): Promise<string> {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const file = new File([blob], fileName);
  return storeFiles([file]);
}
