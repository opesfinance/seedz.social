import React from 'react';
// import { Link } from 'react-router-dom';

import Store from '../../stores/store';
import Web3 from 'web3';
import { Col, Row, Card } from 'react-bootstrap';

import { ERROR } from '../../constants';
import currency from '../utils/currency';
import { withRouter } from 'react-router-dom';

const { emitter, store } = Store;

const onAddSeeds = async (pool) => {
  let provider = new Web3(store.getStore('web3context').library.provider);
  provider = provider.currentProvider;
  provider.sendAsync(
    {
      method: 'metamask_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: pool.tokenAddress,
          symbol: pool.tokenSymbol,
          decimals: 18,
          image: '',
        },
      },
      id: Math.round(Math.random() * 100000),
    },
    (err, added) => {
      console.log('provider returned', err, added);
      if (err || 'error' in added) {
        return emitter.emit(ERROR, 'There was a problem adding the token.');
      }
    }
  );
};

const onAddPool = async (pool) => {
  let provider = new Web3(store.getStore('web3context').library.provider);
  provider = provider.currentProvider;
  provider.sendAsync({
    method: 'metamask_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: pool.address,
        symbol: pool.symbol,
        decimals: 18,
        image: '',
      },
    },
  });
};

const StakeMain = (props) => {
  return (
    <Row className='pool-boxes'>
      <Col lg='4' md='12' xs='12' className='p-1'>
        <Card className='pool-card base-card'>
          <Card.Body className='text-left'>
            <div className='d-flex justify-content-between'>
              <span>Beast Bonus (leverage):</span>
              <span>
                {props.pool.beastBonus ? props.pool.beastBonus * 10 : '0'}%
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Bonus Reduction in:</span>
              <span>{props.pool.bonusReductionIn} </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Weekly Rewards:</span>
              <span>
                {props.pool.weeklyRewards} {props.pool.rewardsSymbol}
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Current Gas Price:</span>
              <span>{props.gasPrice / 10} gwei</span>
            </div>
            <hr />
            <Row className='pt-4'>
              {!props.pool.disableStake && (
                <Col className='text-center'>
                  <a
                    href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b'
                    className='btn btn-primary bg-main-white main-btn'
                    target='_blank'
                  >
                    Buy WPE
                  </a>
                </Col>
              )}
              <Col className='text-center'>
                {!props.pool.disableStake ? (
                  <button
                    className='btn btn-primary bg-main-white main-btn'
                    onClick={() => {
                      if (props.pool.token.name == 'WPE-LP')
                        return window.open(props.pool.token.liquidityLink);

                      props.history.push(`/pools/${props.pool.token.address}`);
                    }}
                  >
                    Add liquidity
                  </button>
                ) : (
                  <button className='btn btn-secondary bg-main-white disabled'>
                    Add liquidity
                  </button>
                )}
              </Col>
            </Row>
            {/* <Row className='pt-4'>
              <Col className='text-center'>
                <button
                  type='button'
                  onClick={() => onAddSeeds(props.pool)}
                  className='btn btn-primary bg-main-white main-btn'
                >
                  Add Seedz to{' '}
                  <img
                    alt=''
                    src='data:image/png;base64,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'
                    width='15'
                    height='15'
                    className='d-inline-block align-top'
                  ></img>
                </button>
              </Col>
              <Col className='text-center'>
                <button
                  type='button'
                  onClick={() => onAddPool(props.pool)}
                  className='btn btn-primary bg-main-white main-btn'
                >
                  Add {props.pool.symbol} to{' '}
                  <img
                    alt=''
                    src='data:image/png;base64,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'
                    width='15'
                    height='15'
                    className='d-inline-block align-top'
                  ></img>
                </button>
              </Col>
            </Row> */}
          </Card.Body>
        </Card>
      </Col>
      <Col lg='4' md='12' xs='12' className='p-1'>
        <Card className='pool-card base-card'>
          <Card.Body className='text-left'>
            <div className='hive-details'>
              <Row>
                <Col className='pool-titles col-8'>
                  <span className='dot green'></span>YOUR BALANCE
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.boostBalance
                    ? props.pool.boostBalance.toFixed(props.pool.displayDecimal)
                    : '0'}{' '}
                  ETH{' '}
                </Col>
              </Row>
              <Row>
                <Col className='pool-titles col-8'>
                  <span className='dot yellow'></span>
                  MY STAKED AMOUNT
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.stakedBalance} {props.pool.symbol}
                </Col>
              </Row>
              <Row>
                <Col className='pool-titles col-8'>
                  <span className='dot purple'></span>
                  MY BEAST MODE (leverage)
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.myBeastModes * 10}%
                </Col>
              </Row>
              <Row>
                <Col className='pool-titles col-8'>
                  <span className='dot light-blue'></span>
                  REWARDS AVAILABLE
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.rewardsSymbol === '$'
                    ? props.pool.rewardsSymbol
                    : ''}{' '}
                  {props.pool.myRewards}{' '}
                  {props.pool.rewardsSymbol !== '$'
                    ? props.pool.rewardsSymbol
                    : ''}
                </Col>
              </Row>

              <Row className='pt-4'>
                <Col className='text-center'>
                  <div
                    className='btn btn-primary bg-main-blue main-btn'
                    onClick={props.onClaim}
                  >
                    Claim Rewards
                  </div>
                </Col>
                <Col className='text-center'>
                  <div
                    className='btn btn-primary bg-main-blue main-btn unstake'

                    //onClick={props.onExit}
                  >
                    Claim & Unstake
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg='4' md='12' xs='12' className='p-1'>
        <Card className='pool-card base-card'>
          <Card.Body>
            {props.renderAssetInput(props.pool, 'stake')}
            <br />
            {props.renderAssetInput(props.pool, 'unstake')}
            <br />
            <span className='pool-titles'>
              Add leverage to your staked capital
            </span>
            <Row className='pt-4'>
              <Col className='text-center'>
                <button
                  type='button'
                  className='btn btn-primary bg-main-blue main-btn'
                  disabled={props.pool.disableStake}
                  onClick={() => props.navigateInternal('buyboost')}
                >
                  Beast Mode
                </button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default withRouter(StakeMain);
