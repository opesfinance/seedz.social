// mio
import React, { useState, useEffect } from 'react';
import { IoSwapVerticalOutline } from 'react-icons/io5';
import { withRouter } from 'react-router-dom';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { InputGroup, Dropdown, Form } from 'react-bootstrap';
import './pools.scss';
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
          <span>{label}</span>
        </div>
      </Dropdown.Item>
    );
  });
};

const Pools = (props) => {
  console.log(props);

  const [fromOptions, setFromOptions] = useState(
    store
      .getStore(props.assetsStoreKey)
      .tokens.filter((a) => a.group == 'inputs')
  );
  const [toOptions, setToOptions] = useState(
    store
      .getStore(props.assetsStoreKey)
      .tokens.filter((a) => a.group == 'outputs')
  );
  const [fromAmount, setFromAmount] = useState('0');
  const [fromAddress, setFromAddress] = useState(fromOptions[0].address);
  const [toAmount, setToAmount] = useState('0');
  let initialToAddress =
    props.match.params.selectedPool || toOptions[0].address;
  const [toAddress, setToAddress] = useState(initialToAddress);
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

  // base asset could be passed from props in case this is re used.
  const baseAssetLabel = 'USDC';
  const baseAsset = store
    .getStore(props.assetsStoreKey)
    .tokens.find((i) => i.label == baseAssetLabel); //USDC

  const pricePromises = async () => {
    const assetsOut = store
      .getStore(props.assetsStoreKey)
      .tokens.filter((a) => a.group == 'outputs');

    let promises = assetsOut.map((assetOut) =>
      store.getPrice(baseAsset, assetOut)
    );
    let results = await Promise.all(promises);

    let newBoxes = boxes.map((b, i) => {
      return {
        ...b,
        value: `\$ ${parseFloat(results[i]).toFixed(4)}`,
        intVal: results[i],
      };
    });

    if (props.extraAssets && props.extraAssets.length) {
      for (const assetLabel of props.extraAssets) {
        let current = store
          .getStore(props.assetsStoreKey)
          .tokens.find((i) => i.label == assetLabel);

        let boxToModify = newBoxes.find((b) => b.label == assetLabel);
        if (boxToModify) {
          boxToModify.value = `\$ ${parseFloat(current.price).toFixed(4)}`;
          boxToModify.intVal = current.price;
        }
      }
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

  const onSelectAssetIn = (eventKey) => {
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
  };

  const onSelectAssetOut = (eventKey) => {
    console.log('toOptions', toOptions);
    console.log('eventKey', eventKey);

    const { label, address, logo } = toOptions.find(
      ({ address, liquidityPoolAddress }) =>
        eventKey === address || eventKey === liquidityPoolAddress
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

  const onExchange = () => {
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
      console.log('exchanging ------------');

      const amount = assetIn.amount;
      if (amount > 0) {
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
          <div
            className={
              b.intVal && +b.intVal > 0
                ? 'col-lg-2 col-md-4 col-sm-4'
                : 'hidden'
            }
            key={b.label}
          >
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
      <div className='pageHeader my-auto'>Buy Pool Tokens</div>

      <div className='p-5 ml-5'>
        {boxesLayout}
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <div className='exchange-wrapper mt-5 card'>
              <div className='card-body'>
                <h4>Buy Pool Tokens</h4>
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
                    value={fromAmount}
                    onChange={(e) => onChangeFrom(e.target.value)}
                    aria-describedby='basic-addon1'
                  />
                </InputGroup>

                {props.disableSwap ? (
                  <IconContext.Provider value={{ size: '2em' }}>
                    <AiOutlineArrowDown />
                  </IconContext.Provider>
                ) : (
                  <IconContext.Provider value={{ size: '2em' }}>
                    <IoSwapVerticalOutline onClick={swapClickHandler} />
                  </IconContext.Provider>
                )}

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

export default withRouter(Pools);
