import React from 'react';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import HivesList from '../hives/hives-list';
import ImportScript from '../utils/importScript';

const Home = () => {
  // const [account, setAccount] = useState(store.getStore('account'));
  // const [themeType, setThemeType] = useState(store.getStore('themeType'));

  return (
    <>
      <div className='pageHeader my-auto'>Dashboard</div>
      <div className='ml-sm-5 px-sm-5 ml-5 px-1 pb-5'>
        <div className='tvk-dashbard-container mt-5'>
          <ImportScript />
        </div>
        <div className='section-title text-left mt-4 mb-2 p-0'>Hives</div>
        <HivesList justifyContent='flex-start' />
        {/* <div className=' row'>
          <div className='col-lg-3 col-md-12 col-sm-12'>
            <div className='row box-1  m-1 p-2 rounded '>
              <div className='col-4 m-0 my-auto text-right'>
                <img
                  alt=''
                  src={require('../../assets/vault.png')}
                  height='40'
                />
              </div>
              <div className='col-8 m-0 my-auto text-left small font-weight-bold text-white'>
                <h3 className='p-0 m-0 text-bottom'>45 M</h3>
                <p className='p-0 m-0 text-bottom small font-weight-bold'>
                  LIQUIDITY LOCK
                </p>
              </div>
            </div>
          </div>

          <div className='col-lg-3 col-md-12 col-sm-12'>
            <div className='row box-2  m-1 p-2 rounded'>
              <div className='col-4 m-0 my-auto text-right'>
                <img
                  alt=''
                  src={require('../../assets/bear-pawprint.png')}
                  height='40'
                />
              </div>
              <div className='col-8 m-0 my-auto text-left small font-weight-bold text-white'>
                <h3 className='p-0 m-0 text-bottom'>45 M</h3>
                <p className='p-0 m-0 text-bottom small font-weight-bold'>
                  BEAST MODE AMOUNT
                </p>
              </div>
            </div>
          </div>

          <div className='col-lg-3 col-md-12 col-sm-12'>
            <div className='row box-3  m-1 p-2 rounded '>
              <div className='col-4 m-0 my-auto text-right'>
                <img
                  alt=''
                  src={require('../../assets/Capa.png')}
                  height='40'
                />
              </div>
              <div className='col-8 m-0 my-auto text-left small font-weight-bold text-white'>
                <h3 className='p-0 m-0 text-bottom'>45 M</h3>
                <p className='p-0 m-0 text-bottom small font-weight-bold'>
                  MINTED SEEDZ
                </p>
              </div>
            </div>
          </div>

          <div className='col-lg-3 col-md-12 col-sm-12'>
            <div className='row box-4  m-1 p-2 rounded '>
              <div className='col-4 m-0 my-auto text-right'>
                <img
                  alt=''
                  src={require('../../assets/App-Logo2.png')}
                  height='40'
                />
              </div>
              <div className='col-8 m-0 my-auto text-left small font-weight-bold text-white'>
                <h3 className='p-0 m-0 text-bottom'>45 M</h3>
                <p className='p-0 m-0 text-bottom small font-weight-bold'>
                  WPE PRICE
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className=' row '>
          <div className='section-title col-12 text-left mt-4'>FARMS</div>
          <div className='col-lg-3 p-1 col-md-12 col-sm-12 pb-0'>
            <div className='row m-1 box-farm pb-0 mb-0'>
              <div className='text-center w-100'>
                <img
                  alt=''
                  src={require('../../assets/groups/iupixel.png')}
                  height='100'
                />
              </div>
              <div className='col-12 p-0 small'>
                <ul className='text-left pl-4'>
                  <li className=''>
                    APY
                    <span className='float-right pr-4'>138 %</span>
                  </li>
                  <li>
                    DAYS LEFT
                    <span className='float-right pr-4'>265 DAYS</span>
                  </li>
                  <li>
                    WEEKLY REWARDS
                    <span className='float-right pr-4'>630 PIXEL</span>
                  </li>
                  <li>
                    MY BEAST
                    <span className='float-right pr-4'>4</span>
                  </li>
                  <li>
                    MY REWARDS
                    <span className='float-right pr-4'>20,339 PIXEL</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='col-lg-3 p-1 col-md-12 col-sm-12'>
            <div className='row m-1 box-farm'></div>
          </div>

          <div className='col-lg-3 p-1 col-md-12 col-sm-12'>
            <div className='row m-1 box-farm'></div>
          </div>

          <div className='col-lg-3 p-1 col-md-12 col-sm-12'>
            <div className='row m-1 box-farm'></div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default withNamespaces()(withRouter(Home));
