import React, { useState, useEffect } from 'react';
import { IoSwapVerticalOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';
import { InputGroup, Dropdown, Form } from 'react-bootstrap';
import TradingViewWidget from 'react-tradingview-widget';
import Web3 from 'web3';

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
    { label: 'M2', value: '$ 0.00', color: 'green' },
    { label: 'ETH', value: '$ 0.00', color: 'orange' },
    { label: 'WPE', value: '$ 0.00', color: 'purple' },
  ]);

  const [fromToggleContents, setFromToggleContents] = useState('Choose');
  const [toToggleContents, setToToggleContents] = useState('Choose');

  const [doingTransaction, setDoingTransaction] = useState(false);
  const [selectedAssetBalance, setSelectedAssetBalance] = useState(0);

  const [tvk, setTvk] = useState(); // trading view key (for charts)
  const style = localStorage.getItem('theme');
  const [tvkTheme, setTvkTheme] = useState(
    style && style == 'dark-mode' ? 'Dark' : 'Light'
  ); // trading view key (for charts)

  const [addingTokenToMetamask, setAddingTokenToMetamask] = useState(false);

  const assetIn = store
    .getStore('exchangeAssets')
    .tokens.find((i) => i.label == 'USDC'); //USDC

  const assetsOut = store
    .getStore('exchangeAssets')
    .tokens.filter((a) => a.box == 'true');

  const pricePromises = async () => {
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
    emitter.on(EXCHANGE_RETURNED, handleExchangeReturned);

    return () => {
      emitter.removeListener(ERROR, handleResponse);
      emitter.removeListener(EXCHANGE_RETURNED, handleExchangeReturned);
    };
  }, []);

  const handleResponse = (err) => {
    console.log('err ----------', err);
    setDoingTransaction(false);
    setError('');
  };

  const handleExchangeReturned = (res) => {
    console.log('res ----------', res);
    setDoingTransaction(false);
    setToAmount(0);
    setFromAmount(0);
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

  const onChangeAssetForChart = (tradingViewKey) => {
    console.log(tradingViewKey);
    if (tradingViewKey) setTvk(tradingViewKey);
  };

  const onSelectAssetIn = async (eventKey) => {
    const token = fromOptions.find(({ address }) => eventKey === address);
    const { label, address, logo } = token;

    setSelectedAssetBalance(await store.getAssetBalance(token));

    onChangeAssetForChart(token.tradingViewKey);
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
    const token = toOptions.find(({ address }) => eventKey === address);
    const { label, address, logo } = token;
    onChangeAssetForChart(token.tradingViewKey);
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

  const swapClickHandler = async () => {
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

    const token = toOptions.find(({ address }) => toAddress === address);
    setSelectedAssetBalance(await store.getAssetBalance(token));
  };

  const maxFromAmount = async () => {
    const token = fromOptions.find(({ address }) => fromAddress === address);
    setFromAmount(await store.getAssetBalance(token));
  };

  const addTokens = async (token) => {
    // setAddingTokenToMetamask(true)
    console.log(token);
    let provider = new Web3(store.getStore('web3context').library.provider);
    provider = provider.currentProvider;
    provider.sendAsync(
      {
        method: 'metamask_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.label,
            decimals: token.decimals,
            image: '',
          },
        },
        id: Math.round(Math.random() * 100000),
      },
      (err, added) => {
        setAddingTokenToMetamask(false);
        console.log('provider returned', err, added);
        if (err || 'error' in added) {
          return emitter.emit(ERROR, 'There was a problem adding the token.');
        }
      }
    );
  };

  const boxesLayout = (
    <div className=' row'>
      {boxes.map((b) => {
        let token = store
          .getStore('exchangeAssets')
          ?.tokens?.find((token) => token.label === b.label);
        return (
          <div className='col-lg-3 col-md-4 col-sm-4' key={b.label}>
            <div
              className={'row m-1 p-2 rounded box-' + boxColorMapper[b.color]}
            >
              <div className='col-12 m-0 my-auto text-left small font-weight-bold text-white'>
                <h5 className='p-0 m-0 text-bottom'>{b.value}</h5>
                <p className='p-0 m-0 text-bottom small font-weight-bold'>
                  {b.label}
                </p>
                <div className='text-center'>
                  <button
                    type='button'
                    disabled={addingTokenToMetamask}
                    onClick={() => addTokens(token)}
                    className='btn btn-primary bg-main-white main-btn'
                  >
                    {addingTokenToMetamask ? (
                      'complete in metamask'
                    ) : (
                      <>
                        Add Token to{' '}
                        <img
                          alt=''
                          src='data:image/png;base64,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'
                          width='15'
                          height='15'
                          className='d-inline-block align-top'
                        ></img>
                      </>
                    )}
                  </button>
                </div>
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

      <div className='ml-sm-5 p-sm-5 ml-5 p-1 pb-5'>
        {boxesLayout}
        <div className='row mt-5'>
          <div className='col-md-6'>
            <div className='exchange-wrapper card'>
              <div className='card-body'>
                <div className='d-flex justify-content-between align-items-end'>
                  <h4>Exchange</h4>
                  <span
                    className='pull-right btn btn-outline-secondary mb-1'
                    style={{ fontSize: '1rem' }}
                    onClick={maxFromAmount}
                  >
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
                  <IoSwapVerticalOutline
                    onClick={swapClickHandler}
                    size={50}
                    className='btn btn-outline-primary'
                  />
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
                    {doingTransaction ? 'loading ...' : 'Swap'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='col-md-6 mt-5 mt-md-0 tvk-exchange-container'>
            {tvk && (
              <TradingViewWidget
                symbol={tvk}
                theme={tvkTheme}
                locale='en'
                autosize
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
