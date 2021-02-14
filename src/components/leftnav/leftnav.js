import React from 'react';
import { Link } from 'react-router-dom';
import { FaThLarge } from 'react-icons/fa';

// import Store from '../../stores/store';
// const { store } = Store;

const LeftNav = (props) => {
  // const themeType = store.getStore('themeType');
  // const activeclass = store.getStore('activeclass');

  return (
    <div className='sidebar'>
      <div className='leftNav sidbar-sticky'>
        <ul>
          <Link to='/#'>
            <li className='item-menu'>
              <FaThLarge />
              <span className='menu'>Dashboard</span>
            </li>
          </Link>
          <Link to='/hives'>
            <li className='item-menu'>
              <img alt='' src={require('../../assets/house.png')} width='20' />
              <span className='menu'>Hives</span>
            </li>
          </Link>
          <Link to='/farms'>
            <li className='item-menu'>
              <img alt='' src={require('../../assets/honey.png')} width='20' />
              <span className='menu'>Farms</span>
            </li>
          </Link>
          <Link to='/whaletank'>
            <li className='item-menu'>
              <img
                alt=''
                src={require('../../assets/whale-tail.png')}
                width='20'
              />
              <span className='menu'>Whale Tank</span>
            </li>
          </Link>
          <Link to='/exchange'>
            <li className='item-menu'>
              <img
                alt=''
                src={require('../../assets/exchange.png')}
                width='20'
              />
              <span className='menu'>Exchange</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default LeftNav;
