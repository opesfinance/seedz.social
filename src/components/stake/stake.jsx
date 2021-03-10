import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment } from '@material-ui/core';
import axios from 'axios';

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
  EXIT_RETURNED,
  GET_BALANCES_RETURNED,
  BOOST_STAKE,
} from '../../constants';
import rewardsMapper from '../utils/rewardsMapper';
import styles from './stakeStyles';

const { emitter, dispatcher, store } = Store;

const Stake = (props) => {
  const address = props.match.params.address;

  const [account] = useState(store.getStore('account'));
  const [themeType, setThemeType] = useState(store.getStore('themeType'));

  const [rewardPools, setRewardPools] = useState(
    rewardsMapper(store.getStore('rewardPools'))
  );

  const getPool = () => rewardPools.find((p) => p.address === address);

  const [pool, setPool] = useState(getPool());

  const [stakevalue, setStakeValue] = useState('main');
  const [balanceValid, setBalanceValid] = useState(false); // not used
  const [loading, setLoading] = useState(!(account && pool));
  const [stakeView, setStakeView] = useState('options'); // switchea buyboost y options para el render
  const [voteLockValid, setVoteLockValid] = useState(false); // not used
  const [voteLock, setVoteLock] = useState(null); // not used
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarType, setSnackbarType] = useState(null); // not used
  const [activeClass, setActiveClass] = useState(store.getStore('activeClass')); // not used
  const [amountStakeError, setAmountStakeError] = useState(false);
  const [fieldId, setFieldId] = useState('');

  const initialAmounts = {};
  initialAmounts[`${pool.id}_stake`] = '0.0000000';
  initialAmounts[`${pool.id}_unstake`] = '0.0000000';
  const [amounts, setAmounts] = useState(initialAmounts);
  const [amountError, setAmountError] = useState(false);
  const [gasPrice, setGasPrice] = useState(0);

  console.log('pool ------------', pool);

  const operationMapper = {
    stake: 'balance',
    unstake: 'stakedBalance',
  };

  useEffect(() => {
    if (!pool) props.history.push('/');
  }, []);

  async function fetchData(source) {
    try {
      let {
        data,
      } = await axios.get(
        'https://ethgasstation.info/api/ethgasAPI.json?api-key=3f07e80ab9c6bdd0ca11a37358fc8f1a291551dd701f8eccdaf6eb8e59be',
        { cancelToken: source.token }
      );
      console.log('gasPrice', data.fastest);
      setGasPrice(data.fastest);
    } catch (error) {}
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    fetchData(source);
    return () => {
      source.cancel('');
    };
  }, []);

  useEffect(() => {
    store.getStore('currentPool');

    emitter.on(ERROR, errorReturned);
    emitter.on(STAKE_RETURNED, showHash);
    emitter.on(WITHDRAW_RETURNED, showHash);
    emitter.on(EXIT_RETURNED, showHash);
    emitter.on(GET_REWARDS_RETURNED, showHash);
    emitter.on(GET_BALANCES_RETURNED, balancesReturned);

    return () => {
      emitter.removeListener(ERROR, errorReturned);
      emitter.removeListener(STAKE_RETURNED, showHash);
      emitter.removeListener(WITHDRAW_RETURNED, showHash);
      emitter.removeListener(EXIT_RETURNED, showHash);
      emitter.removeListener(GET_REWARDS_RETURNED, showHash);
      emitter.removeListener(GET_BALANCES_RETURNED, balancesReturned);
    };
  }, []);

  const balancesReturned = () => {
    const currentPool = pool; //store.getStore('currentPool');
    const pools = store.getStore('rewardPools');
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id;
    });

    if (newPool.length > 0) {
      newPool = newPool[0];
      store.setStore({ currentPool: newPool });
    }
  };

  const parseAmount = (amount) => {
    return (Math.floor(amount * 1000000000) / 1000000000).toFixed(9);
  };

  const showHash = (txHash) => {
    setSnackbarType(null);
    setSnackbarMessage(null);
    setLoading(false);

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
    setLoading(false);

    setTimeout(() => {
      setSnackbarMessage(error.toString());
      setSnackbarType('Error');
    });
  };

  const validateBoost = () => {
    if (pool.costBooster > pool.boostBalance) {
      emitter.emit(ERROR, 'insufficient funds to activate Beast Mode');
    } else if (pool.timeToNextBoost - new Date().getTime() / 1000 > 0) {
      emitter.emit(ERROR, 'Too soon to activate BEAST Mode again');
    } else {
      onBuyBoost();
    }
  };

  const onBuyBoost = () => {
    setAmountError(false);
    console.log('pool ----------', pool);
    const selectedToken = pool.token;
    const amount = amounts[selectedToken.id + '_stake'];
    const value = (selectedToken.costBooster + 0.0001).toFixed(10).toString();

    setLoading(true);
    dispatcher.dispatch({
      type: BOOST_STAKE,
      content: { asset: pool.token, amount, value },
    });
  };

  const onClaim = () => {
    setLoading(true);
    dispatcher.dispatch({
      type: GET_REWARDS,
      content: { asset: pool.token },
    });
  };

  const onStake = () => {
    console.log('staking ------------');
    setAmountError(false);
    setAmountStakeError(false);
    const selectedToken = pool.token;
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
      setLoading(true);
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
    setLoading(true);
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
              disabled={loading}
              className={
                amountStakeError && fieldId === `${pool.id}_${type}`
                  ? 'border-btn-error mb-1'
                  : 'border-btn mb-1'
              }
              id={`${pool.id}_${type}`}
              value={amount}
              error={amountError}
              onChange={onChange}
              placeholder='0.0000000'
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <Typography variant='h6'>{pool.symbol}</Typography>
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
                          pool.symbol +
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
                disabled={pool.disableStake}
                className={
                  'pool-' +
                  type +
                  '-button d-flex align-items-center justify-content-center btn'
                }
                onClick={action}
              >
                {type}
              </button>
            )}
            {type == 'unstake' && (
              <button
                disabled={pool.disableStake}
                className={
                  'pool-' +
                  type +
                  '-button d-flex align-items-center justify-content-center btn unstake'
                }
              >
                {type}
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
    newAmounts[`${id}_${type}`] = rounded;

    console.log('newAmounts --------', newAmounts);
    setAmounts(newAmounts);
  };

  const stakeHeader = (params) => {
    return (
      <Row>
        <Col lg='2' md='2' xs='6' className='text-left'>
          <img
            className='pool-logo'
            alt=''
            src={require(`../../assets/logos/${pool.symbol}.png`)}
          />
        </Col>
        <Col lg='10' md='10' xs='6' className='text-left pool-header'>
          <div className='text-left'>
            <div className='text-purple pool-name'>{pool.name}</div>
            <a
              href={'https://etherscan.io/address/' + pool.address}
              rel='noopener noreferrer'
              target='_blank'
              className='text-purple'
            >
              {pool.address}
            </a>
          </div>
        </Col>
      </Row>
    );
  };

  const mainRender = () => {
    return (
      <>
        {stakevalue === 'main' && (
          <StakeMain
            renderAssetInput={renderAssetInput}
            pool={pool}
            onExit={onExit}
            gasPrice={gasPrice}
            onClaim={onClaim}
            navigateInternal={setStakeView}
          />
        )}
      </>
    );
  };

  return (
    <>
      <div className='info-header'></div>
      <div className='info-header-down'></div>

      <div className='p-5 ml-5 text-center '>
        <div className='p-5 ml-5 text-center '>
          {stakeHeader()}
          {stakeView === 'options' && mainRender()}
          {stakeView === 'buyboost' && (
            <StakeBuyBoost
              validateBoost={validateBoost}
              showHash={showHash}
              pool={pool}
            />
          )}

          {snackbarMessage && (
            <Snackbar
              type={snackbarType}
              message={snackbarMessage}
              open={true}
            />
          )}
          {loading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default withRouter(withStyles(styles)(Stake));
