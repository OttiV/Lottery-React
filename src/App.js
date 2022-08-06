import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';
import './App.css';

class App extends Component {
  state = { manager: '', players: [], balance: '', value: '', message: '' };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  render() {
    const { balance, manager, players, value, message } = this.state;
    const balanceInEther = web3.utils.fromWei(balance, 'ether');

    const loadingMessage = 'Waiting on transaction success'

    const onSubmit = async (e) => {
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: loadingMessage });

      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });
      this.setState({ message: 'You have been entered' });
    };

    const pickWinner = async() => {
      const accounts = await web3.eth.getAccounts();
      this.setState({ message: loadingMessage });

      await lottery.methods
        .pickWinner()
        .send({ from: accounts[0]});
      this.setState({ message: 'Winner has been picked' });
    }
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {manager}
          <br />
          There are currently {players.length} people entered, competing to win{' '}
          {balanceInEther} ether!
        </p>
        <hr />
        <form onSubmit={onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              type="text"
              value={value}
              onChange={(e) => this.setState({ value: e.target.value })}
            ></input>
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Time to pick a winner?</h4>
        <button onClick={pickWinner}>Pick a winner</button>
        <hr />
        <h1>{message}</h1>
      </div>
    );
  }
}
export default App;
