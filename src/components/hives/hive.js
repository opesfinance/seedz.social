import React from 'react';
import './hive.scss';
import { BiPlus } from 'react-icons/bi';
import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';

const bgSrc = require('../../assets/vault.png');

const Hive = (props) => {
  function address(address) {
    return `${props.address.substring(0, 5)}...${props.address.substring(
      props.address.length - 4,
      props.address.length
    )}`;
  }

  function navigateStake(rewardPool) {
    Store.store.setStore({ currentPool: rewardPool });
    props.history.push('/stake');
  }

  return (
    <div className='hive-wrapper card '>
      <div className='card-body'>
        <div className='hive-header'>
          <div className=''>
            <div className='acronym-title main-blue'>{props.acronym}</div>
            <div className='main-blue'>{props.name}</div>
            <a
              href={'https://etherscan.io/' + address(props.address)}
              className='address'
            >
              {address(props.address)}
            </a>
            {/*<div className='inPool main-blue'>
              {props.acronym} in pool: {props.inPool}
  </div>*/}
          </div>
        </div>
        <div className='hive-details'>
          <div className='hive-value'>
            <div>
              <span className='dot green'></span>
              Beast Bonus
            </div>
            <div className='text-right main-blue'>{props.beastBonus}</div>
          </div>
          <div className='hive-value'>
            <div>
              <span className='dot yellow'></span>
              Beast reduction in
            </div>
            <div className='text-right main-blue'>
              {props.bonusReductionIn}{' '}
              {props.bonusReductionIn > 1 ? 'days' : 'day'}
            </div>
          </div>
          <div className='hive-value'>
            <div>
              <span className='dot purple'></span>
              Weekly Rewards
            </div>
            <div className='text-right main-blue'>
              {props.weeklyRewards} {props.rewardsSymbol}
            </div>
          </div>
          <hr />
          <div className='hive-value'>
            <div>
              <span className='dot light-blue'></span>
              My Beast Modes
            </div>
            <div className='text-right main-blue'>{props.myBeastModes}</div>
          </div>
          <div className='hive-value'>
            <div>
              <span className='dot orange'></span>
              My Rewards
            </div>
            <div className='text-right main-blue'>
              {props.myRewards} {props.rewardsSymbol}
            </div>
          </div>
          <div className='text-center pt-4'>
            <div
              onClick={() => {
                if (props.id != 'balancer-pool') {
                  navigateStake(props);
                }
              }}
              className='btn btn-primary bg-main-blue'
            >
              <BiPlus /> Stake
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Hive);
