import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment } from '@material-ui/core';

import Loader from '../loader';
import Snackbar from '../snackbar';

import Store from '../../stores/store';

import { Col, Row, Card } from 'react-bootstrap';

import LeftNav from '../leftnav/leftnav';
import Header from '../header/header';
import Footer from '../footer/footer';

import {
  ERROR,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  GET_BALANCES_RETURNED,
  BOOST_STAKE,
} from '../../constants';

const styles = (theme) => ({
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem',
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px',
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer',
  },

  voteLockMessage: {
    margin: '20px',
  },
});

const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

class Stake extends Component {
  constructor(props) {
    super();

    const account = store.getStore('account');
    const pool = store.getStore('currentPool');
    const themeType = store.getStore('themeType');
    const activeClass = store.getStore('activeClass');

    if (!pool) {
      props.history.push('/');
    }

    this.state = {
      activeClass: activeClass,
      themeType: themeType,
      pool: pool,
      loading: !(account || pool),
      account: account,
      value: 'options',
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
      stakevalue: 'main',
    };
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(EXIT_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(EXIT_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  balancesReturned = () => {
    const currentPool = store.getStore('currentPool');
    const pools = store.getStore('rewardPools');
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id;
    });

    if (newPool.length > 0) {
      newPool = newPool[0];
      store.setStore({ currentPool: newPool });
    }
  };

  showHash = (txHash) => {
    this.setState({
      snackbarMessage: null,
      snackbarType: null,
      loading: false,
    });
    const that = this;
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' };
      that.setState(snackbarObj);
    });
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null };
    this.setState(snackbarObj);
    this.setState({ loading: false });
    const that = this;
    setTimeout(() => {
      const snackbarObj = {
        snackbarMessage: error.toString(),
        snackbarType: 'Error',
      };
      that.setState(snackbarObj);
    });
  };

  render() {
    const { value, pool, loading, snackbarMessage } = this.state;

    if (!pool) {
      return null;
    }

    return (
      <>
        <div className='dark-mode m-0 p-0'>
          <Header />
          <LeftNav />

          <div className='main-content p-5 ml-5 text-center '>
            {/* CONTENT */}
            <h1>Stake page</h1>

            {value === 'options' && this.renderOptions2()}
            {value === 'buyboost' && this.renderBuyBoost()}

            {snackbarMessage && this.renderSnackbar()}
            {loading && <Loader />}
          </div>

          <Footer />
        </div>
      </>
    );
  }

  renderOptions2 = () => {
    const { pool, stakevalue } = this.state;
    var address = null;
    let addy = '';
    if (pool.tokens && pool.tokens[0]) {
      addy = pool.tokens[0].rewardsAddress;
      address =
        addy.substring(0, 6) +
        '...' +
        addy.substring(addy.length - 4, addy.length);
    }
    return (
      <>
        <Row>
          <Col lg='4' md='12' xs='12' className='p-1'>
            <div className='mt-2 text-center rounded p-2'>
              <h4 className='p-2 rounded text-white'>{pool.name}</h4>
              <p>
                Total deposited:{' '}
                {pool.tokens[0].stakedBalance
                  ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal)
                  : '0'}
                <br></br>
                Pool Rate:{' '}
                {pool.ratePerWeek ? pool.ratePerWeek.toFixed(4) : '0.0'}{' '}
                {pool.tokens[0].poolRateSymbol}
                <br />
                Contract Address:{' '}
                <a
                  href={'https://etherscan.io/address/' + addy}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {address}
                </a>
                .
              </p>
            </div>
          </Col>
          <Col lg='8' md='12' xs='12' className='p-1'>
            <table className='table mt-5'>
              <thead>
                <tr>
                  <th>Your Balance</th>
                  <th>Currently Staked</th>
                  <th>Beast Mode X</th>
                  <th>Rewards Available</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {pool.tokens[0].balance
                      ? pool.tokens[0].balance.toFixed(pool.displayDecimal)
                      : '0'}{' '}
                    {pool.tokens[0].symbol}
                  </td>
                  <td>
                    {pool.tokens[0].stakedBalance
                      ? pool.tokens[0].stakedBalance.toFixed(
                          pool.displayDecimal
                        )
                      : '0'}
                  </td>
                  <td>
                    {pool.tokens[0].currentActiveBooster
                      ? pool.tokens[0].currentActiveBooster.toFixed(2)
                      : '0'}
                  </td>
                  <td>
                    {pool.tokens[0].rewardsSymbol === '$'
                      ? pool.tokens[0].rewardsSymbol
                      : ''}{' '}
                    {pool.tokens[0].rewardsAvailable
                      ? pool.tokens[0].rewardsAvailable.toFixed(
                          pool.displayDecimal
                        )
                      : '0'}{' '}
                    {pool.tokens[0].rewardsSymbol !== '$'
                      ? pool.tokens[0].rewardsSymbol
                      : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>

        {stakevalue === 'main' && this.stakeMain()}
      </>
    );
  };

  navigateStakeInternal = (val) => {
    this.setState({ stakevalue: val });
  };

  stakeMain = () => {
    const { pool } = this.state;

    return (
      <Row>
        <Col lg='4' md='12' xs='12' className='p-1'>
          <Card>
            <Card.Body>
              <Card.Title>STAKE</Card.Title>
              {this.renderAssetInput(pool.tokens[0], 'stake')}
              {pool.depositsEnabled && (
                <div
                  className='myButton'
                  onClick={() => {
                    this.onStake();
                  }}
                >
                  STAKE
                </div>
              )}
              {!pool.depositsEnabled && (
                <div className='myButton-disable'>STAKE</div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg='4' md='12' xs='12' className='p-1'>
          <Card>
            <Card.Body>
              <Card.Title>UN-STAKE</Card.Title>
              {this.renderAssetInput(pool.tokens[0], 'unstake')}
              <div
                className='myButton btn-block'
                onClick={() => {
                  this.onUnstake();
                }}
              >
                UNSTAKE
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg='4' md='12' xs='12' className='p-3'>
          <p className='p-0 m-1 text-center'>
            <div
              className='myButton btn-block'
              onClick={() => {
                this.navigateInternal('buyboost');
              }}
            >
              BEAST MODE
            </div>
          </p>

          <p className='p-0 m-1 text-center'>
            <div
              className='myButton btn-block'
              onClick={() => {
                this.onClaim();
              }}
            >
              CLAIM REWARDS
            </div>
          </p>

          <p className='p-0 m-1 text-center'>
            <div
              className='myButton btn-block'
              onClick={() => {
                this.onExit();
              }}
            >
              Exit: Claim & Unstake
            </div>
          </p>
        </Col>

        <Col lg='8' md='12' xs='12'></Col>
      </Row>
    );
  };

  navigateInternal = (val) => {
    this.setState({ value: val });
  };

  renderBuyBoost = () => {
    const { pool } = this.state;

    return (
      <Row>
        <Col lg='6' md='12' xs='12' className='p-1'>
          <div className='mt-2 text-center rounded p-2'>
            <h4 className='p-2 rounded text-white'>{pool.name}</h4>
            <p>
              Total deposited:{' '}
              {pool.tokens[0].stakedBalance
                ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal)
                : '0'}
              <br></br>
              Pool Rate:{' '}
              {pool.ratePerWeek ? pool.ratePerWeek.toFixed(4) : '0.0'}{' '}
              {pool.tokens[0].poolRateSymbol}
            </p>
          </div>

          <table className='table'>
            <thead>
              <tr>
                <th>Your Balance</th>
                <th>Currently Staked</th>
                <th>Beast Mode X</th>
                <th>Rewards Available</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {pool.tokens[0].boostBalance
                    ? pool.tokens[0].boostBalance.toFixed(pool.displayDecimal)
                    : '0'}{' '}
                  ETH{' '}
                </td>
                <td>
                  {pool.tokens[0].stakedBalance
                    ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal)
                    : '0'}
                </td>
                <td>
                  {pool.tokens[0].currentActiveBooster
                    ? pool.tokens[0].currentActiveBooster.toFixed(2)
                    : '0'}
                </td>
                <td>
                  {pool.tokens[0].rewardsSymbol === '$'
                    ? pool.tokens[0].rewardsSymbol
                    : ''}{' '}
                  {pool.tokens[0].rewardsAvailable
                    ? pool.tokens[0].rewardsAvailable.toFixed(
                        pool.displayDecimal
                      )
                    : '0'}{' '}
                  {pool.tokens[0].rewardsSymbol !== '$'
                    ? pool.tokens[0].rewardsSymbol
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col lg='6' md='12' xs='12' className='p-4'>
          <table className='table'>
            <tbody>
              <tr>
                <td className='text-left'>Ethereum Price (USD)</td>
                <td className='text-right'>
                  ${' '}
                  {pool.tokens[0].ethPrice
                    ? pool.tokens[0].ethPrice.toFixed(2)
                    : '0.00'}
                </td>
              </tr>

              <tr>
                <td className='text-left'>Token Balance</td>
                <td className='text-right'>
                  {pool.tokens[0].boostBalance
                    ? pool.tokens[0].boostBalance.toFixed(7)
                    : '0'}{' '}
                  ETH
                </td>
              </tr>
              <tr>
                <td className='text-left'>Cost of Beast Mode</td>
                <td className='text-right'>
                  {pool.tokens[0].costBooster
                    ? pool.tokens[0].costBooster.toFixed(7)
                    : '0'}{' '}
                  ETH
                </td>
              </tr>
              <tr>
                <td className='text-left'>Cost of Beast Mode (USD)</td>
                <td className='text-right'>
                  ${' '}
                  {pool.tokens[0].costBoosterUSD
                    ? pool.tokens[0].costBoosterUSD.toFixed(2)
                    : '0.00'}
                </td>
              </tr>
              <tr>
                <td className='text-left'>Time to next BEAST powerup</td>
                <td className='text-right'>
                  {pool.tokens[0].timeToNextBoost -
                    new Date().getTime() / 1000 >
                  0
                    ? (
                        (pool.tokens[0].timeToNextBoost -
                          new Date().getTime() / 1000) /
                        60
                      ).toFixed(0)
                    : '0'}{' '}
                  Minutes
                </td>
              </tr>
              <tr>
                <td className='text-left'>Beast Modes currently active</td>
                <td className='text-right'>
                  {pool.tokens[0].currentActiveBooster
                    ? pool.tokens[0].currentActiveBooster.toFixed(2)
                    : '0'}
                </td>
              </tr>
              <tr>
                <td className='text-left'>Current Beast Mode stake value</td>
                <td className='text-right'>
                  {pool.tokens[0].currentBoosterStakeValue
                    ? pool.tokens[0].currentBoosterStakeValue.toFixed(7)
                    : '0'}{' '}
                  {pool.tokens[0].symbol}
                </td>
              </tr>
              <tr>
                <td className='text-left'>
                  Staked value after next Beast Mode
                </td>
                <td className='text-right'>
                  {pool.tokens[0].stakeValueNextBooster
                    ? pool.tokens[0].stakeValueNextBooster.toFixed(7)
                    : '0'}{' '}
                  {pool.tokens[0].symbol}
                </td>
              </tr>
            </tbody>
          </table>
          {pool.boost && (
            <div
              className='myButton'
              onClick={() => {
                this.validateBoost();
              }}
            >
              BEAST MODE
            </div>
          )}

          {!pool.boost && <div className='myButton-disable'>BEAST MODE</div>}
        </Col>
      </Row>
    );
  };

  validateBoost = () => {
    const { pool } = this.state;
    if (pool.tokens[0].costBooster > pool.tokens[0].boostBalance) {
      emitter.emit(ERROR, 'insufficient funds to activate Beast Mode');
    } else if (
      pool.tokens[0].timeToNextBoost - new Date().getTime() / 1000 >
      0
    ) {
      emitter.emit(ERROR, 'Too soon to activate BEAST Mode again');
    } else {
      this.onBuyBoost();
    }
  };

  overlayClicked = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  onBuyBoost = () => {
    this.setState({ amountError: false });
    const { pool } = this.state;
    const tokens = pool.tokens;
    const selectedToken = tokens[0];
    const amount = this.state[selectedToken.id + '_stake'];
    const value = (selectedToken.costBooster + 0.0001).toFixed(10).toString();

    this.setState({ loading: true });
    dispatcher.dispatch({
      type: BOOST_STAKE,
      content: { asset: selectedToken, amount: amount, value: value },
    });
  };

  onStake = () => {
    this.setState({ amountError: false });
    this.setState({ amountStakeError: false });
    const { pool } = this.state;

    const tokens = pool.tokens;
    const selectedToken = tokens[0];
    this.setState({ fieldid: '' });
    const amount = this.state[selectedToken.id + '_stake'];

    if (amount > 0) {
      this.setState({ loading: true });
      dispatcher.dispatch({
        type: STAKE,
        content: { asset: selectedToken, amount: amount },
      });
    } else {
      this.setState({ fieldid: selectedToken.id + '_stake' });
      this.setState({ amountStakeError: true });
      emitter.emit(ERROR, 'Please enter the amount on the Stake field');
    }
  };

  onClaim = () => {
    const { pool } = this.state;
    this.setState({ loading: true });
    dispatcher.dispatch({
      type: GET_REWARDS,
      content: { asset: pool.tokens[0] },
    });
  };

  onUnstake = () => {
    this.setState({ amountError: false });
    this.setState({ amountStakeError: false });

    const { pool } = this.state;

    this.setState({ fieldid: '' });
    const amount = this.state[pool.tokens[0].id + '_unstake'];
    if (amount > 0) {
      this.setState({ loading: true });
      dispatcher.dispatch({
        type: WITHDRAW,
        content: { asset: pool.tokens[0], amount: amount },
      });
    } else {
      this.setState({ fieldid: pool.tokens[0].id + '_unstake' });
      this.setState({ amountStakeError: true });
      emitter.emit(ERROR, 'Please enter the amount on the Un-Stake field');
    }
  };

  onExit = () => {
    const { pool } = this.state;
    this.setState({ loading: true });
    dispatcher.dispatch({ type: EXIT, content: { asset: pool.tokens[0] } });
  };

  renderAssetInput = (asset, type) => {
    const { classes } = this.props;

    const { loading, amountStakeError, fieldid } = this.state;

    const amount = this.state[asset.id + '_' + type];
    let amountError = this.state[asset.id + '_' + type + '_error'];

    return (
      <div className={classes.valContainer} key={asset.id + '_' + type}>
        <div className={classes.balances}>
          {type === 'stake' && (
            <Typography
              variant='h6'
              onClick={() => {
                this.setAmount(
                  asset.id,
                  type,
                  asset
                    ? (
                        Math.floor(asset.balance * 1000000000) / 1000000000
                      ).toFixed(9)
                    : 0
                );
              }}
              color='error'
              className={classes.value}
              noWrap
            >
              {'Max Balance: ' +
                (asset && asset.balance
                  ? (
                      Math.floor(asset.balance * 1000000000) / 1000000000
                    ).toFixed(9)
                  : '0.000000000')}{' '}
              {asset ? asset.symbol : ''}
            </Typography>
          )}
          {type === 'unstake' && (
            <Typography
              variant='h6'
              onClick={() => {
                this.setAmount(
                  asset.id,
                  type,
                  asset
                    ? (
                        Math.floor(asset.stakedBalance * 1000000000) /
                        1000000000
                      ).toFixed(9)
                    : 0
                );
              }}
              color='error'
              className={classes.value}
              noWrap
            >
              {'Max Balance: ' +
                (asset && asset.stakedBalance
                  ? (
                      Math.floor(asset.stakedBalance * 1000000000) / 1000000000
                    ).toFixed(9)
                  : '0.000000000')}{' '}
              {asset ? asset.symbol : ''}
            </Typography>
          )}
        </div>
        <div>
          <TextField
            fullWidth
            disabled={loading}
            className={
              amountStakeError && fieldid === asset.id + '_' + type
                ? 'border-btn-error mb-1'
                : 'border-btn mb-1'
            }
            inputRef={(input) =>
              input &&
              fieldid === asset.id + '_' + type &&
              amountStakeError &&
              input.focus()
            }
            id={'' + asset.id + '_' + type}
            value={amount}
            error={amountError}
            onChange={this.onChange}
            placeholder='0.0000000'
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position='end'
                  className={classes.inputAdornment}
                >
                  <Typography variant='h6'>{asset.symbol}</Typography>
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment
                  position='end'
                  className={classes.inputAdornment}
                >
                  <div className={classes.assetIcon}>
                    <img
                      alt=''
                      src={require('../../assets/' +
                        asset.symbol +
                        '-logo.png')}
                      height='30px'
                    />
                  </div>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    );
  };

  renderSnackbar = () => {
    var { snackbarType, snackbarMessage } = this.state;
    return (
      <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
    );
  };

  onChange = (event) => {
    let val = [];
    val[event.target.id] = event.target.value;
    this.setState({ amountStakeError: false });
    this.setState(val);
  };

  setAmount = (id, type, balance) => {
    const bal = (
      Math.floor((balance === '' ? '0' : balance) * 1000000000) / 1000000000
    ).toFixed(9);
    let val = [];
    val[id + '_' + type] = bal;
    this.setState(val);
  };
}

export default withRouter(withStyles(styles)(Stake));
