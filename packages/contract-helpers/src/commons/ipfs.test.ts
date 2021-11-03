import axios from 'axios';
import { base58 } from 'ethers/lib/utils';
import { getLink, getProposalMetadata } from './ipfs';

describe('ipfs', () => {
  const hash =
    '0x04d1fd83d352a7caa14408cee133be97b5919c3a5cf79a47ded3c9b658447d79';
  describe('getLink', () => {
    it('Expects the link to be correct', () => {
      const link = getLink(hash);
      expect(link).toEqual(
        'https://cloudflare-ipfs.com/ipfs/0x04d1fd83d352a7caa14408cee133be97b5919c3a5cf79a47ded3c9b658447d79',
      );
    });
  });
  describe('getProposalMetadata', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const ipfsHash = base58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'));
    it('Expects to return metadata when hash complete', async () => {
      const getSpy = jest.spyOn(axios, 'get').mockReturnValue(
        Promise.resolve({
          data: {
            title: 'mockTitle',
            description: 'mockDescription',
            shortDescription: 'mockShortDescription',
          },
        }),
      );

      const metadata = await getProposalMetadata(hash);

      expect(getSpy).toHaveBeenCalled();
      expect(metadata).toEqual({
        title: 'mockTitle',
        description: 'mockDescription',
        shortDescription: 'mockShortDescription',
        ipfsHash,
      });
    });
    it('Expects to return metadata when hash complete and when repeating hash', async () => {
      const getSpy = jest.spyOn(axios, 'get').mockReturnValue(
        Promise.resolve({
          data: {
            title: 'mockTitle',
            description: 'mockDescription',
            shortDescription: 'mockShortDescription',
          },
        }),
      );

      const metadata = await getProposalMetadata(hash);
      const metadata2 = await getProposalMetadata(hash);

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(metadata).toEqual({
        title: 'mockTitle',
        description: 'mockDescription',
        shortDescription: 'mockShortDescription',
        ipfsHash,
      });
      expect(metadata2).toEqual({
        title: 'mockTitle',
        description: 'mockDescription',
        shortDescription: 'mockShortDescription',
        ipfsHash,
      });
    });
    it('Expects to fail if there is no title', async () => {
      const getSpy = jest.spyOn(axios, 'get').mockReturnValue(
        Promise.resolve({
          data: {
            description: 'mockDescription',
            shortDescription: 'mockShortDescription',
          },
        }),
      );

      const metadata = await getProposalMetadata(hash);

      expect(getSpy).toHaveBeenCalled();
      expect(metadata).toEqual({
        title: `Proposal - ${ipfsHash}`,
        description: `Proposal with invalid metadata format or IPFS gateway is down`,
        shortDescription: `Proposal with invalid metadata format or IPFS gateway is down`,
        ipfsHash,
      });
    });
    it('Expects to fail if there is no description', async () => {
      const getSpy = jest.spyOn(axios, 'get').mockReturnValue(
        Promise.resolve({
          data: {
            title: 'mockTitle',
            shortDescription: 'mockShortDescription',
          },
        }),
      );

      const metadata = await getProposalMetadata(hash);

      expect(getSpy).toHaveBeenCalled();
      expect(metadata).toEqual({
        title: `Proposal - ${ipfsHash}`,
        description: `Proposal with invalid metadata format or IPFS gateway is down`,
        shortDescription: `Proposal with invalid metadata format or IPFS gateway is down`,
        ipfsHash,
      });
    });
    it('Expects to fail if there is no shortDescription', async () => {
      const getSpy = jest.spyOn(axios, 'get').mockReturnValue(
        Promise.resolve({
          data: {
            title: 'mockTitle',
            description: 'mockDescription',
          },
        }),
      );

      const metadata = await getProposalMetadata(hash);

      expect(getSpy).toHaveBeenCalled();
      expect(metadata).toEqual({
        title: `Proposal - ${ipfsHash}`,
        description: `Proposal with invalid metadata format or IPFS gateway is down`,
        shortDescription: `Proposal with invalid metadata format or IPFS gateway is down`,
        ipfsHash,
      });
    });
  });
});
