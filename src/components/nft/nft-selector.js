import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import Store from '../../stores/store';

// import {
//   // CONFIGURE_RETURNED,
//   GET_BALANCES,
//   GET_BALANCES_RETURNED,
//   GET_BOOSTEDBALANCES_RETURNED,
//   GET_BOOSTEDBALANCES,
//   GET_REWARDS_RETURNED,
//   STAKE_RETURNED,
// } from '../../constants/constants';

const { emitter, dispatcher, store } = Store;

const NftSelector = (props) => {
  const [fromToggleContents, setFromToggleContents] = useState();

  // here's where props should send token from hive and make a call
  // or something to get superhive nft's.
  // or maybe in a use effect
  const [fromOptions, setFromOptions] = useState(
    props.ddOptions
    // store.getStore('exchangeAssets').tokens.filter((a) => a.group == 'inputs')
  );
  const [fromAddress, setFromAddress] = useState(fromOptions[0].address);

  useEffect(() => {
    onSelectAssetIn(fromAddress);
  }, []);

  const onSelectAssetIn = async (eventKey) => {
    const token = fromOptions.find(({ address }) => eventKey === address);
    const { label, address, logo } = token;

    // onChangeFromSelect(address);
    setFromAddress(address);

    setFromToggleContents(
      <>
        <img
          style={{
            maxHeight: '22px',
            marginRight: '5px',
          }}
          src={require(`../../assets/logos/${logo}`)}
          alt=''
        />
        {/* {label} */}
      </>
    );
  };

  const ddOptionsLayout = (options) => {
    return options.map(({ address, label, logo }) => {
      return (
        <Dropdown.Item key={address} eventKey={address}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <img
              style={{
                maxHeight: '22px',
              }}
              src={require(`../../assets/logos/${logo}`)}
              alt=''
            />
            <span className='dropdown-item'>{label}</span>
          </div>
        </Dropdown.Item>
      );
    });
  };

  return (
    <div className=''>
      <Dropdown onSelect={onSelectAssetIn}>
        <Dropdown.Toggle variant='outline-primary' className='text-left'>
          {fromToggleContents}
        </Dropdown.Toggle>

        <Dropdown.Menu>{ddOptionsLayout(fromOptions)}</Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default NftSelector;
