"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposalMetadata = exports.getLink = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("ethers/lib/utils");
const isomorphic_unfetch_1 = (0, tslib_1.__importDefault)(require("isomorphic-unfetch"));
function getLink(hash, gateway) {
    return `${gateway}/${hash}`;
}
exports.getLink = getLink;
const MEMORIZE = {};
async function getProposalMetadata(hash, gateway = 'https://cloudflare-ipfs.com/ipfs') {
    const ipfsHash = hash.startsWith('0x')
        ? utils_1.base58.encode(Buffer.from(`1220${hash.slice(2)}`, 'hex'))
        : hash;
    if (MEMORIZE[ipfsHash])
        return MEMORIZE[ipfsHash];
    try {
        const ipfsResponse = await (0, isomorphic_unfetch_1.default)(getLink(ipfsHash, gateway));
        if (!ipfsResponse.ok) {
            throw Error('Fetch not working');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await ipfsResponse.json();
        if (!data.title) {
            throw Error('Missing title field at proposal metadata.');
        }
        if (!data.description) {
            throw Error('Missing description field at proposal metadata.');
        }
        if (!data.shortDescription) {
            throw Error('Missing shortDescription field at proposal metadata.');
        }
        MEMORIZE[ipfsHash] = Object.assign(Object.assign({}, data), { ipfsHash });
        return MEMORIZE[ipfsHash];
    }
    catch (e) {
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
exports.getProposalMetadata = getProposalMetadata;
//# sourceMappingURL=ipfs.js.map