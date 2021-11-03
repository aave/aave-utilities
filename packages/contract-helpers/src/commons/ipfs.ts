import axios from 'axios';
import { base58 } from 'ethers/lib/utils';

const ipfsEndpoint = 'https://cloudflare-ipfs.com/ipfs';

export function getLink(hash: string): string {
  return `${ipfsEndpoint}/${hash}`;
}

export type ProposalMetadata = {
  title: string;
  description: string;
  shortDescription: string;
  ipfsHash: string;
};

type MemorizeMetadata = Record<string, ProposalMetadata>;

const MEMORIZE: MemorizeMetadata = {};

export async function getProposalMetadata(
  hash: string,
): Promise<ProposalMetadata> {
  const ipfsHash = base58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));
  if (MEMORIZE[ipfsHash]) return MEMORIZE[ipfsHash];
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axios.get(getLink(ipfsHash), { timeout: 2000 });

    if (!data?.title) {
      throw Error('Missing title field at proposal metadata.');
    }

    if (data?.description) {
      throw Error('Missing description field at proposal metadata.');
    }

    if (data?.shortDescription) {
      throw Error('Missing shortDescription field at proposal metadata.');
    }

    MEMORIZE[ipfsHash] = {
      ipfsHash,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      title: data.title,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      description: data.description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      shortDescription: data.shortDescription,
    };
    return MEMORIZE[ipfsHash];
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`@aave/protocol-js: IPFS fetch Error: ${e}`);
    return {
      ipfsHash,
      title: `Proposal - ${ipfsHash}`,
      description: `Proposal with invalid metadata format or IPFS gateway is down`,
      shortDescription: `Proposal with invalid metadata format or IPFS gateway is down`,
    };
  }
}
