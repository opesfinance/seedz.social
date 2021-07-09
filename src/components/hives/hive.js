import React, { useEffect, useState } from 'react';
import CountDown from '../utils/countDown';
import NftSelector from '../utils/NftSelector';

import './hive.scss';
import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';
const { store } = Store;

const Hive = (props) => {
  // console.log(props);
  const address = `${props.address.substring(0, 5)}...${props.address.substring(
    props.address.length - 4,
    props.address.length
  )}`;

  const [stakedAmountUsd, setStakedAmountUsd] = useState(
    props.token.stakedBalance
  );
  const [totalLockVolume, setTotalLockVolume] = useState(0);

  const hiveid2LpLabel = {
    strhive: 'STR',
    pixelhive: 'PIXEL',
    lifthive: 'LIFT',
    yfuhive: 'YFU',
    wpehive: 'WPE',
    wbtchive: 'WBTC',
    wpeshive: 'WPE',
    yfushive: 'WPE',
    strshive: 'WPE',
    pixelshive: 'WPE',
  };

  const initTotalLockVolume = async () => {
    if (!!props.token.disableStake) return;
    setTotalLockVolume(
      await store.getTotalLockVolume(
        hiveid2LpLabel[props.token.hiveId],
        props.token
      )
    );
  };
  useEffect(() => {
    initTotalLockVolume();
  }, [props.id]);

  function navigateStake(token) {
    store.setStore({ currentPool: token });
    props.history.push('/stake/' + props.address);
  }

  useEffect(() => {
    store.getStakedAmountUsd(props.token).then(setStakedAmountUsd);
  }, []);

  return (
    <div className='hive-wrapper card'>
      {/* <div className='text-right'>
        {props.data?.isSuperHive && (
          <div className='m-1'>
            <NftSelector
              data={props.data}
              ddOptions={store
                .getStore('exchangeAssets')
                .tokens.filter((a) => a.group == 'inputs')}
            />
          </div>
        )}
      </div> */}
      {props.token.isSuper ? (
        <NftSelector pool={props.data} onChange={() => {}} />
      ) : (
        ''
      )}
      <div className={`card-body ${props.data?.isSuperHive && 'pt-0'}`}>
        <div className='hive-header'>
          <div>
            <div className='hive-logo'>
              <img
                alt=''
                className='hive-image'
                src={require(`../../assets/logos/${props.data.symbol}.png`)}
              />
            </div>
            <div className='main-blue'>{props.data.name}</div>
            <a
              href={'https://etherscan.io/address/' + props.address}
              className='address'
              target='_blank'
            >
              {address}
            </a>
          </div>
        </div>
        <br />

        <div className='hive-details'>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot green'></span>
              Beast Bonus (leverage)
            </div>
            <div className='text-right main-blue'>{props.beastBonus * 10}%</div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot yellow'></span>
              Beast Bonus -100% reduction in
            </div>
            <div className='text-right main-blue'>
              <CountDown pool={props.token} />
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot purple'></span>
              Weekly Rewards
            </div>
            <div className='text-right main-blue'>
              {props.weeklyRewards?.toFixed(4) || 0} {props.rewardsSymbol}
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot purple'></span>
              Lockup Time
            </div>
            <div className='text-right main-blue'>
              {props.address == '0x9411aE40e4EefE2BDCF6F4e2beC81BEb7682bC63'
                ? '2'
                : '12'}{' '}
              months
            </div>
          </div>
          {totalLockVolume ? (
            <div className='d-flex justify-content-between'>
              <div>
                <span className='dot orange'></span>
                Total lock volume
              </div>
              <div className='text-right main-blue'>
                {totalLockVolume.toLocaleString()} USD
              </div>
            </div>
          ) : (
            ''
          )}
          <hr />
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot yellow'></span>
              My staked amount
            </div>
            <div className='text-right main-blue'>
              {props.token.stakedBalance?.toFixed(6) || 0} {props.data.symbol}
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot yellow'></span>
              My staked value (USD)
            </div>
            <div className='text-right main-blue'>
              {stakedAmountUsd || '0'} USD
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot light-blue'></span>
              My Beast Mode (leverage)
            </div>
            <div className='text-right main-blue'>
              {props.data.myBeastModes * 10}%
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot orange'></span>
              My Rewards
            </div>
            <div className='text-right main-blue'>
              {props.data.myRewards.toFixed(4)} {props.rewardsSymbol}
            </div>
          </div>

          <div className='text-center pt-4'>
            <button
              type='button'
              onClick={() => {
                if (props.id !== 'balancer-pool') {
                  navigateStake(props.token);
                }
              }}
              className='btn btn-primary bg-main-blue main-btn btn-block'
            >
              View
            </button>
            <button
              type='button'
              onClick={() => {
                // if (props.token.name == 'WPE-LP')
                //   return window.open(props.token.liquidityLink);

                if (!props.token.disableStake)
                  return props.history.push('/pools/' + props.token.address);
                // if (props.id !== 'balancer-pool') {
                //   navigateStake(props.token);
                // }
              }}
              className={
                props.token.disableStake
                  ? 'btn btn-secondary bg-main-blue main-btn btn-block disabled'
                  : 'btn btn-primary bg-main-blue main-btn btn-block'
              }
            >
              Add liquidity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Hive);
