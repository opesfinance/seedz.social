import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaThLarge } from 'react-icons/fa';
import { WiMoonAltThirdQuarter } from 'react-icons/wi';
import { IconContext } from 'react-icons';

const LeftNav = (props) => {
  return (
    <div className='sidebar'>
      <div className='leftNav sidbar-sticky'>
        <ul>
          <NavLink exact to='/'>
            <li className='item-menu'>
              <FaThLarge />
              <span className='menu'>Dashboard</span>
            </li>
          </NavLink>
          <NavLink to='/exchange'>
            <li className='item-menu'>
              <img
                alt=''
                src={require('../../assets/exchange.png')}
                width='20'
              />
              <span className='menu'>Exchange</span>
            </li>
          </NavLink>
          <NavLink to='/hives'>
            <li className='item-menu'>
              <img alt='' src={require('../../assets/house.png')} width='20' />
              <span className='menu'>Hives</span>
            </li>
          </NavLink>
          <NavLink to='/farms'>
            <li className='item-menu'>
              <img alt='' src={require('../../assets/honey.png')} width='20' />
              <span className='menu'>Farms</span>
            </li>
          </NavLink>
          <NavLink to='/swarm'>
            <li className='item-menu'>
              <img alt='' src={require('../../assets/swarm.png')} width='20' />
              <span className='menu'>Swarm</span>
            </li>
          </NavLink>
          <NavLink to='/whaletank'>
            <li className='item-menu'>
              <img
                alt=''
                src={require('../../assets/whale-tail.png')}
                width='20'
              />
              <span className='menu'>Whale Tank</span>
            </li>
          </NavLink>

          <li
            className='item-menu'
            style={{ paddingLeft: '10px' }}
            onClick={props.onSwitchTheme}
          >
            <IconContext.Provider value={{ size: '2em' }}>
              <WiMoonAltThirdQuarter />
            </IconContext.Provider>
            {/* <img
              alt=''
              src={require('../../assets/whale-tail.png')}
              width='20'
            /> */}
            <span className='menu' style={{ paddingLeft: '10px' }}>
              Switch to
              {props.activeStyle == 'light-mode' ? ' dark-mode' : ' light-mode'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftNav;
