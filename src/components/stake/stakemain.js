import React from 'react';

import Store from '../../stores/store';
import Web3 from 'web3';
import { Col, Row, Card } from 'react-bootstrap';

import { ERROR } from '../../constants';
import currency from '../utils/currency';
import { withRouter } from 'react-router-dom';
import CountDown from '../utils/countDown';

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
            {props.isHive && (
              <>
                <div className='d-flex justify-content-between'>
                  <span>Beast Bonus (leverage):</span>
                  <span>
                    {props.pool.beastBonus ? props.pool.beastBonus * 10 : '0'}%
                  </span>
                </div>
                <hr />
              </>
            )}
            {props.isHive && (
              <>
                <div className='d-flex justify-content-between'>
                  <span>Bonus Reduction in:</span>
                  <CountDown pool={props.pool} />
                </div>
                <hr />
              </>
            )}
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
                {props.isHive && (
                  <span>
                    {!props.pool.disableStake ? (
                      <button
                        type='button'
                        className='btn btn-primary bg-main-white main-btn'
                        onClick={() => {
                          // if (props.pool.token.name == 'WPE-LP')
                          //   return window.open(props.pool.token.liquidityLink);

                          props.history.push(
                            `/pools/${props.pool.token.address}`
                          );
                        }}
                      >
                        Add liquidity and Stake
                      </button>
                    ) : (
                      <button
                        type='button'
                        className='btn btn-secondary bg-main-white disabled'
                      >
                        Add liquidity and Stake
                      </button>
                    )}
                  </span>
                )}
              </Col>
            </Row>
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
                  {props.pool.stakedBalance}{' '}
                  {props.pool.stakedSymbol || props.pool.symbol}
                </Col>
              </Row>
              {props.isHive && (
                <Row>
                  <Col className='pool-titles col-8'>
                    <span className='dot purple'></span>
                    MY BEAST MODE (leverage)
                  </Col>
                  <Col className='text-right pool-info'>
                    {props.pool.myBeastModes * 10}%
                  </Col>
                </Row>
              )}
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
                {props.isHive && (
                  <Col className='text-center'>
                    <div
                      className='btn btn-primary bg-main-blue main-btn unstake'

                      //onClick={props.onExit}
                    >
                      Claim & Unstake
                    </div>
                  </Col>
                )}
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
            {props.isHive && props.renderAssetInput(props.pool, 'unstake')}
            <br />

            <span className='pool-titles'>
              Add leverage to your staked capital
            </span>
            <div className='pt-4'>
              <button
                type='button'
                className='btn btn-primary bg-main-blue main-btn'
                disabled={props.pool.disableStake}
                onClick={() => props.navigateInternal('buyboost')}
              >
                Beast Mode
              </button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default withRouter(StakeMain);
