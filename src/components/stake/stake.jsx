import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment } from '@material-ui/core';

import Loader from '../loader/loader';
import Snackbar from '../snackbar/snackbar';

import Store from '../../stores/store';

import { Col, Row, Card } from 'react-bootstrap';

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
    fontSize: '1.2rem',
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
    marginBottom: '5px',
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

const { emitter, dispatcher, store } = Store;

class Stake extends Component {
  constructor(props) {
    super();

    const account = store.getStore('account');
    const pool = store.getStore('rewardPools')[1];
    console.log(pool);

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
        <Row className='info-header'></Row>
        <Row className='info-header-down'></Row>

        <div className='p-5 ml-5 text-center '>
          <div className='main-content p-5 ml-5 text-center '>
            {/* CONTENT */}

            {value === 'options' && this.renderOptions2()}
            {value === 'buyboost' && this.renderBuyBoost()}

            {snackbarMessage && this.renderSnackbar()}
            {loading && <Loader />}
          </div>
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
          <Col lg='2' md='2' xs='6' className='text-left'>
            <img
              className='pool-logo'
              alt=''
              src={require('../../assets/BPT.png')}
            />
          </Col>
          <Col lg='10' md='10' xs='6' className='text-left pool-header'>
            <div className='text-left'>
              <div className='text-purple pool-name'>{pool.name}</div>
              <a
                href={'https://etherscan.io/address/' + addy}
                rel='noopener noreferrer'
                target='_blank'
                className='text-gray'
              >
                {address}
              </a>
              <p>
                {/*Total deposited:{' '}
                {pool.tokens[0].stakedBalance
                  ? pool.tokens[0].stakedBalance.toFixed(pool.displayDecimal)
                  : '0'}
                <br></br>
                Pool Rate:{' '}
                {pool.ratePerWeek ? pool.ratePerWeek.toFixed(4) : '0.0'}{' '}
                {pool.tokens[0].poolRateSymbol}
                <br />*/}
              </p>
            </div>
          </Col>
          {/*<Col lg='8' md='12' xs='12' className='p-1'>
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
          </Col>*/}
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
    const t = pool.tokens[0];

    return (
      <Row className='pool-boxes'>
        <Col lg='4' md='12' xs='12' className='p-1'>
          <Card className='pool-card'>
            <Card.Body className='text-left'>
              <Card className='pool-card-info'>
                <Row>
                  <Col>Beast Bonus:</Col>
                  <Col className='text-right'>
                    {t.beastBonus ? t.beastBonus : '0'}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info'>
                <Row>
                  <Col> Bonus Reduction in:</Col>
                  <Col className='text-right'>
                    {t.beastBonus ? t.beastBonus : '0'}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info'>
                <Row>
                  <Col>Weekly Rewards:</Col>
                  <Col className='text-right'>
                    {t.beastBonus ? t.beastBonus : '0'}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info'>
                <Row>
                  <Col>Current Gas Price:</Col>
                  <Col className='text-right'>
                    {t.beastBonus ? t.beastBonus : '0'}
                  </Col>
                </Row>
              </Card>
              <Row className='pt-4'>
                <Col className='text-center'>
                  <a
                    href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b'
                    className='btn btn-primary bg-main-white'
                    target='_blank'
                  >
                    Buy WPE
                  </a>
                </Col>
                <Col className='text-center'>
                  <a href='#' className='btn btn-primary bg-main-white'>
                    Add liquidity
                  </a>
                </Col>
              </Row>
              <Row className='pt-4'>
                <Col className='text-center'>
                  <a href='#' className='btn btn-primary bg-main-white'>
                    Add Seedz to{' '}
                    <img
                      alt=''
                      src='data:image/png;base64,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'
                      width='15'
                      height='15'
                      class='d-inline-block align-top'
                    ></img>
                  </a>
                </Col>
                <Col className='text-center'>
                  <a href='#' className='btn btn-primary bg-main-white'>
                    Add BPT to{' '}
                    <img
                      alt=''
                      src='data:image/png;base64,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'
                      width='15'
                      height='15'
                      class='d-inline-block align-top'
                    ></img>
                  </a>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col lg='4' md='12' xs='12' className='p-1'>
          <Card className='pool-card'>
            <Card.Body className='text-left'>
              <div className='hive-details'>
                <div className='hive-value'>
                  <div>
                    <span className='dot green'></span>
                    YOUR BALANCE
                  </div>
                  <div className='text-right main-blue'>{}</div>
                </div>
                <div className='hive-value'>
                  <div>
                    <span className='dot yellow'></span>
                    CURRENTLY STAKED
                  </div>
                  <div className='text-right main-blue'>{} days</div>
                </div>
                <div className='hive-value'>
                  <div>
                    <span className='dot purple'></span>
                    BEAST MODE X
                  </div>
                  <div className='text-right main-blue'>{} Seedz</div>
                </div>
                <div className='hive-value'>
                  <div>
                    <span className='dot light-blue'></span>
                    REWARDS AVAILABLE
                  </div>
                  <div className='text-right main-blue'>{}</div>
                </div>
                <Row className='pt-4'>
                  <Col className='text-center'>
                    <div
                      className='btn btn-primary bg-main-blue'
                      onClick={() => {
                        this.onClaim();
                      }}
                    >
                      Claim Rewards
                    </div>
                  </Col>
                  <Col className='text-center'>
                    <div
                      className='btn btn-primary bg-main-blue'
                      onClick={() => {
                        this.onExit();
                      }}
                    >
                      Claim & Unstake
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg='4' md='12' xs='12' className='p-1'>
          <Card className='pool-card'>
            <Card.Body>
              {this.renderAssetInput(pool.tokens[0], 'stake')}
              <br />
              {this.renderAssetInput(pool.tokens[0], 'unstake')}
              <br />
              Apply a multiplier to your membership
              <Row className='pt-4'>
                <Col className='text-center'>
                  <div
                    className='btn btn-primary bg-main-blue'
                    onClick={() => {
                      this.navigateInternal('buyboost');
                    }}
                  >
                    Beast Mode
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
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
        <Row>
          <Col lg='8' md='8' sm='10' xs='12'>
            {type === 'stake' && (
              <Typography
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
                className='pool-max-balance text-right'
              >
                {'Use Max Balance'}
              </Typography>
            )}
            {type === 'unstake' && (
              <Typography
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
                className='pool-max-balance text-right'
              >
                {'Use Max Balance'}
              </Typography>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg='8' md='12' sm='12' xs='12'>
            <TextField
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
                  <InputAdornment>
                    <Typography variant='h8'>{asset.symbol}</Typography>
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
          </Col>
          <Col
            lg='4'
            md='12'
            sm='12'
            xs='12'
            className={
              'pool-' +
              type +
              '-button d-flex align-items-center justify-content-center'
            }
            onClick={() => {
              this.onUnstake();
            }}
          >
            {type}
          </Col>
        </Row>
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
