import React, { useState } from 'react';
import { IoSwapVerticalOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import {
  InputGroup,
  Dropdown,
  FormControl,
  DropdownButton,
  Form,
} from 'react-bootstrap';
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

const inputOptions = (options) => {
  return options.map((o, i) => {
    return (
      <option key={o.address} value={o.address}>
        {o.label}
      </option>
    );
  });
};

const Exchange = (props) => {
  const [fromVal, setFromVal] = useState(0);
  const [fromOption, setFromOption] = useState('ETHEREUM');
  const [toVal, setToVal] = useState(0);
  const [toOption, setToOption] = useState('');
  const [error, setError] = useState('');
  const [inputOptionsFrom, setInputOptionsFrom] = useState(optionsOne);
  const [inputOptionsTo, setInputOptionsTo] = useState(optionsTwo);

  const onChangeFrom = (value) => {
    setError('');
    setFromVal(value);
  };

  const onChangeTo = (value) => {
    setError('');
    setToVal(value);
  };

  const onChangeFromSelect = (value) => {
    setError('');
    console.log(value);
    setFromOption(value);
  };

  const onChangeToSelect = (value) => {
    setError('');
    setToOption(value);
    console.log(value);
  };

  const onExchange = () => {
    if (fromVal && fromOption && toVal && toOption) {
      console.log('fromVal', fromVal);
      console.log('fromOption', fromOption);
      console.log('toVal', toVal);
      console.log('toOption', toOption);
    } else {
      setError('Select both tokens and a value for each');
    }
  };

  const swapClickHandler = () => {
    const tempFromVal = fromVal;
    const tempFromOption = fromOption;
    const tempFromOptions = JSON.parse(JSON.stringify(inputOptionsFrom));

    setFromVal(toVal);
    setFromOption(toOption);
    setInputOptionsFrom(inputOptionsTo);

    setToVal(tempFromVal);
    setToOption(tempFromOption);
    setInputOptionsTo(tempFromOptions);
  };

  return (
    <div>
      <div className='pageHeader my-auto'>Exchange</div>

      <div className='p-5 ml-5'>
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <div className='card'>
              <div className='card-body'>
                <h4>Exchange</h4>

                <InputGroup className='mb-3'>
                  <Form.Control
                    as='select'
                    onChange={(e) => onChangeFromSelect(e.target.value)}
                    value={fromOption}
                    custom
                  >
                    {inputOptions(inputOptionsFrom)}
                  </Form.Control>

                  <Form.Control
                    style={{ width: '55%' }}
                    value={fromVal}
                    onChange={(e) => onChangeFrom(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>
                {/* {<div className='mb-3'>{fromOption}</div>} */}

                <IconContext.Provider value={{ size: '2em' }}>
                  <IoSwapVerticalOutline onClick={swapClickHandler} />
                </IconContext.Provider>

                <InputGroup className='mt-3'>
                  <Form.Control
                    as='select'
                    onChange={(e) => onChangeToSelect(e.target.value)}
                    value={toOption}
                    custom
                  >
                    {inputOptions(inputOptionsTo)}
                  </Form.Control>
                  <Form.Control
                    style={{ width: '55%' }}
                    value={toVal}
                    onChange={(e) => onChangeTo(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>
                {/* {<div className='mb-3'>{toOption}</div>} */}
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
