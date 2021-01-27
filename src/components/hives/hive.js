import React from 'react';
import './hive.scss';
import { BiPlus } from 'react-icons/bi';

const bgSrc = require('../../assets/vault.png');

const Hive = (props) => {
  // console.log(props);
  function address(address) {
    return `${props.address.substring(0, 5)}...${props.address.substring(
      props.address.length - 4,
      props.address.length
    )}`;
  }

  return (
    <div className='hive-wrapper card'>
      <div className='card-body'>
        <div className='hive-header'>
          <div className=''>
            <div className='acronym-title main-blue'>{props.acronym}</div>
            <div className='main-blue'>Balancer Pool {props.acronym}</div>
            <div className='address'>{address(props.address)}</div>
            <div className='inPool main-blue'>
              {props.acronym} in pool: {props.inPool}
            </div>
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
              {props.bonusReductionIn} days
            </div>
          </div>
          <div className='hive-value'>
            <div>
              <span className='dot purple'></span>
              Weekly Rewards
            </div>
            <div className='text-right main-blue'>
              {props.weeklyRewards} Seedz
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
            <div className='text-right main-blue'>{props.myRewards} Seedz</div>
          </div>
          <div className='text-center pt-4'>
            <a href='#' className='btn btn-primary bg-main-blue'>
              <BiPlus /> Stake
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hive;
