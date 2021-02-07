import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';

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
                        <span className='dot green pool-titles'></span>YOUR
                        BALANCE
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
        <Col>
          <Card>
            <Card.Body>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Ethereum Price (USD)</Col>
                  <Col className='text-right pool-info'>
                    $ {props.pool.ethPrice}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Token Balance</Col>
                  <Col className='text-right pool-info'>
                    {props.pool.boostBalance} ETH
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Cost of Beast Mode</Col>
                  <Col className='text-right pool-info'>
                    {props.pool.costBooster} ETH
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Cost of Beast Mode (USD)</Col>
                  <Col className='text-right pool-info'>
                    ${' '}
                    {props.pool.costBoosterUSD
                      ? props.pool.costBoosterUSD.toFixed(2)
                      : '0.00'}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Time to next BEAST powerup</Col>
                  <Col className='text-right pool-info'>
                    {props.pool.timeToNextBoost - new Date().getTime() / 1000 >
                    0
                      ? (
                          (props.pool.timeToNextBoost -
                            new Date().getTime() / 1000) /
                          60
                        ).toFixed(0)
                      : '0'}{' '}
                    Minutes
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Beast Modes currently active</Col>
                  <Col className='text-right pool-info'>
                    {props.pool.myBeastModes}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Current Beast Mode stake value</Col>
                  <Col className='text-right pool-info'>
                    {props.pool.currentBoosterStakeValue
                      ? props.pool.currentBoosterStakeValue.toFixed(7)
                      : '0'}{' '}
                    {props.pool.symbol}
                  </Col>
                </Row>
              </Card>
              <Card className='pool-card-info text-left'>
                <Row>
                  <Col>Staked value after next Beast Mode</Col>
                  <Col className='text-right pool-info'>
                    {props.pool.stakeValueNextBooster
                      ? props.pool.stakeValueNextBooster.toFixed(7)
                      : '0'}{' '}
                    {props.pool.symbol}
                  </Col>
                </Row>
              </Card>
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
      </Row>
    </>
  );
};

export default StakeBuyBoost;
