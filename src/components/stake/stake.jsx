import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment } from '@material-ui/core';

import Loader from '../loader/loader';
import Snackbar from '../snackbar/snackbar';

import Store from '../../stores/store';

import { Col, Row, Card } from 'react-bootstrap';
import Stakemain from './stakemain';
import StakeBuyBoost from './stakeBuyBoost';

import {
  ERROR,
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

const setState = (params) => {
  console.log('set state params', params);
};

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

const Stake = (props) => {
  const address = props.match.params.address;

  const [account, setAccount] = useState(store.getStore('account'));
  const [themeType, setThemeType] = useState(store.getStore('themeType'));

  const [rewardPools, setRewardPools] = useState(
    rewardsMapper(store.getStore('rewardPools'))
  );

  const getPool = () => rewardPools.find((p) => p.address === address);

  const [pool, setPool] = useState(getPool());

  const [stakevalue, setStakeValue] = useState('main');
  const [balanceValid, setBalanceValid] = useState(false); // not used
  const [loading, setLoading] = useState(!(account && pool));
  const [value, setValue] = useState('options'); // switchea buyboost y options para el render
  const [voteLockValid, setVoteLockValid] = useState(false); // not used
  const [voteLock, setVoteLock] = useState(null); // not used
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [snackbarType, setSnackbarType] = useState(null); // not used
  const [activeClass, setActiveClass] = useState(store.getStore('activeClass')); // not used
  const [amountStakeError, setAmountStakeError] = useState(false);
  const [fieldId, setFieldId] = useState('');
  const [amount, setAmount2] = useState(0);
  const [amountError, setAmountError] = useState(false);

  useEffect(() => {
    if (!pool) props.history.push('/');
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
    const currentPool = store.getStore('currentPool');
    console.log('CURRENT POOL ' + currentPool);
    const pools = store.getStore('rewardPools');
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id;
    });

    if (newPool.length > 0) {
      newPool = newPool[0];
      store.setStore({ currentPool: newPool });
    }
  };

  const showHash = (txHash) => {
    setState({
      snackbarMessage: null,
      snackbarType: null,
      loading: false,
    });

    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' };
      setState(snackbarObj);
    });
  };

  const errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null };
    setState(snackbarObj);
    setState({ loading: false });

    setTimeout(() => {
      const snackbarObj = {
        snackbarMessage: error.toString(),
        snackbarType: 'Error',
      };
      setState(snackbarObj);
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

  // not used
  const overlayClicked = () => {
    setState({ modalOpen: true });
  };

  // not used
  const closeModal = () => {
    setState({ modalOpen: false });
  };

  const onBuyBoost = () => {
    setState({ amountError: false });
    const tokens = pool.tokens;
    const selectedToken = tokens[0];
    // const amount = state[selectedToken.id + '_stake'];
    const value = (selectedToken.costBooster + 0.0001).toFixed(10).toString();

    setState({ loading: true });
    dispatcher.dispatch({
      type: BOOST_STAKE,
      content: { asset: selectedToken, amount: amount, value: value },
    });
  };

  const onClaim = () => {
    setState({ loading: true });
    dispatcher.dispatch({
      type: GET_REWARDS,
      content: { asset: pool },
    });
  };

  const onUnstake = () => {
    setState({ amountError: false });
    setState({ amountStakeError: false });

    setState({ fieldId: '' });
    // const amount = state[pool.id + '_unstake'];
    if (amount > 0) {
      setState({ loading: true });
      dispatcher.dispatch({
        type: WITHDRAW,
        content: { asset: pool, amount: amount },
      });
    } else {
      setState({ fieldId: pool.id + '_unstake' });
      setState({ amountStakeError: true });
      emitter.emit(ERROR, 'Please enter the amount on the Un-Stake field');
    }
  };

  const onExit = () => {
    setState({ loading: true });
    dispatcher.dispatch({ type: EXIT, content: { asset: pool } });
  };

  const renderAssetInput = (asset, type) => {
    const { classes } = props; // ni recibe props???
    // const amount = state[asset.id + '_' + type];
    // let amountError = state[asset.id + '_' + type + '_error'];

    return (
      <div className={classes.valContainer} key={asset.id + '_' + type}>
        <Row>
          <Col lg='8' md='8' sm='10' xs='12'>
            {type === 'stake' && (
              <Typography
                onClick={() => {
                  setAmount(
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
                  setAmount(
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
                amountStakeError && fieldId === asset.id + '_' + type
                  ? 'border-btn-error mb-1'
                  : 'border-btn mb-1'
              }
              inputRef={(input) =>
                input &&
                fieldId === asset.id + '_' + type &&
                amountStakeError &&
                input.focus()
              }
              id={'' + asset.id + '_' + type}
              value={amount}
              error={amountError}
              onChange={onChange}
              placeholder='0.0000000'
              InputProps={{
                endAdornment: (
                  <InputAdornment>
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
          </Col>

          <Col className='text-center'>
            <div
              className={
                'pool-' +
                type +
                '-button d-flex align-items-center justify-content-center'
              }
              onClick={() => {
                onUnstake();
              }}
            >
              {type}
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const onChange = (event) => {
    let val = [];
    val[event.target.id] = event.target.value;
    setState({ amountStakeError: false });
    setState(val);
  };

  const setAmount = (id, type, balance) => {
    const rounded = (
      Math.floor((balance === '' ? '0' : balance) * 1000000000) / 1000000000
    ).toFixed(9);
    let amount = [];
    amount[id + '_' + type] = rounded;
    setState(amount);
  };

  const mainRender = () => {
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
        {stakevalue === 'main' && (
          <Stakemain
            renderAssetInput={renderAssetInput}
            pool={pool}
            onExit={onExit}
            onClaim={onClaim}
            navigateInternal={setValue}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Row className='info-header'></Row>
      <Row className='info-header-down'></Row>

      <div className='p-5 ml-5 text-center '>
        <div className='p-5 ml-5 text-center '>
          {value === 'options' && mainRender()}
          {value === 'buyboost' && (
            <StakeBuyBoost validateBoost={validateBoost} pool={pool} />
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
