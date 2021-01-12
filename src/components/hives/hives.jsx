import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from 'react-i18next';



import {
  CONFIGURE_RETURNED,
  GET_BALANCES, 
  GET_BALANCES_RETURNED,
  GET_BOOSTEDBALANCES_RETURNED,
} from '../../constants/constants'
import LeftNav from "../leftnav/leftnav";
import Header from "../header/header";
import Footer from "../footer/footer";
import Store from "../../stores/store";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store


class Hives extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const rewardPools = store.getStore('rewardPools')
    const themeType = store.getStore('themeType')
    const activeClass = store.getStore('activeClass')

    console.log(account)

    this.state = {
      activeClass: activeClass,
      rewardPools: rewardPools,
      loading: !(account && rewardPools),
      account: account,
      themeType : themeType
    };

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })

  };

  componentWillMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.on(GET_BOOSTEDBALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(GET_BOOSTEDBALANCES_RETURNED, this.balancesReturned);
  }

  balancesReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({ rewardPools: rewardPools })
  }
  boostInfoReturned = () => {
    const rewardPools = store.getStore('rewardPools')
    this.setState({ rewardPools: rewardPools })
  }
  configureReturned = () => {
    this.setState({ loading: false })
  }

  
  


  

  render() {
    

    return (
      <>

        <div className="dark-mode m-0 p-0">
            <Header/>
            <LeftNav />


            <div className="main-content p-5 ml-5 text-center ">
                {/* CONTENT */}
                <h1>Hives</h1>


            </div>
              
            <Footer/>
        </div>
      </>
    )
  };

 

  

}

export default withNamespaces()(withRouter((Hives)));
