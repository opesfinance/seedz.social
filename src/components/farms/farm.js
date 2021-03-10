import React from 'react';
import './farm.scss';
import { BiPlus } from 'react-icons/bi';
import { withRouter } from 'react-router-dom';
import Store from '../../stores/store';
import { Col, Card, Row } from 'react-bootstrap';

const bgSrc = require('../../assets/vault.png');

const Farm = (props) => {
  function address(address) {
    return `${props.address.substring(0, 5)}...${props.address.substring(
      props.address.length - 4,
      props.address.length
    )}`;
  }

  function navigateStake(farmPool) {
    Store.store.setStore({ currentPool: farmPool });
    props.history.push('/stake');
  }

  const pool = props.pool;

  return (
    <>
      <Col className='hive-wrapper'>
        {pool.name} ({pool.token})
        <Card>
          <Card.Body>
            <Row className='farm-logo'>
              <img
                alt=''
                className='farm-image'
                src={require(`../../assets/logos/${pool.token}.png`)}
              />
            </Row>
            <Row className='farm-plant'>
              <div
                onClick={() => {
                  if (pool.id != 'balancer-pool') {
                    navigateStake(pool);
                  }
                }}
                className='btn btn-primary bg-main-blue'
              >
                Plant
              </div>
            </Row>

            <Row className='farm-value'>
              <Col>
                <span className='dot green'></span>
                APY
              </Col>
              <Col className='text-right main-blue'>{pool.apy}%</Col>
            </Row>
            <Row className='farm-value'>
              <Col>
                <span className='dot yellow'></span>
                Time Left
              </Col>
              <Col className='text-right main-blue'>{pool.timeLeft}</Col>
            </Row>
            <Row className='farm-value'>
              <Col>
                <span className='dot purple'></span>
                Weekly Rewards
              </Col>
              <Col className='text-right main-blue'>
                {pool.weeklyRewards} {pool.token}
              </Col>
            </Row>
            <hr />
            <Row className='farm-value'>
              <Col>
                <span className='dot light-blue'></span>
                My Beast Modes
              </Col>
              <Col className='text-right main-blue'>
                {pool.myBeastModes * 10}
              </Col>
            </Row>
            <Row className='farm-value'>
              <Col>
                <span className='dot orange'></span>
                My Rewards
              </Col>
              <Col className='text-right main-blue'>
                {pool.myRewards} {pool.token}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default withRouter(Farm);
