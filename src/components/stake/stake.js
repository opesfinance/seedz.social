import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment } from '@material-ui/core';
// import axios from 'axios';
import Web3 from 'web3';

import Loader from '../loader/loader';
import Snackbar from '../snackbar/snackbar';

import Store from '../../stores/store';

import { Col, Row } from 'react-bootstrap';
import StakeMain from './stakemain';
import StakeBuyBoost from './stakeBuyBoost';

import {
  ERROR,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  GET_BALANCES,
  EXIT_RETURNED,
  GET_BOOSTEDBALANCES_RETURNED,
  GET_BOOSTEDBALANCES,
  BOOST_STAKE,
} from '../../constants';
import rewardsMapper from '../utils/rewardsMapper';
import styles from './stakeStyles';

import {
  FaDiscord,
  FaInstagramSquare,
  FaMedium,
  FaTelegram,
  FaTwitterSquare,
  FaYoutube,
} from 'react-icons/fa';

// import { AiFillChrome } from 'react-icons/ai';
import { IoGlobeSharp } from 'react-icons/io5';

const { emitter, dispatcher, store } = Store;

const Stake = (props) => {
  const [loaders, setLoaders] = useState({
    buyingWpe: false,
    addingSeedzToMetamask: false,
    claimingRewards: false,
    claimAndUnstaking: false,
    staking: false,
    unStaking: false,
    beastModing: false, // sorry the word
  });

  const [allowance, setAllowance] = useState({
    stake: false,
  });

  const handleLoader = (method, loaderKey, params) => {
    let p = params || [];
    console.log(p);
    let l = { ...loaders };
    l[loaderKey] = true;
    setLoaders(l);
    method.apply(null, [...p, loaderKey]);
  };

  // if !loader, resets all loaders
  const freeLoader = (loaderKey) => {
    let l = { ...loaders };
    if (!loaderKey) {
      for (const key of Object.keys(loaders)) l[key] = false;
      return setLoaders(l);
    }
    l[loaderKey] = false;
    setLoaders(l);
  };

  const address = props.match.params.address;

  // const [account] = useState(store.getStore('account'));
  const [timeForReduction, setTimeForReduction] = useState('');
  // const [themeType, setThemeType] = useState(store.getStore('themeType'));

  const [rewardPools, setRewardPools] = useState(
    rewardsMapper(store.getStore('rewardPools'))
  );

  const [farmPools, setFarmPools] = useState(
    rewardsMapper(store.getStore('farmPools'))
  );

  const getPool = () =>
    rewardPools.find((p) => p.address === address) ||
    farmPools.find((p) => p.token.rewardsAddress == address);

  const [pool, setPool] = useState(getPool());

  const [isHive] = useState(!pool.id.includes('farm'));

  // const [stakevalue, setStakeValue] = useState('main');
  // const [balanceValid, setBalanceValid] = useState(false); // not used
  // const [loading, setLoading] = useState(!(account && pool));
  const [stakeView, setStakeView] = useState('options'); // switchea buyboost y options para el render
  // const [voteLockValid, setVoteLockValid] = useState(false); // not used
  // const [voteLock, setVoteLock] = useState(null); // not used
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarType, setSnackbarType] = useState(null); // not used
  // const [activeClass, setActiveClass] = useState(store.getStore('activeClass')); // not used
  const [amountStakeError, setAmountStakeError] = useState(false);
  const [fieldId, setFieldId] = useState('');

  const initialAmounts = {};
  initialAmounts[`${pool.id}_stake`] = '0.000000000';
  initialAmounts[`${pool.id}_unstake`] = '0.000000000';
  const [amounts, setAmounts] = useState(initialAmounts);
  const [amountError, setAmountError] = useState(false);
  const [costBoosterETH, setCostBoosterETH] = useState(null);
  const [stakedAmountUsd, setStakedAmountUsd] = useState(0);

  const operationMapper = {
    stake: 'balance',
    unstake: 'stakedBalance',
  };

  const assetIn = store.getStore('poolInTokens').find((i) => i.label == 'ETH');

  const getStakedAmountUsd = async (address, stakedBalance, ethPrice) => {
    try {
      const assetOut = store
        .getStore('exchangeAssets')
        .tokens.find(
          ({ liquidityPoolAddress }) => address == liquidityPoolAddress
        );

      if (assetOut && stakedBalance) {
        let ethUnitPrice = await store.getLpAmountOut(assetIn, assetOut, `1`);
        let coinEthRelation = ethUnitPrice / stakedBalance;
        let ethStakedPrice = 1 / coinEthRelation;
        let stakedAmountUsd = ethStakedPrice * ethPrice;
        console.log(stakedAmountUsd);
        return stakedAmountUsd;
        // setStakedAmountUsd((+stakedAmountUsd).toFixed(3));
      } else {
        return 0;
      }
    } catch (error) {
      // console.log(error);
      throw error;
    }
  };

  const getStakeAllowance = async () => {
    let stakeAllowance = await store.checkAllowance(
      pool.token,
      pool.token.rewardsAddress
    );
    setAllowance({ ...allowance, stake: +stakeAllowance });
    console.log(+stakeAllowance);
  };

  useEffect(() => {
    if (!pool) props.history.push('/');

    getStakeAllowance();

    store.getStore('currentPool');

    dispatcher.dispatch({ type: GET_BALANCES, content: {} });
    dispatcher.dispatch({ type: GET_BOOSTEDBALANCES, content: {} });

    emitter.on(ERROR, errorReturned);
    emitter.on(STAKE_RETURNED, showHash);
    emitter.on(WITHDRAW_RETURNED, showHash);
    emitter.on(EXIT_RETURNED, showHash);
    emitter.on(GET_REWARDS_RETURNED, showHash);
    // emitter.on(GET_BALANCES_RETURNED, balancesReturned);
    emitter.on(GET_BOOSTEDBALANCES_RETURNED, balancesReturned);

    return () => {
      emitter.removeListener(GET_BOOSTEDBALANCES_RETURNED, balancesReturned);
      emitter.removeListener(ERROR, errorReturned);
      emitter.removeListener(STAKE_RETURNED, showHash);
      emitter.removeListener(WITHDRAW_RETURNED, showHash);
      emitter.removeListener(EXIT_RETURNED, showHash);
      emitter.removeListener(GET_REWARDS_RETURNED, showHash);
      // emitter.removeListener(GET_BALANCES_RETURNED, balancesReturned);
    };
  }, []);

  const balancesReturned = async () => {
    console.log('balances returned');
    // const currentPool = pool; //store.getStore('currentPool');

    // i think this should be in an upper level. though only being used here
    const assetsOut = store.getStore('lpTokens');

    let promises = assetsOut.map((assetOut) => store.getLpPrice(assetOut));
    await Promise.all(promises);

    const pools = rewardsMapper(store.getStore('rewardPools'));

    const farmPools = rewardsMapper(store.getStore('farmPools'));
    let pool =
      pools.find((p) => p.address === address) ||
      farmPools.find((p) => p.token.rewardsAddress == address);

    setPool(pool);

    const stakedAmountUsd = await getStakedAmountUsd(
      pool.token.address,
      pool.token.stakedBalance,
      pool.token.ethPrice
    );
    setStakedAmountUsd((+stakedAmountUsd).toFixed(3));
  };

  const parseAmount = (amount) => {
    return (Math.floor(amount * 1000000000) / 1000000000).toFixed(9);
  };

  const onAddSeeds = async (pool, loaderKey) => {
    // console.log(pool);
    // return console.log(loaderKey);
    let provider = new Web3(store.getStore('web3context').library.provider);
    provider = provider.currentProvider;
    provider.sendAsync(
      {
        method: 'metamask_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: pool.tokenAddress,
            symbol: pool.tokenSymbol,
            decimals: 18,
            image: '',
          },
        },
        id: Math.round(Math.random() * 100000),
      },
      (err, added) => {
        freeLoader(loaderKey);
        console.log('provider returned', err, added);
        if (err || 'error' in added) {
          return emitter.emit(ERROR, 'There was a problem adding the token.');
        }
      }
    );
  };

  const onAddPool = async (pool) => {
    let provider = new Web3(store.getStore('web3context').library.provider);
    provider = provider.currentProvider;
    provider.sendAsync({
      method: 'metamask_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: pool.address,
          symbol: pool.symbol,
          decimals: 18,
          image: '',
        },
      },
    });
  };

  const showHash = (txHash) => {
    setSnackbarType(null);
    setSnackbarMessage(null);
    // setLoading(false);
    freeLoader(null);

    balancesReturned();

    setTimeout(() => {
      setSnackbarMessage(txHash);
      setSnackbarType('Hash');
    });
  };

  const errorReturned = (error) => {
    console.log('error returned', error);
    setSnackbarMessage(null);
    setSnackbarType(null);
    // setLoading(false);
    freeLoader(null);

    setTimeout(() => {
      if (error?.code != -32000) {
        setSnackbarMessage(error.toString());
        setSnackbarType('Warning');
      }
    });
  };

  /**
   * @param {Number} beastModesAmount - uses only when hive is WBTC
   */
  const validateBoost = (beastModesAmount) => {
    if (pool.costBooster > pool.boostBalance) {
      emitter.emit(ERROR, 'insufficient funds to activate Beast Mode');
    } else if (pool.timeToNextBoost - new Date().getTime() / 1000 > 0) {
      emitter.emit(ERROR, 'Too soon to activate BEAST Mode again');
    } else {
      onBuyBoost(beastModesAmount);
    }
  };

  const getBoosterPriceBulk = async (amount) => {
    let data = await store.getBoosterPriceBulk(pool.token, amount);
    setCostBoosterETH(data.boosterPrice);
    setPool({ ...pool, stakeValueNextBooster: data.newBoostBalance });
  };

  const onBuyBoost = (beastModesAmount) => {
    setAmountError(false);
    const selectedToken = pool.token;
    const amount = amounts[selectedToken.id + '_stake'];

    const value =
      costBoosterETH != null
        ? costBoosterETH
        : (selectedToken.costBooster + 0.0001).toFixed(10).toString();

    // return console.log(pool.token, amounts, amount, value, beastModesAmount);
    // setLoading(true);
    dispatcher.dispatch({
      type: BOOST_STAKE,
      content: {
        asset: { ...pool.token, isHive },
        amount,
        value,
        beastModesAmount,
        // costBoosterETH,
      },
    });
  };

  const onClaim = () => {
    // setLoading(true);
    console.log(pool.token);
    dispatcher.dispatch({
      type: GET_REWARDS,
      content: { asset: pool.token },
    });
  };

  const onStake = () => {
    console.log('staking ------------!');
    setAmountError(false);
    setAmountStakeError(false);
    const selectedToken = pool.token;
    console.log(pool);
    setFieldId('');
    const amount = amounts[selectedToken.id + '_stake'];

    console.log(amount);
    console.log(selectedToken);

    if (amount > 0) {
      dispatcher.dispatch({
        type: STAKE,
        content: { asset: pool.token, amount },
      });
    } else {
      setFieldId(selectedToken.id + '_stake');
      setAmountStakeError(true);
      emitter.emit(ERROR, 'Please enter the amount on the Stake field');
    }
  };

  const onUnstake = () => {
    console.log('unstaking ------------');
    setAmountError(false);
    setAmountStakeError(false);
    setFieldId('');
    const amount = amounts[pool.id + '_unstake'];
    console.log(amounts);
    if (amount > 0) {
      // setLoading(true);
      dispatcher.dispatch({
        type: WITHDRAW,
        content: { asset: pool.token, amount },
      });
    } else {
      setFieldId(`${pool.id}_unstake`);
      setAmountStakeError(true);
      emitter.emit(ERROR, 'Please enter the amount on the Un-Stake field');
    }
  };

  const onExit = () => {
    // setLoading(true);
    dispatcher.dispatch({ type: EXIT, content: { asset: pool.token } });
  };

  const renderAssetInput = (pool, type) => {
    const { classes } = props;

    const amount = amounts[`${pool.id}_${type}`];
    const action = type === 'unstake' ? onUnstake : onStake;
    let amountError = amounts[`${pool.id}_${type}_error`];
    return (
      <div className={classes.valContainer} key={`${pool.id}_${type}`}>
        <Row>
          <Col lg='8' md='8' sm='10' xs='12'>
            <Typography
              onClick={() => {
                setAmount(
                  pool.id,
                  type,
                  pool ? parseAmount(pool.token[operationMapper[type]]) : 0
                );
              }}
              className='pool-max-balance text-right'
            >
              Use Max Balance
            </Typography>
          </Col>
        </Row>
        <Row>
          <Col lg='8' md='12' sm='12' xs='12'>
            <TextField
              // disabled={loading}
              className={
                amountStakeError && fieldId === `${pool.id}_${type}`
                  ? 'border-btn-error mb-1'
                  : 'border-btn mb-1'
              }
              id={`${pool.id}_${type}`}
              value={amount}
              error={amountError}
              onChange={onChange}
              placeholder='0.000000000'
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <Typography variant='h6'>
                      {pool.stakedSymbol || pool.symbol}
                    </Typography>
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
                        src={require('../../assets/logos/' +
                          (pool.token.stakedSymbolLogo || pool.symbol) +
                          '.png')}
                        height='30px'
                      />
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          </Col>

          <Col className='text-center'>
            {type == 'stake' && (
              <button
                disabled={pool.disableStake || loaders?.staking}
                className={
                  'pool-' +
                  type +
                  '-button d-flex align-items-center justify-content-center btn'
                }
                onClick={() => {
                  handleLoader(action, 'staking');
                }}
              >
                {loaders?.staking
                  ? 'Complete in metamask'
                  : allowance['stake']
                  ? type
                  : 'Approve'}
              </button>
            )}
            {type == 'unstake' && (
              <button
                disabled={pool.name != 'Crypto Club Pool' || loaders?.unStaking} // meanwhile disable by name. there should be a prop to choose which pools to disableUnstake
                onClick={() => {
                  handleLoader(action, 'unStaking');
                }}
                className={
                  'pool-' +
                  type +
                  '-button d-flex align-items-center justify-content-center btn'
                }
              >
                {loaders?.unStaking ? 'Complete in metamask' : type}
              </button>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  const onChange = (event) => {
    console.log('onchange ------------', event.target.value);
    console.log('current amounts ------------', amounts);
    console.log('event.target.id', event.target.id);
    let newAmount = {};
    newAmount[event.target.id] = event.target.value;
    console.log('newamount ------------', newAmount);
    setAmountStakeError(false);
    setAmounts({ ...amounts, ...newAmount });
  };

  const setAmount = (id, type, balance) => {
    const rounded = (
      Math.floor((balance === '' ? '0' : balance) * 1000000000) / 1000000000
    ).toFixed(9);
    const newAmounts = { ...amounts };
    console.log('newAmounts ---', newAmounts);
    console.log('balance ---', balance);
    console.log('pool ---', pool);
    newAmounts[`${id}_${type}`] = rounded;

    console.log('newAmounts --------', newAmounts);
    setAmounts(newAmounts);
  };

  const whiteStyle = {
    color: 'white',
    padding: '0.1rem',
    fontSize: '2.3em',
  };

  const darkIcons = {
    discord: <FaDiscord style={whiteStyle} />,
    instagram: <FaInstagramSquare style={whiteStyle} />,
    medium: <FaMedium style={whiteStyle} />,
    telegram: <FaTelegram style={whiteStyle} />,
    twitter: <FaTwitterSquare style={whiteStyle} />,
    website: <IoGlobeSharp style={whiteStyle} />,
    youtube: <FaYoutube style={whiteStyle} />,
  };

  const blueStyle = {
    color: '#7c6ebb',
    padding: '0.1rem',
    fontSize: '2.3em',
  };

  const lightIcons = {
    discord: <FaDiscord style={blueStyle} />,
    instagram: <FaInstagramSquare style={blueStyle} />,
    medium: <FaMedium style={blueStyle} />,
    telegram: <FaTelegram style={blueStyle} />,
    twitter: <FaTwitterSquare style={blueStyle} />,
    website: <IoGlobeSharp style={blueStyle} />,
    youtube: <FaYoutube style={blueStyle} />,
  };

  const socialLinks =
    pool.socialLinks &&
    Object.keys(pool.socialLinks).map((key) => {
      const icons =
        localStorage['theme'] == 'dark-mode' ? darkIcons : lightIcons;
      return (
        <a
          key={key}
          href={pool.socialLinks[key]}
          className='mr-2'
          target='_blank'
        >
          {icons[key]}
        </a>
      );
    });

  const stakeHeader = (
    <div
      className='stake-header stake-header-upper-section'
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '1rem',
        height: 'auto',
        paddingBottom: '1rem',
      }}
    >
      <Row
        className='justify-content-md-center'
        style={{ paddingLeft: '4rem' }}
      >
        <Col sm className='text-left'>
          <img
            className='pool-logo'
            alt=''
            src={require(`../../assets/logos/${
              pool.imageLogo || pool.symbol
            }.png`)}
          />
        </Col>
        <Col lg='10' md='10' xs='12' className='text-left'>
          <div className='stake-header-text pool-name'>{pool.name}</div>
          <a
            href={'https://etherscan.io/address/' + pool.address}
            rel='noopener noreferrer'
            target='_blank'
            className='stake-header-text'
          >
            {pool.address}
          </a>
          <div className='mt-2'>{socialLinks}</div>
        </Col>
      </Row>
    </div>
  );

  const hiveDetail = (
    <StakeMain
      timeForReduction={timeForReduction}
      renderAssetInput={renderAssetInput}
      pool={pool}
      onExit={onExit}
      onClaim={onClaim}
      navigateInternal={setStakeView}
      isHive={isHive}
      handleLoader={handleLoader}
      loaders={loaders}
      stakedAmountUsd={stakedAmountUsd}
      onAddSeeds={onAddSeeds}
    />
  );

  return (
    <>
      {stakeHeader}
      <div
        className='m-5'
        style={{
          paddingLeft: '2rem',
        }}
      >
        <div
          style={{
            marginTop: '9rem',
          }}
        >
          {stakeView === 'options' && hiveDetail}
          {stakeView === 'buyboost' && (
            <StakeBuyBoost
              loaders={loaders}
              handleLoader={handleLoader}
              validateBoost={validateBoost}
              costBoosterETH={costBoosterETH}
              getBoosterPriceBulk={getBoosterPriceBulk}
              showHash={showHash}
              isHive={isHive}
              pool={pool}
            />
          )}
          {snackbarMessage && (
            <Snackbar
              type={snackbarType}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              message={snackbarMessage}
              open={true}
            />
          )}
          {<Loader />}
        </div>
      </div>
    </>
  );
};

export default withRouter(withStyles(styles)(Stake));
