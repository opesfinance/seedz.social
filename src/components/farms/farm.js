import React from 'react';
import './farm.scss';
import { BiPlus } from 'react-icons/bi';
import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';
import { Col, Card, Row } from 'react-bootstrap';

const Farm = (props) => {
  const { pool } = props;
  console.log(pool);
  const address = `${pool.token.rewardsAddress.substring(
    0,
    5
  )}...${pool.token.rewardsAddress.substring(
    pool.token.rewardsAddress.length - 4,
    pool.token.rewardsAddress.length
  )}`;

  function navigateStake(farmPool) {
    Store.store.setStore({ currentPool: farmPool });
    props.history.push(
      '/stake/' +
        (pool.poolAddress || '0xc96d43006fE0058c5dd9d35D2763Aba9A0C300b1')
    );
  }

  return (
    <div className='hive-wrapper card'>
      <div className='card-body'>
        <div className='hive-header'>
          <div>
            <div className='farm-logo'>
              <img
                alt=''
                className='farm-image'
                src={require(`../../assets/logos/${pool.symbol}.png`)}
              />
            </div>
            <div className='main-blue'>
              {pool.name} ({pool.symbol})
            </div>
            <a
              href={'https://etherscan.io/address/' + pool.poolAddress}
              className='address'
              target='_blank'
            >
              {address}
            </a>
          </div>
        </div>

        <div className='d-flex justify-content-between'>
          <div>
            <span className='dot green'></span>
            APY
          </div>
          <div className='text-right main-blue'>{pool.apy}%</div>
        </div>

        <div className='d-flex justify-content-between'>
          <div>
            <span className='dot yellow'></span>
            Time Left
          </div>
          <div className='text-right main-blue'>{pool.timeLeft}</div>
        </div>

        <div className='d-flex justify-content-between'>
          <div>
            <span className='dot purple'></span>
            Weekly Rewards
          </div>
          <div className='text-right main-blue'>
            {pool.weeklyRewards} {pool.symbol}
          </div>
        </div>

        <hr />

        <div className='d-flex justify-content-between'>
          <div>
            <span className='dot light-blue'></span>
            My Beast Modes
          </div>
          <div className='text-right main-blue'>{pool.myBeastModes * 10}</div>
        </div>

        <div className='d-flex justify-content-between'>
          <div>
            <span className='dot orange'></span>
            My Rewards
          </div>
          <div className='text-right main-blue'>
            {pool.myRewards} {pool.symbol}
          </div>
        </div>

        <div className='text-center pt-4'>
          <button
            type='button'
            onClick={() => {
              if (pool.id != 'balancer-pool') {
                navigateStake(pool);
              }
            }}
            className='btn btn-primary bg-main-blue main-btn btn-block'
          >
            Plant
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Farm);
