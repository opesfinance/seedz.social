// mio
import React, { useState, useEffect } from 'react';
import { IoSwapVerticalOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import { InputGroup, Dropdown, Form } from 'react-bootstrap';
import { ERROR, EXCHANGE_RETURNED } from '../../constants/constants';

import './exchange.scss';
import Store from '../../stores/store';
// ERROR,
// EXCHANGE_RETURNED,
// EXIT,
// EXIT_RETURNED,
import { EXCHANGE } from '../../constants';

const { emitter, dispatcher, store } = Store;

const boxColorMapper = {
  pink: 1,
  orange: 2,
  purple: 3,
  green: 4,
};

// seconds to update interval
const BOXES_INTERVAL = 10000;

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
          <span className='dropdown-item'>{label}</span>
        </div>
      </Dropdown.Item>
    );
  });
};

const Exchange = (props) => {
  const [fromOptions, setFromOptions] = useState(
    store.getStore('exchangeAssets').tokens.filter((a) => a.group == 'inputs')
  );
  const [toOptions, setToOptions] = useState(
    store
      .getStore('exchangeAssets')
      .tokens.filter(
        (a) => a.group == 'outputs' && a.availableViews.includes('exchange')
      )
  );
  const [fromAmount, setFromAmount] = useState('0');
  const [fromAddress, setFromAddress] = useState(fromOptions[0].address);
  const [toAmount, setToAmount] = useState('0');
  const [toAddress, setToAddress] = useState(toOptions[0].address);
  const [error, setError] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [boxes, setBoxValues] = useState([
    { label: 'STR', value: '$ 0.00', color: 'pink' },
    { label: 'PIXEL', value: '$ 0.00', color: 'orange' },
    { label: 'LIFT', value: '$ 0.00', color: 'purple' },
    { label: 'YFU', value: '$ 0.00', color: 'green' },
    { label: 'ETH', value: '$ 0.00', color: 'orange' },
    { label: 'WPE', value: '$ 0.00', color: 'purple' },
  ]);

  const [fromToggleContents, setFromToggleContents] = useState('Choose');
  const [toToggleContents, setToToggleContents] = useState('Choose');

  const [doingTransaction, setDoingTransaction] = useState(false);
  const [selectedAssetBalance, setSelectedAssetBalance] = useState(0);

  const pricePromises = async () => {
    const assetsOut = store
      .getStore('exchangeAssets')
      .tokens.filter((a) => a.group == 'outputs');

    const assetIn = store
      .getStore('exchangeAssets')
      .tokens.find((i) => i.label == 'USDC'); //USDC

    let promises = assetsOut.map((assetOut) =>
      store.getPrice(assetIn, assetOut)
    );
    let results = await Promise.all(promises);

    let newBoxes = boxes.map((b, i) => {
      return { ...b, value: `\$ ${parseFloat(results[i]).toFixed(4)}` };
    });

    for (const assetLabel of ['ETH', 'WPE']) {
      let current = store
        .getStore('exchangeAssets')
        .tokens.find((i) => i.label == assetLabel);

      let boxToModify = newBoxes.find((b) => b.label == assetLabel);
      if (boxToModify)
        boxToModify.value = `\$ ${parseFloat(current.price).toFixed(4)}`;
    }

    setBoxValues(newBoxes);
  };

  useEffect(() => {
    console.log('rendering --');
    pricePromises();
    // default option
    onSelectAssetIn(fromAddress);
    onSelectAssetOut(toAddress);

    let interval = setInterval(() => {
      pricePromises();
    }, BOXES_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    calculate();
  }, [fromAmount, toAddress, fromAddress, boxes]);

  useEffect(() => {
    emitter.on(ERROR, handleResponse);
    emitter.on(EXCHANGE_RETURNED, handleResponse);

    return () => {
      emitter.removeListener(ERROR, handleResponse);
      emitter.removeListener(EXCHANGE_RETURNED, handleResponse);
    };
  }, []);

  const handleResponse = (err) => {
    console.log('err ----------', err);
    setDoingTransaction(false);
    setError('');
  };

  const calculate = async () => {
    let assetIn, amountOut, assetOut;
    if (fromAddress)
      assetIn = fromOptions.find((i) => i.address == fromAddress);
    if (toAddress) assetOut = toOptions.find((i) => i.address == toAddress);

    if (fromAmount && +fromAmount > 0 && assetIn && assetOut) {
      amountOut = await store.getAmountOut(assetIn, assetOut, fromAmount);
      setToAmount(amountOut);
      getUnitPrice();
    }
  };

  const getUnitPrice = async () => {
    let assetIn, amountOut, assetOut;

    if (fromAddress)
      assetIn = fromOptions.find((i) => i.address == fromAddress);
    if (toAddress) assetOut = toOptions.find((i) => i.address == toAddress);

    amountOut = await store.getAmountOut(assetIn, assetOut, '1');
    console.log(assetIn);
    setUnitPrice(`1 ${assetIn.label} = ${amountOut} ${assetOut.label}`);
  };

  const onChangeFrom = async (amountIn) => {
    setError('');
    setFromAmount(amountIn);
  };

  const onChangeTo = (value) => {
    setError('');
    setToAmount(value);
  };

  const onChangeFromSelect = (value) => {
    setError('');
    setFromAddress(value);
  };

  const onChangeToSelect = (value) => {
    setError('');
    setToAddress(value);
  };

  const onSelectAssetIn = async (eventKey) => {
    const token = fromOptions.find(({ address }) => eventKey === address);
    const { label, address, logo } = token;

    setSelectedAssetBalance(await store.getAssetBalance(token));

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
  };

  const onSelectAssetOut = (eventKey) => {
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
  };

  const onCreateTransaction = () => {
    if (fromAmount && fromAddress && toAmount && toAddress) {
      if (selectedAssetBalance < fromAmount)
        return setError('Not enough balance in this asset');

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
      console.log('exchanging ------------');

      const amount = assetIn.amount;
      if (amount > 0) {
        setDoingTransaction(true);

        //this.setState({ loading: true });
        dispatcher.dispatch({
          type: EXCHANGE,
          content: {
            assetIn: assetIn.asset,
            assetOut: assetOut.asset,
            amountIn: assetIn.amount,
            amountOut: assetOut.amount,
          },
        });
      } else {
        setError('Select both tokens and a value for each');
      }
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
          <div className='col-lg-2 col-md-4 col-sm-4' key={b.label}>
            <div
              className={'row m-1 p-2 rounded box-' + boxColorMapper[b.color]}
            >
              <div className='col-12 m-0 my-auto text-left small font-weight-bold text-white'>
                <h5 className='p-0 m-0 text-bottom'>{b.value}</h5>
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

  // const unitPrice = () => {
  //   return <h1>{toAmount}</h1>;
  // };

  return (
    <div>
      <div className='pageHeader my-auto'>Exchange</div>

      <div className='p-5 ml-5'>
        {boxesLayout}
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <div className='exchange-wrapper mt-5 card'>
              <div className='card-body'>
                <div className='d-flex justify-content-between align-items-end'>
                  <h4>Exchange</h4>
                  <span className='pull-right small'>
                    Your balance: {selectedAssetBalance}{' '}
                  </span>
                </div>

                <InputGroup className='mb-3'>
                  <Dropdown onSelect={onSelectAssetIn}>
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
                    // type='number'
                    value={fromAmount}
                    onChange={(e) => onChangeFrom(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>
                {/* {<div className='mb-3'>{fromAddress}</div>} */}
                <IconContext.Provider value={{ size: '2em' }}>
                  <IoSwapVerticalOutline onClick={swapClickHandler} />
                </IconContext.Provider>

                {toAmount && +toAmount > 0 && (
                  <span className='unit-price'>{unitPrice}</span>
                )}
                <InputGroup className='mt-3'>
                  <Dropdown onSelect={onSelectAssetOut}>
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
                    disabled
                    onChange={(e) => onChangeTo(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>
                <div className='text-center'>
                  {error && error.length && <div>{error}</div>}
                  <button
                    className='btn btn-primary mt-3 main-btn'
                    disabled={(error && error.length) || doingTransaction}
                    onClick={onCreateTransaction}
                  >
                    Swap
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
