import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from 'react-i18next';


import {
  CONFIGURE_RETURNED,
} from '../../constants'
import LeftNav from "../leftnav/leftnav";
import Header from "../header/header";
import Footer from "../footer/footer";
import Store from "../../stores";
const emitter = Store.emitter
const store = Store.store


class WhaleTank extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const themeType = store.getStore("themeType") 
    const activeClass = store.getStore("activeClass")

    this.state = {
      activeClass: activeClass,
      account: account,
      themeType : themeType
    };
  };

  componentWillMount() {
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
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
                <h1>Whale Tank</h1>


            </div>
              
            <Footer/>
        </div>
        
      </>
    )
  };

 





}

export default withNamespaces()(withRouter((WhaleTank)));
