const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'hundred damp puppy question dance hope ecology copy wealth trigger monster few',
  'https://rinkeby.infura.io/v3/c58307de419b44e2a42cd272d47a08e3'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  // Returns an instance of the contract we deployed
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    // Important to set gasLimit (21000 is generally the minimum);
    // was not mentioned in Grider's tutorial
    .send({ from: accounts[0], gas: '1000000', gasLimit: '21000' });

  console.log(interface);
  console.log('Contract deployed to', result.options.address);
};

deploy();

// 0xF530a7fD556e0Ee62d6d2807fBa9f5F74676eBF4
// 0x44163a637DF538D94a60C039E2926f4443F0A023
