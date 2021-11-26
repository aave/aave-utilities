import { base58 } from 'ethers/lib/utils';
import fetch from 'isomorphic-unfetch';

export function getLink(hash: string, gateway: string): string {
  return `${gateway}/${hash}`;
}

export type ProposalMetadata = {
  title: string;
  description: string;
  shortDescription: string;
  ipfsHash: string;
  aip: number;
  discussions: string;
  author: string;
};

type MemorizeMetadata = Record<string, ProposalMetadata>;

const MEMORIZE: MemorizeMetadata = {};

export async function getProposalMetadata(
  hash: string,
  gateway = 'https://cloudflare-ipfs.com/ipfs',
): Promise<ProposalMetadata> {
  const ipfsHash = hash.startsWith('0x')
    ? base58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'))
    : hash;
  if (MEMORIZE[ipfsHash]) return MEMORIZE[ipfsHash];
  try {
    const ipfsResponse: Response = await fetch(getLink(ipfsHash, gateway));
    if (!ipfsResponse.ok) {
      throw Error('Fetch not working');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: ProposalMetadata = await ipfsResponse.json();
    if (!data.title) {
      throw Error('Missing title field at proposal metadata.');
    }

    if (!data.description) {
      throw Error('Missing description field at proposal metadata.');
    }

    if (!data.shortDescription) {
      throw Error('Missing shortDescription field at proposal metadata.');
    }

    MEMORIZE[ipfsHash] = {
      ...data,
      ipfsHash,
    };
    return MEMORIZE[ipfsHash];
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`@aave/contract-helpers: IPFS fetch Error: ${e}`);
    return {
      ipfsHash,
      title: `Proposal - ${ipfsHash}`,
      description: `Proposal with invalid metadata format or IPFS gateway is down`,
      shortDescription: `Proposal with invalid metadata format or IPFS gateway is down`,
      aip: 0,
      author: `Proposal with invalid metadata format or IPFS gateway is down`,
      discussions: `Proposal with invalid metadata format or IPFS gateway is down`,
    };
  }
}
