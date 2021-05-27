import React, { useState, useEffect } from 'react';
import './farm.scss';

import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';
import CountDown from '../utils/countDown';

const { emitter, dispatcher, store } = Store;

const Farm = (props) => {
  // console.log(props);
  const [totalLockVolume, setTotalLockVolume] = useState(0);

  const address = `${props.address.substring(0, 5)}...${props.address.substring(
    props.address.length - 4,
    props.address.length
  )}`;

  function navigateStake(token) {
    Store.store.setStore({ currentPool: token });
    props.history.push('/stake/' + props.address);
  }

  const initTotalLockVolume = async () => {
    const eth = store
      .getStore('exchangeAssets')
      .tokens.find((e) => e.label === 'ETH');
    const ethPrice = await store.getETHPrice();
    const token = store
      .getStore('lpTokens')
      .find((x) => x.label === props.rewardsSymbol);

    await store.getLpPrice(token);
    const lpPrice = await store.getLpAmountOut(eth, token, `1`);
    const price = ethPrice / lpPrice;
    if (!price) return;

    const supplyToken = store
      .getStore('rewardPools')
      .map((x) => x.tokens)
      .flat()
      .find(({ tokenAddress }) => tokenAddress === props.token.address);
    const totalSupply = await store.getTotalSupply(supplyToken);
    setTotalLockVolume(totalSupply * price);
  };
  useEffect(() => {
    initTotalLockVolume();
  }, []);

  return (
    <div className='hive-wrapper card'>
      <div className='card-body'>
        <div className='hive-header'>
          <div>
            <div className='farm-logo'>
              <img
                alt=''
                className='farm-image'
                src={require(`../../assets/logos/${props.token.imageLogo}.png`)}
              />
            </div>
            <div className='main-blue'>
              {props.name} {props.symbol}
            </div>
            <a
              href={'https://etherscan.io/address/' + props.address}
              className='address'
              target='_blank'
            >
              {address}
            </a>
          </div>
        </div>

        <div className='hive-details'>
          {/* <div className='d-flex justify-content-between'>
            <div>
              <span className='dot green'></span>
              Beast Bonus (leverage)
            </div>
            <div className='text-right main-blue'>{props.beastBonus * 10}%</div>
          </div> */}
          {/* <div className='d-flex justify-content-between'>
            <div>
              <span className='dot yellow'></span>
              Beast Bonus -100% reduction in
            </div>
            <div className='text-right main-blue'>
              <CountDown pool={props.token} />
            </div>
          </div> */}
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot purple'></span>
              Weekly Rewards
            </div>
            <div className='text-right main-blue'>
              {props.weeklyRewards?.toFixed(2) || 0} {props.rewardsSymbol}
            </div>
          </div>
          {/* {totalLockVolume ? (
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
          )} */}
          <hr />
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot yellow'></span>
              My staked amount
            </div>
            <div className='text-right main-blue'>
              {props.stakedBalance ? props.stakedBalance : '0'} {props.symbol}
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot light-blue'></span>
              My Beast Mode (leverage)
            </div>
            <div className='text-right main-blue'>
              {props.myBeastModes * 10}%
            </div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot orange'></span>
              My Rewards
            </div>
            <div className='text-right main-blue'>
              {props.myRewards.toFixed(4)} {props.rewardsSymbol}
            </div>
          </div>

          <div className='text-center pt-4'>
            <button
              type='button'
              onClick={() => {
                if (props.id != 'balancer-pool') {
                  navigateStake(props.token);
                }
              }}
              className='btn btn-primary bg-main-blue main-btn btn-block'
            >
              Plant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Farm);
