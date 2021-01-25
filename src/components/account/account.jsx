import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../../assets/css/style2.css';
import { ERROR } from '../../constants';

import Store from '../../stores/store';
import LeftNav from '../leftnav/leftnav';
import Header from '../header/header';
import Footer from '../footer/footer';

const emitter = Store.emitter;
const store = Store.store;

class Account extends Component {
  constructor(props) {
    super();

    const account = store.getStore('account');
    const themeType = store.getStore('themeType');
    const activeClass = store.getStore('activeClass');

    this.state = {
      activeClass: activeClass,
      loading: false,
      account: account,
      assets: store.getStore('assets'),
      modalOpen: false,
      themeType: themeType,
    };
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
  }

  errorReturned = (error) => {
    //TODO: handle errors
  };

  render() {
    return (
      <>
        <div className='dark-mode m-0 p-0'>
          <Header />
          <LeftNav />

          <div className='main-content p-5 ml-5 text-center  '>
            <h1>GET THE POWER YOU DESERVE</h1>
            <h4>The fairest distribution model the world has ever seen.</h4>
            <h6>
              Yield Farmers can now utilize the most valuable asset in the world
              to gain themselves an inside position on the next Mega-Corporation
              we build.
            </h6>
          </div>

          <Footer />
        </div>
      </>
    );
  }
}

export default withRouter(Account);
