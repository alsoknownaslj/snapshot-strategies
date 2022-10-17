export const author = 'bonustrack';
export const version = '0.1.0';
export const dependOnOtherAddress = false;

export async function strategy(space, network, provider, addresses, options) {
  return Object.fromEntries(
    addresses.map((address) => [address, options.value || 1])
  );
}
