import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hive.scss';
import { BiPlus } from 'react-icons/bi';
import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';

const Hive = (props) => {
  const [gasCost, setGasCost] = useState(0);
  const address = `${props.address.substring(0, 5)}...${props.address.substring(
    props.address.length - 4,
    props.address.length
  )}`;

  function navigateStake(token) {
    Store.store.setStore({ currentPool: token });
    props.history.push('/stake/' + props.address);
  }

  async function fetchData(source) {
    try {
      let {
        data,
      } = await axios.get(
        'https://ethgasstation.info/api/ethgasAPI.json?api-key=3f07e80ab9c6bdd0ca11a37358fc8f1a291551dd701f8eccdaf6eb8e59be',
        { cancelToken: source.token }
      );
      console.log('gastCost', data.fastest);
      setGasCost(data.fastest);
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

  return (
    <div className='hive-wrapper card'>
      <div className='card-body'>
        <div className='hive-header'>
          <div className=''>
            <div className='acronym-title main-blue'>{props.acronym}</div>
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
            <div className='text-right main-blue'>{props.bonusReductionIn}</div>
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
                if (props.id !== 'balancer-pool') {
                  navigateStake(props.token);
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
