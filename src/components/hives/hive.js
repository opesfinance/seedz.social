import React from 'react';
import './hive.scss';

const bgSrc = require('../../assets/vault.png');

const Hive = (props) => {
  // console.log(props);

  return (
    <div className=''>
      <div className='hive-wrapper'>
        <div className='hive-header'>
          <div className=''>
            <div className='acronym-title'>{props.acronym}</div>
            <div className='address'>{`${props.address.substring(
              0,
              7
            )}...${props.address.substring(
              props.address.length - 4,
              props.address.length
            )}`}</div>
            <div className='inPool'>
              {props.acronym} in pool: {props.inPool}
            </div>
          </div>
        </div>
        <div className='hive-details'>
          <div className='hive-value'>
            <div>Beast Bonus</div> <div>{props.beastBonus}</div>
          </div>
          <div className='hive-value'>
            <div>Beast reduction in</div>
            <div>{props.bonusReductionIn} days</div>
          </div>
          <div className='hive-value'>
            <div>Weekly Rewards</div> <div>{props.weeklyRewards} Seedz</div>
          </div>
          <hr />
          <div className='hive-value'>
            <div>My Beast Modes</div> <div>{props.myBeastModes}</div>
          </div>
          <div className='hive-value'>
            <div>My Rewards</div> <div>{props.myRewards} Seedz</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hive;
