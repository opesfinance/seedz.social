import React, { useState, useEffect } from 'react';
import { IoSwapVerticalOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import { InputGroup, Dropdown, Form } from 'react-bootstrap';
import './exchange.scss';

const optionsOne = [
  {
    label: 'ETH',
    logo: 'logo-eth.png',
    address: 'ETHEREUM',
  },
  {
    label: 'USDC',
    logo: 'USD_Coin_icon.webp',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    label: 'DAI',
    logo: 'dai-multi-collateral-mcd.webp',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    label: 'USDT',
    logo: 'tether_32.webp',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
];

// comunidades
const optionsTwo = [
  {
    label: 'STR',
    logo: 'tether_32.webp',
    address: '0x11C1a6B3Ed6Bb362954b29d3183cfA97A0c806Aa',
  },
  {
    label: 'PIXEL',
    logo: 'tether_32.webp',
    address: '0x89045d0Af6A12782Ec6f701eE6698bEaF17d0eA2',
  },
  {
    label: 'LIFT',
    logo: 'tether_32.webp',
    address: '0x47bd5114c12421FBC8B15711cE834AFDedea05D9',
  },
  {
    label: 'YFU',
    logo: 'tether_32.webp',
    address: '0xa279dab6ec190eE4Efce7Da72896EB58AD533262',
  },
];

const boxColorMapper = {
  pink: 1,
  orange: 2,
  purple: 3,
  green: 4,
};

// seconds to update interval
const BOXES_INTERVAL = 2000;

const inputOptions = (options) => {
  return options.map((o, i) => {
    return (
      <option key={o.address} value={o.address}>
        {o.label}
      </option>
    );
  });
};

const dropdownOptions = (options) => {
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
          <span>{label}</span>
        </div>
      </Dropdown.Item>
    );
  });
};

const Exchange = (props) => {
  const [fromOptions, setFromOptions] = useState(optionsOne);
  const [toOptions, setToOptions] = useState(optionsTwo);
  const [fromAmount, setFromAmount] = useState(0);
  const [fromAddress, setFromAddress] = useState(fromOptions[0].address);
  const [toAmount, setToAmount] = useState(0);
  const [toAddress, setToAddress] = useState(toOptions[0].address);
  const [error, setError] = useState('');
  const [boxes, setBoxValues] = useState([
    { label: 'STR', value: '45 M', color: 'pink' },
    { label: 'PIXEL', value: '45 M', color: 'orange' },
    { label: 'LIFT', value: '45 M', color: 'purple' },
    { label: 'YFU', value: '45 M', color: 'green' },
    { label: 'ETH', value: '45 M', color: 'orange' },
    { label: 'USDC', value: '45 M', color: 'purple' },
  ]);

  const [fromToggleContents, setFromToggleContents] = useState('Choose');
  const [toToggleContents, setToToggleContents] = useState('Choose');

  useEffect(() => {
    let interval = setInterval(() => {
      let valueFromStore = {
        label: 'STR',
        value: `${Math.floor(Math.random() * 45)} M`,
      };
      let boxesCopy = [...boxes];
      let boxToModify = boxesCopy.find((b) => b.label == valueFromStore.label);
      if (boxToModify) boxToModify.value = valueFromStore.value;
      setBoxValues(boxesCopy);
    }, BOXES_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, [boxes]);

  const onChangeFrom = (value) => {
    setError('');
    setFromAmount(value);
  };

  const onChangeTo = (value) => {
    setError('');
    setToAmount(value);
  };

  const onChangeFromSelect = (value) => {
    setError('');
    console.log('from', value);
    setFromAddress(value);
  };

  const onChangeToSelect = (value) => {
    setError('');
    setToAddress(value);
  };

  const onExchange = () => {
    console.log(fromAddress);
    if (fromAmount && fromAddress && toAmount && toAddress) {
      const assetIn = {
        amount: fromAmount,
        asset: fromOptions.find((i) => i.address == fromAddress),
      };
      const assetOut = {
        amount: toAmount,
        asset: toOptions.find((i) => i.address == toAddress),
      };

      console.log('assetIn --', assetIn);
      console.log('assetOut --', assetOut);
    } else {
      setError('Select both tokens and a value for each');
    }
  };

  const swapClickHandler = () => {
    const tempFromVal = fromAmount;
    const tempFromOption = fromAddress;
    const tempFromOptions = JSON.parse(JSON.stringify(fromOptions));
    const tempFromToggle = fromToggleContents;

    setFromAmount(toAmount);
    setFromAddress(toAddress);
    setFromOptions(toOptions);
    setFromToggleContents(toToggleContents);

    setToAmount(tempFromVal);
    setToAddress(tempFromOption);
    setToOptions(tempFromOptions);
    setToToggleContents(tempFromToggle);
  };

  const boxesLayout = (
    <div className=' row'>
      {boxes.map((b) => {
        return (
          <div className='col-lg-2 col-md-12 col-sm-12' key={b.label}>
            <div
              className={'row m-1 p-2 rounded box-' + boxColorMapper[b.color]}
            >
              <div className='col-12 m-0 my-auto text-left small font-weight-bold text-white'>
                <h3 className='p-0 m-0 text-bottom'>{b.value}</h3>
                <p className='p-0 m-0 text-bottom small font-weight-bold'>
                  {b.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className='pageHeader my-auto'>Exchange</div>

      <div className='p-5 ml-5'>
        {boxesLayout}
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <div className='card'>
              <div className='card-body'>
                <h4>Exchange</h4>

                <InputGroup className='mb-3'>
                  <Dropdown
                    onSelect={(eventKey) => {
                      // console.log(eventKey);
                      const { label, address, logo } = fromOptions.find(
                        ({ address }) => eventKey === address
                      );
                      onChangeFromSelect(address);
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
                          {label}
                        </>
                      );
                    }}
                  >
                    <Dropdown.Toggle
                      variant='outline-primary'
                      id='dropdown-flags'
                      className='text-left'
                    >
                      {fromToggleContents}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {dropdownOptions(fromOptions)}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Form.Control
                    style={{ width: '55%' }}
                    value={fromAmount}
                    onChange={(e) => onChangeFrom(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>
                {/* {<div className='mb-3'>{fromAddress}</div>} */}

                <IconContext.Provider value={{ size: '2em' }}>
                  <IoSwapVerticalOutline onClick={swapClickHandler} />
                </IconContext.Provider>

                <InputGroup className='mt-3'>
                  <Dropdown
                    onSelect={(eventKey) => {
                      // console.log(eventKey);
                      const { label, address, logo } = toOptions.find(
                        ({ address }) => eventKey === address
                      );
                      onChangeToSelect(address);
                      setToToggleContents(
                        <>
                          <img
                            style={{
                              maxHeight: '22px',
                              marginRight: '5px',
                            }}
                            src={require(`../../assets/logos/${logo}`)}
                            alt=''
                          />
                          {label}
                        </>
                      );
                    }}
                  >
                    <Dropdown.Toggle
                      variant='outline-primary'
                      id='dropdown-flags'
                      className='text-left'
                    >
                      {toToggleContents}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>{dropdownOptions(toOptions)}</Dropdown.Menu>
                  </Dropdown>
                  <Form.Control
                    style={{ width: '55%' }}
                    value={toAmount}
                    onChange={(e) => onChangeTo(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>
                {/* {<div className='mb-3'>{toAddress}</div>} */}
                <div className='text-center'>
                  {error && error.length && <div>{error}</div>}
                  <button
                    className='btn btn-primary mt-3'
                    disabled={error && error.length}
                    onClick={onExchange}
                  >
                    Complete transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
