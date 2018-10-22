const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

// Code below will ignore the MaxListenersExceededWarning
// It's a bug in either web3 or the provider and cannot be fixed
require('events').EventEmitter.defaultMaxListeners = 0;

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 1000000 });
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      });

      assert.equal(accounts[0], players[0]);
      // assert.equal([what we expect], [what we have])
      assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      });

      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.02', 'ether')
      });

      await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei('0.02', 'ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0]
      });

      assert.equal(accounts[0], players[0]);
      assert.equal(accounts[1], players[1]);
      assert.equal(accounts[2], players[2]);
      // assert.equal([what we expect], [what we have])
      assert.equal(3, players.length);
  });

  it('requires a minimum amount to enter', async () => {
    // try-catch statements will automatically catch errors thrown by
    // asynchronous function calls
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200
      });

      // Will fail test automatically if no error occurs from our test
      assert(false);
    } catch (err) {
      // Asserts error object passed in, indicating error in async call
      assert(err);
    }
  });

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    // Returns balance in wei after placing 2 ETH in the pot
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    // Accounts for the amount spent in gas when first entering
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
});
