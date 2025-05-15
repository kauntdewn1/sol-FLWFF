import { create } from '@web3-storage/w3up-client';

function getAccessToken(): string {
  const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
  if (!token) {
    throw new Error('Missing NEXT_PUBLIC_WEB3_STORAGE_TOKEN environment variable');
  }
  return token;
}

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const client = await create();
    await client.login(getAccessToken());
    
    const cid = await client.uploadFile(file);
    return cid.toString();
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

export async function storeJson(data: object, fileName: string = 'data.json'): Promise<string> {
  try {
    const client = await create();
    await client.login(getAccessToken());
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const file = new File([blob], fileName);
    
    const cid = await client.uploadFile(file);
    return cid.toString();
  } catch (error) {
    console.error('Error storing JSON to IPFS:', error);
    throw error;
  }
}
