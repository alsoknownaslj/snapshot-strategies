import { strategy as erc20BalanceOfStrategy } from '../erc20-balance-of';
import { getDelegations } from '../../utils/delegation';

export const author = 'ferittuncer';
export const version = '1.0.0';
export const dependOnOtherAddress = true;

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
) {
  const delegations = await getDelegations(space, network, addresses, snapshot);
  if (Object.keys(delegations).length === 0) return {};

  const score = await erc20BalanceOfStrategy(
    space,
    network,
    provider,
    Object.values(delegations).reduce((a: string[], b: string[]) =>
      a.concat(b)
    ),
    options,
    snapshot
  );

  return Object.fromEntries(
    addresses.map((address) => {
      const addressScore = delegations[address]
        ? delegations[address].reduce(
            (a, b) => (Math.sqrt(a) + Math.sqrt(score[b])) ^ 2,
            0
          )
        : 0;
      return [address, addressScore];
    })
  );
}
