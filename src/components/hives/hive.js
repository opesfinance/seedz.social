import React from 'react';
import './hive.scss';
import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';

const Hive = (props) => {
  const address = `${props.address.substring(0, 5)}...${props.address.substring(
    props.address.length - 4,
    props.address.length
  )}`;

  function navigateStake(token) {
    Store.store.setStore({ currentPool: token });
    props.history.push('/stake/' + props.address);
  }

  console.log(props);

  return (
    <div className='hive-wrapper card'>
      <div className='card-body'>
        <div className='hive-header'>
          <div className=''>
            <div className='hive-logo'>
              <img
                alt=''
                className='hive-image'
                src={require(`../../assets/logos/${props.symbol}.png`)}
              />
            </div>
            <div className='main-blue'>{props.name}</div>
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
              Beast Bonus -10% reduction in
            </div>
            <div className='text-right main-blue'>{props.bonusReductionIn}</div>
          </div>
          <div className='d-flex justify-content-between'>
            <div>
              <span className='dot purple'></span>
              Weekly Rewards
            </div>
            <div className='text-right main-blue'>
              {props.weeklyRewards} {props.rewardsSymbol}
            </div>
          </div>
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
