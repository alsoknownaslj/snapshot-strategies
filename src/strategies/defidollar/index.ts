import { formatUnits } from '@ethersproject/units';
import { multicall } from '../../utils';

export const author = 'atvanguard';
export const version = '1.0.0';
export const dependOnOtherAddress = false;

const abi = [
  'function balanceOf(address account) view returns (uint256)',
  'function getPricePerFullShare() view returns (uint256)'
];

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
) {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';

  const queries: any[] = [];

  addresses.forEach((voter) => {
    queries.push([options.address, 'balanceOf', [voter]]);
  });
  queries.push([options.address, 'getPricePerFullShare']);

  const response = (
    await multicall(network, provider, abi, queries, { blockTag })
  ).map((r) => r[0]);
  const pps = response[response.length - 1];

  return Object.fromEntries(
    Array(addresses.length)
      .fill('x')
      .map((_, i) => {
        return [
          addresses[i],
          parseFloat(formatUnits(response[i].mul(pps), 36 /* decimals */))
        ];
      })
  );
}
