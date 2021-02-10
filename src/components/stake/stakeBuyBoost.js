import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';

const secondCol = (props) => {
  return (
    <Col>
      <Card>
        <Card.Body>
          <div className='d-flex justify-content-between'>
            <span>Ethereum Price (USD)</span>
            <span>$ {props.pool.ethPrice}</span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Token Balance</span>
            <span>{props.pool.boostBalance} ETH</span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Cost of Beast Mode</span>
            <span>{props.pool.costBooster} ETH</span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Cost of Beast Mode (.)</span>
            <span>
              ${' '}
              {props.pool.costBoosterUSD
                ? props.pool.costBoosterUSD.toFixed(2)
                : '0.00'}
            </span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Time to next BEAST powerup</span>
            <span>
              {props.pool.timeToNextBoost - new Date().getTime() / 1000 > 0
                ? (
                    (props.pool.timeToNextBoost - new Date().getTime() / 1000) /
                    60
                  ).toFixed(0)
                : '0'}{' '}
              Minutes
            </span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Beast Modes currently active</span>
            <span className='text-right pool-info'>
              {props.pool.myBeastModes}
            </span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Current Beast Mode stake value</span>
            <span className='text-right pool-info'>
              {props.pool.currentBoosterStakeValue
                ? props.pool.currentBoosterStakeValue.toFixed(7)
                : '0'}{' '}
              {props.pool.symbol}
            </span>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <span>Staked value after next Beast Mode</span>
            <span className='text-right pool-info'>
              {props.pool.stakeValueNextBooster
                ? props.pool.stakeValueNextBooster.toFixed(7)
                : '0'}{' '}
              {props.pool.symbol}
            </span>
          </div>

          <br />
          <Row>
            <Col></Col>
            <Col>
              <div
                className='btn btn-primary bg-main-blue'
                onClick={props.validateBoost}
              >
                Beast Mode
              </div>
            </Col>
            <Col></Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

const StakeBuyBoost = (props) => {
  return (
    <>
      <Row className='pool-boxes pool-titles'>
        <Col>
          <Row>
            <Col>
              <Card>
                <Card.Body className='text-left'>
                  Total deposited:
                  <span className='pool-info'>
                    {props.pool.stakedBalance
                      ? props.pool.stakedBalance.toFixed(
                          props.pool.displayDecimal
                        )
                      : '0'}
                  </span>
                  <br></br>
                  Pool Rate:{' '}
                  <span className='pool-info'>
                    {props.pool.ratePerWeek
                      ? props.pool.ratePerWeek.toFixed(4)
                      : '0.0'}{' '}
                    {props.pool.poolRateSymbol}
                  </span>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Card className='pool-card'>
                <Card.Body className='text-left'>
                  <div className='hive-details'>
                    <Row>
                      <Col>
                        <span className='dot green'></span>
                        YOUR BALANCE
                      </Col>
                      <Col className='text-right pool-info'>
                        {props.pool.boostBalance
                          ? props.pool.boostBalance.toFixed(
                              props.pool.displayDecimal
                            )
                          : '0'}{' '}
                        ETH{' '}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span className='dot yellow'></span>
                        CURRENTLY STAKED
                      </Col>
                      <Col className='text-right pool-info'>
                        {props.pool.stakedBalance
                          ? props.pool.stakedBalance.toFixed(
                              props.pool.displayDecimal
                            )
                          : '0'}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <span className='dot purple'></span>
                        BEAST MODE X
                      </Col>
                      <Col className='text-right pool-info'>
                        {props.pool.myBeastModes}
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
          </Row>
        </Col>
        {secondCol(props)}
      </Row>
    </>
  );
};

export default StakeBuyBoost;