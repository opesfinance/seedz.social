import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withNamespaces } from 'react-i18next';




import LeftNav from "../leftnav/leftnav";
import Header from "../header/header";
import Footer from "../footer/footer";
import Store from "../../stores";

const store = Store.store


class Home extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const themeType = store.getStore('themeType')

    this.state = {
      activeClass: false,
      account: account,
      themeType : themeType
    };
  };

 

 
  render() {

 
   


    return (
      <>

        <div className="dark-mode m-0 p-0 h-100">
            <Header/>
            <LeftNav />
            <div className="pageHeader my-auto">
                Dashboard
              </div>
            <div className="main-content p-5 ml-5 text-center h-100 ">
              

                <div className="row ">

                    <div className="col-lg-3 col-md-12 col-sm-12">
                        <div className="row box-1  m-1 p-2 rounded ">
                            <div className="col-4 m-0 my-auto text-right">
                                <img alt=""
                                src={require('../../assets/opes-logo-big.png')}
                                height="50" />
                            </div>
                            <div className="col-8 m-0 my-auto text-left small font-weight-bold text-white">
                              <h3 class="p-0 m-0 text-bottom">45 M</h3>
                              <p class="p-0 m-0 text-bottom small font-weight-bold">LIQUIDITY LOCK</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-12 col-sm-12">
                        <div className="row box-2  m-1 p-2 rounded ">
                            <div className="col-4 m-0 my-auto text-right">
                                <img alt=""
                                src={require('../../assets/opes-logo-big.png')}
                                height="50" />
                            </div>
                            <div className="col-8 m-0 my-auto text-left small font-weight-bold text-white">
                              <h3 class="p-0 m-0 text-bottom">45 M</h3>
                              <p class="p-0 m-0 text-bottom small font-weight-bold">BEAST MODE AMOUNT</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-12 col-sm-12">
                        <div className="row box-3  m-1 p-2 rounded ">
                            <div className="col-4 m-0 my-auto text-right">
                                <img alt=""
                                src={require('../../assets/opes-logo-big.png')}
                                height="50" />
                            </div>
                            <div className="col-8 m-0 my-auto text-left small font-weight-bold text-white">
                              <h3 class="p-0 m-0 text-bottom">45 M</h3>
                              <p class="p-0 m-0 text-bottom small font-weight-bold">MINTED SEEDZ</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-12 col-sm-12">
                        <div className="row box-4  m-1 p-2 rounded ">
                            <div className="col-4 m-0 my-auto text-right">
                                <img alt=""
                                src={require('../../assets/opes-logo-big.png')}
                                height="50" />
                            </div>
                            <div className="col-8 m-0 my-auto text-left small font-weight-bold text-white">
                              <h3 class="p-0 m-0 text-bottom">45 M</h3>
                              <p class="p-0 m-0 text-bottom small font-weight-bold">WPE PRICE</p>
                            </div>
                        </div>
                    </div>


                </div>

            
                {/******************************************
                 * FARM SECTION
                 * *****************************************
                 */}

              <div className="row ">

                <div className="col-lg-3 p-1 col-md-12 col-sm-12">

                    <div className="row m-1 box-farm-1">

                    </div>

                </div>

                <div className="col-lg-3 p-1 col-md-12 col-sm-12">

                    <div className="row m-1 box-farm-2">

                    </div>

                </div>

                <div className="col-lg-3 p-1 col-md-12 col-sm-12">

                  <div className="row m-1 box-farm-2">

                  </div>

                </div>


                <div className="col-lg-3 p-1 col-md-12 col-sm-12">

                  <div className="row m-1 box-farm-2">

                  </div>

                </div>

              </div>
              



           
          </div>
          <Footer/>
      </div>
      </>
    )
  };

 




}

export default withNamespaces()(withRouter((Home)));
