import React, { useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';

const StakeBuyBoost = (props) => {
  const [beastModesAmount, setBeastModesAmount] = useState(0);

  const onChangeBeastModes = (e) => {
    const { value } = e.target;

    setBeastModesAmount(value);
    props.getBoosterPriceBulk(value);
  };

  return (
    <Row className='pool-boxes pool-titles'>
      <Col>
        <Card className='pool-card base-card'>
          <Card.Body className='text-left'>
            <div className='hive-details'>
              <Row>
                <Col>
                  <span className='dot green'></span>
                  YOUR BALANCE
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.boostBalance
                    ? props.pool.boostBalance.toFixed(props.pool.displayDecimal)
                    : '0'}{' '}
                  ETH{' '}
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className='dot yellow'></span>
                  MY STAKED AMOUNT
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.stakedBalance ? props.pool.stakedBalance : '0'}{' '}
                  {props.pool.symbol}
                </Col>
              </Row>
              <Row>
                <Col>
                  <span className='dot purple'></span>
                  MY BEAST MODE (leverage)
                </Col>
                <Col className='text-right pool-info'>
                  {props.pool.myBeastModes * 10}%
                </Col>
              </Row>
              <Row>
                <Col>
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
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card className='base-card'>
          <Card.Body>
            <div className='d-flex justify-content-between'>
              <span>Ethereum Price (USD)</span>
              <span className='text-right pool-info'>
                $ {props.pool.ethPrice}
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Token Balance</span>
              <span className='text-right pool-info'>
                {' '}
                {props.pool.boostBalance} ETH
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Cost of Beast Mode (USD)</span>
              <span className='text-right pool-info'>
                $
                {props.costBoosterETH != null
                  ? props.costBoosterETH * props.pool.ethPrice
                  : props.pool.costBoosterUSD
                  ? props.pool.costBoosterUSD.toFixed(2)
                  : '0.00'}
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Cost of Beast Mode</span>
              <span className='text-right pool-info'>
                {props.costBoosterETH != null
                  ? props.costBoosterETH
                  : props.pool.costBooster}{' '}
                ETH
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Time to next BEAST powerup</span>
              <span className='text-right pool-info'>
                {props.pool.timeToNextBoost - new Date().getTime() / 1000 > 0
                  ? (
                      (props.pool.timeToNextBoost -
                        new Date().getTime() / 1000) /
                      60
                    ).toFixed(0)
                  : '0'}{' '}
                Minutes
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Beast Mode active</span>
              <span className='text-right pool-info'>
                {props.pool.myBeastModes * 10}%
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Your current staked value</span>
              <span className='text-right pool-info'>
                {props.pool.currentBoosterStakeValue
                  ? props.pool.currentBoosterStakeValue.toFixed(7)
                  : '0'}{' '}
                {props.pool.symbol}
              </span>
            </div>
            <hr />
            <div className='d-flex justify-content-between'>
              <span>Next leverage staked value (after Beast Mode)</span>
              <span className='text-right pool-info'>
                {props.pool.stakeValueNextBooster
                  ? props.pool.stakeValueNextBooster.toFixed(7)
                  : '0'}{' '}
                {props.pool.symbol}
              </span>
            </div>

            <br />
            <Row>
              <div className='col-sm-8 offset-sm-2'>
                {(props.pool?.hiveId === 'wbtchive' ||
                  !props.isHive ||
                  props.pool.token.isSuper) && (
                  <div>
                    <label htmlFor=''>Number of beasts modes</label>
                    <input
                      min='1'
                      max='50'
                      step='1'
                      type='number'
                      className='text-center'
                      value={beastModesAmount}
                      onChange={onChangeBeastModes}
                    />
                  </div>
                )}
                <div>
                  <button
                    type='button'
                    className='btn btn-primary bg-main-blue'
                    disabled={
                      ((props.pool?.hiveId === 'wbtchive' || !props.isHive) &&
                        !beastModesAmount) ||
                      +beastModesAmount > 50 ||
                      props.loaders?.beastModing
                    }
                    onClick={() => {
                      props.handleLoader(props.validateBoost, 'beastModing', [
                        beastModesAmount,
                      ]);
                    }}
                  >
                    {props.loaders.beastModing
                      ? 'Complete in metamask'
                      : 'Beast Mode'}
                  </button>
                </div>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StakeBuyBoost;
