const contract = require('@truffle/contract');

export const loadContract = async (name: string, provider: any) => {
  const res = await fetch(`/contracts/${name}.json`);
  const artifact = await res.json(); // the contract api json is called artifact
  const _contract = contract(artifact);
  _contract.setProvider(provider);

  let deployed = null;
  try {
    deployed = await _contract.deployed();
  } catch {
    console.error('Connected to a wrong network');
  }

  return deployed;
};
