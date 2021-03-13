import config from '../config';
import async from 'async';
import {
  ERROR,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES,
  GET_BALANCES_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  GET_CLAIMABLE_ASSET,
  GET_CLAIMABLE_ASSET_RETURNED,
  CLAIM,
  CLAIM_RETURNED,
  GET_CLAIMABLE,
  GET_CLAIMABLE_RETURNED,
  GET_BOOSTEDBALANCES,
  GET_BOOSTEDBALANCES_RETURNED,
  BOOST_STAKE,
  EXCHANGE,
  EXCHANGE_RETURNED,
  BUY_LP,
  BUY_LP_RETURNED,
} from '../constants';
import Web3 from 'web3';
import STORE from './store-init-constant';

const rp = require('request-promise');

const { Dispatcher } = require('flux');
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {
    let themeType = localStorage.getItem('themeType');
    // console.log('FIRST STORE ', themeType);
    if (themeType === undefined || themeType === null) {
      themeType = true;
      localStorage.setItem('themeType', true);
    }
    this.store = STORE;

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BOOSTEDBALANCES:
            this.getBoostBalances(payload);
            break;
          case GET_BALANCES:
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetual(payload);
            break;
          case BOOST_STAKE:
            this.boostStake(payload);
            break;
          case STAKE:
            this.stake(payload);
            break;
          case EXCHANGE:
            this.exchange(payload);
            break;
          case BUY_LP:
            this.buyLP(payload);
            break;
          case WITHDRAW:
            this.withdraw(payload);
            break;
          case GET_REWARDS:
            this.getReward(payload);
            break;
          case EXIT:
            this.exit(payload);
            break;
          case GET_CLAIMABLE_ASSET:
            this.getClaimableAsset(payload);
            break;
          case CLAIM:
            this.claim(payload);
            break;
          case GET_CLAIMABLE:
            this.getClaimable(payload);
            break;

          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(key) {
    return this.store[key];
  }

  setStore(obj) {
    this.store = { ...this.store, ...obj };
    // // console.log('Store ---', this.store);
    emitter.emit('StoreUpdated');
  }

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber();
    store.setStore({ currentBlock });

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED);
    }, 100);
  };

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber();
    store.setStore({ currentBlock });

    async.map(
      pools,
      (pool, callback) => {
        async.map(
          pool.tokens,
          (token, callbackInner) => {
            async.parallel(
              [
                (callbackInnerInner) => {
                  this._getERC20Balance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getstakedBalance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getRewardsAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getRatePerWeek(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                }, //_getBonusAvailable
                (callbackInnerInner) => {
                  this._getBonusAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
              ],
              (err, data) => {
                if (err) {
                  // //console.log(err)
                  return callbackInner(err);
                }

                token.balance = data[0];
                token.stakedBalance = data[1];
                token.rewardsAvailable = data[2];
                token.ratePerWeek = data[3];
                token.beastModeBonus = data[4];
                callbackInner(null, token);
              }
            );
          },
          (err, tokensData) => {
            if (err) {
              // //console.log(err)
              return callback(err);
            }

            pool.tokens = tokensData;
            callback(null, pool);
          }
        );
      },
      (err, poolData) => {
        if (err) {
          // //console.log(err)
          return emitter.emit(ERROR, err);
        }
        store.setStore({ rewardPools: poolData });
        emitter.emit(GET_BALANCES_PERPETUAL_RETURNED);
        emitter.emit(GET_BALANCES_RETURNED);
      }
    );
  };

  /**
   *
   * @param {Token} token from which balance will be retrieved
   */
  getAssetBalance = async (token) => {
    const account = store.getStore('account');
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let balance;

    if (token.label === 'ETH') {
      balance = await web3.eth.getBalance(account.address);
      return balance / 1000000000000000000;
    }

    return await this._getERC20Balance(web3, token, account, null);
  };

  getBalances = () => {
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(
      pools,
      (pool, callback) => {
        async.map(
          pool.tokens,
          (token, callbackInner) => {
            async.parallel(
              [
                (callbackInnerInner) => {
                  this._getERC20Balance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getstakedBalance(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getRewardsAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
                (callbackInnerInner) => {
                  this._getUniswapLiquidity(callbackInnerInner);
                },
                (callbackInnerInner) => {
                  this._getBalancerLiquidity(callbackInnerInner);
                },
                (callbackInnerInner) => {
                  this._getRatePerWeek(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                }, //_getBonusAvailable
                (callbackInnerInner) => {
                  this._getBonusAvailable(
                    web3,
                    token,
                    account,
                    callbackInnerInner
                  );
                },
              ],
              (err, data) => {
                if (err) {
                  // // console.log(err);
                  return callbackInner(err);
                }

                token.balance = data[0];
                token.stakedBalance = data[1];
                token.rewardsAvailable = data[2];
                if (pool.id === 'uniswap') {
                  pool.liquidityValue = data[3];
                } else if (pool.id === 'balancer') {
                  pool.liquidityValue = data[4];
                } else {
                  pool.liquidityValue = 0;
                }
                pool.ratePerWeek = data[5];
                pool.beastModeBonus = data[6];
                callbackInner(null, token);
              }
            );
          },
          (err, tokensData) => {
            if (err) {
              // // console.log(err);
              return callback(err);
            }

            pool.tokens = tokensData;
            callback(null, pool);
          }
        );
      },
      (err, poolData) => {
        if (err) {
          // // console.log(err);
          return emitter.emit(ERROR, err);
        }
        store.setStore({ rewardPools: poolData });
        emitter.emit(GET_BALANCES_RETURNED);
      }
    );
  };

  getBoostBalances = () => {
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(
      pools,
      (pool, callback) => {
        if (pool.boost === true) {
          async.map(
            pool.tokens,
            (token, callbackInner) => {
              async.parallel(
                [
                  (callbackInnerInner) => {
                    this._getBoosters(web3, token, account, callbackInnerInner);
                  },
                  (callbackInnerInner) => {
                    this._getBoosterCost(
                      web3,
                      token,
                      account,
                      callbackInnerInner
                    );
                  },
                  (callbackInnerInner) => {
                    this._getBoostTokenBalance(
                      web3,
                      token,
                      account,
                      callbackInnerInner
                    );
                  },
                  (callbackInnerInner) => {
                    this._getboostedBalances(
                      web3,
                      token,
                      account,
                      callbackInnerInner
                    );
                  },
                  (callbackInnerInner) => {
                    this._getBoosterPrice(callbackInnerInner);
                  },
                  (callbackInnerInner) => {
                    this._getNextBoostTime(
                      web3,
                      token,
                      account,
                      callbackInnerInner
                    );
                  },
                  (callbackInnerInner) => {
                    this._getETHPrice(callbackInnerInner);
                  },
                  //(callbackInnerInner) => { this._getBoostBalanceAvailable(web3, token, account, callbackInnerInner) }
                ],
                (err, data) => {
                  if (err) {
                    // console.log(err);
                    return callbackInner(err);
                  }

                  token.boosters = data[2];
                  token.costBooster = data[1][0];

                  // console.log(data);

                  // console.log('DATA' + data);
                  //token.boostBalance = data[0]

                  token.boostBalance = data[2];
                  //token.costBooster = 11
                  token.costBoosterUSD = data[4] * data[1][0];
                  token.currentActiveBooster = data[0];
                  token.currentBoosterStakeValue = data[3];
                  token.stakeValueNextBooster = data[1][1];
                  token.timeToNextBoost = data[5];
                  token.ethPrice = data[6];

                  callbackInner(null, token);
                }
              );
            },
            (err, tokensData) => {
              if (err) {
                // console.log(err);
                return callback(err);
              }

              pool.tokens = tokensData;
              callback(null, pool);
            }
          );
        }
      },
      (err, poolData) => {
        if (err) {
          // console.log(err);
          return emitter.emit(ERROR, err);
        }
        store.setStore({ rewardPools: poolData });
        emitter.emit(GET_BOOSTEDBALANCES_RETURNED);
      }
    );
  };

  getPrice = async (assetIn, assetOut) => {
    if (assetIn.label == assetOut.label) return 0;
    // console.log(
    //   'in',
    //   assetIn.label,
    //   assetIn.address,
    //   'out',
    //   assetOut.label,
    //   assetOut.address
    // );

    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const assets = store.getStore('exchangeAssets').tokens;

    //const { assetIn, assetOut} = payload.content;
    var route = [];
    if (assetIn.label != 'ETH') {
      route.push(assetIn.address);
    }
    route = route.concat([
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
    ]);
    route.push(assetOut.address);

    let test = await this._getOutputForInputVal(
      web3,
      assetIn,
      assetOut,
      route,
      '100',
      account
    ); // => {

    // console.log(test);

    let amountOut = (test[test.length - 1] / 10 ** assetOut.decimals).toFixed(
      4
    );
    var price = 100 / amountOut;
    // console.log(price);

    //ETH price

    var currentETH = assets.find((i) => i.label == 'ETH');
    currentETH.price =
      100 / (test[test.length - 3] / 10 ** currentETH.decimals).toFixed(4);

    //WPE price

    var currentWPE = assets.find((i) => i.label == 'WPE');
    var wpeTemp = (test[test.length - 2] / 10 ** currentWPE.decimals).toFixed(
      4
    );
    currentWPE.price = 100 / wpeTemp;

    var current = assets.find((i) => i.address == assetOut.address);
    current.price = price;
    return !Number.isNaN(price) ? price : 0;
  };

  getLpPrice = async (assetOut) => {
    const account = store.getStore('account');
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const assets = store.getStore('lpTokens');
    let price;

    if (assetOut.label == 'ETH' || assetOut.label == 'WPE') {
      const temp = { label: 'STR' };
      let test = await this._getLPprice(web3, temp, account); //set an LP token address for the moment
      price = (test[test.length - 3] / 100 / 10 ** 6).toFixed(4);

      if (assetOut.label == 'ETH') {
        const priceETH = (test[test.length - 2] / 100 / 10 ** 18).toFixed(4);
        const eth = assets.find((i) => i.label == 'ETH');
        eth.price = price / priceETH;
        price = eth.price;
      } else {
        const priceWPE = (test[test.length - 1] / 100 / 10 ** 18).toFixed(4);
        const wpe = assets.find((i) => i.label == 'WPE');
        wpe.price = price / priceWPE;
        price = wpe.price;
      }
    } else {
      let test = await this._getLPprice(web3, assetOut, account);
      //LP price
      price = (test[test.length - 3] / 100 / 10 ** 6).toFixed(4);
      const priceETH = (test[test.length - 2] / 100 / 10 ** 18).toFixed(4);
      const priceWPE = (test[test.length - 1] / 100 / 10 ** 18).toFixed(4);
      const current = assets.find((i) => i.address == assetOut.address);
      current.price = !Number.isNaN(price) ? price : 0;
      current.priceETH = !Number.isNaN(priceETH) ? priceETH : 0;
      current.priceWPE = !Number.isNaN(priceWPE) ? priceWPE : 0;
    }

    return !Number.isNaN(price) ? price : 0;
  };

  /**
   *
   * @param {Token} assetIn
   * @param {Token} assetOut
   * @param {Number} amountIn
   * @returns {Number} amount out
   */
  getAmountOut = async (assetIn, assetOut, amountIn) => {
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const assets = store.getStore('exchangeAssets').tokens;
    var current = assets.find((i) => i.address == assetOut.address);
    //const { assetIn, assetOut} = payload.content;

    var inputToken = assetIn;
    var outputToken = assetOut;
    var midRoute = current.route;

    if (assetIn.group == 'outputs') {
      inputToken = assetOut;
      outputToken = assetIn;
      var temp = assets.find((i) => i.address == outputToken.address);
      midRoute = temp.route;
    }

    var route = [];

    if (inputToken.label != 'ETH') {
      route.push(inputToken.address);
    }
    //Default route
    route = route.concat(midRoute);
    route.push(outputToken.address);

    if (assetIn.group == 'outputs') {
      route = route.reverse();
    }

    let dataBack = await this._getOutputForInputVal(
      web3,
      assetIn,
      assetOut,
      route,
      amountIn,
      account
    ); // => {

    // console.log(dataBack);

    let amountOut = (
      dataBack[dataBack.length - 1] /
      10 ** assetOut.decimals
    ).toFixed(9);
    // console.log('Asset IN ', assetIn.label);
    // console.log('Asset Out ', assetOut.label);
    // console.log('AMOUNT IN ', amountIn);
    // console.log('AMOUNT OUT ', amountOut);

    return amountOut;
  };

  _getOutputForWPELP = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPElpAddressABI,
      config.WPElpAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountFor(amountToSend) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      return (amount / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  getLpAmountOut = async (assetIn, assetOut, amountIn) => {
    const assets = store.getStore('lpTokens');
    var current = assets.find((i) => i.address == assetOut.address);
    const account = store.getStore('account');
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let amountOut;

    //LP price
    if (assetIn.label === 'ETH') {
      if (current.label == 'WPE') {
        amountOut = await this._getOutputForWPELP(web3, amountIn, account);
      } else {
        amountOut = amountIn * (1 / current.priceETH);
      }
    } else if (assetIn.label === 'WPE') {
      amountOut = amountIn * (1 / current.priceWPE);
    } else {
      //stable coin
      amountOut = amountIn * (1 / current.price);
    }

    return amountOut;
  };

  _getOutputForInputVal = async (
    web3,
    assetIn,
    assetOut,
    route,
    amountIn,
    account
  ) => {
    let uniswapRouter = new web3.eth.Contract(
      config.uniswapRouterABI,
      config.uniswapRouterAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');
    if (assetIn.decimals !== 18) {
      amountToSend = (amountIn * 10 ** assetIn.decimals).toFixed(0);
    }
    try {
      var amounts = await uniswapRouter.methods
        .getAmountsOut(amountToSend, route) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      return amounts;
      //callback(null, amounts);
    } catch (ex) {
      return ex;
    }
  };

  _getUniswapLiquidity = async (callback) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      var graphql = JSON.stringify({
        query:
          '{\n pair(id: "0x75f89ffbe5c25161cbc7e97c988c9f391eaefaf9"){\n     reserveUSD\n}\n}',
        variables: {},
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2',
        requestOptions
      );
      const myJson = await response.json();
      // console.log(myJson.data.pair.reserveUSD);
      callback(null, parseFloat(myJson.data.pair.reserveUSD).toFixed(2));
    } catch (e) {
      return callback(e);
    }
  };

  _getBalancerLiquidity = async (callback) => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      var graphql = JSON.stringify({
        query:
          '{\n pool(id: "0x5b2dc8c02728e8fb6aea03a622c3849875a48801"){\n     liquidity\n}\n}',
        variables: {},
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: graphql,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-beta',
        requestOptions
      );
      const myJson = await response.json();
      // console.log(myJson.data.pool.liquidity);
      callback(null, parseFloat(myJson.data.pool.liquidity).toFixed(2));
    } catch (e) {
      return callback(e);
    }
  };

  _getLPprice = async (web3, assetOut, account) => {
    //get coin lp contract address
    let contract = assetOut.label + 'lpAddress';

    //FOR THE REST OF THE COINS
    let coinRouter = new web3.eth.Contract(
      config.lpAddressABI,
      config[contract]
    );

    try {
      let amounts = await coinRouter.methods
        .getPriceFor(web3.utils.toWei('100', 'ether'))
        .call({ from: account.address });
      return amounts;
    } catch (ex) {
      return ex;
    }
  };

  _getETHPrice = async (callback) => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD'
      );
      const myJson = await response.json();
      var balance = parseFloat(myJson.ethereum.usd);
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };

  _getBoosterPrice = async (callback) => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD'
      );
      const myJson = await response.json();
      // console.log(myJson.ethereum.usd);
      var balance = parseFloat(myJson.ethereum.usd);
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };
  _getBoosters = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      var balance = await boostContract.methods
        .numBoostersBought(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance);
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };
  _getBoosterCost = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      var balance = await boostContract.methods
        .getBoosterPrice(account.address)
        .call({ from: account.address });
      // console.log(balance);
      // console.log(balance[0]);
      // console.log(balance[1]);

      var boostInfo = [
        parseFloat(balance[0]) / 10 ** asset.decimals,
        parseFloat(balance[1]) / 10 ** asset.decimals,
      ];
      callback(null, boostInfo);
    } catch (ex) {
      return callback(ex);
    }
  };
  _getboostedBalances = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      var balance = await boostContract.methods
        .boostedBalances(account.address)
        .call({ from: account.address });
      // console.log(balance);

      var boostInfo = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, boostInfo);
    } catch (ex) {
      return callback(ex);
    }
  };

  _getBoostTokenBalance = async (web3, asset, account, callback) => {
    try {
      var balance = await web3.eth.getBalance(account.address);

      var boostInfo = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, boostInfo);
    } catch (ex) {
      return callback(ex);
    }
  };

  _getNextBoostTime = async (web3, asset, account, callback) => {
    let boostTokenContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );
    // console.log('>>>>>>> NEXT BOOST TIME');
    try {
      var time = await boostTokenContract.methods
        .nextBoostPurchaseTime(account.address)
        .call({ from: account.address });
      // console.log(time);
      // console.log(new Date().getTime() / 1000);
      var boostInfo = parseInt(time);
      callback(null, boostInfo);
    } catch (ex) {
      return callback(ex);
    }
  };
  _checkApprovalLiquidity = async (
    asset,
    assetOut,
    account,
    amount,
    callback
  ) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      console.log(asset);
      console.log(assetOut);

      let contractLPSell = config[assetOut.label + 'lpAddress'];
      console.log(contractLPSell);
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.address
      );
      const allowance = await erc20Contract.methods
        .allowance(account.address, contractLPSell)
        .call({ from: account.address });

      const ethAllowance = web3.utils.fromWei(allowance, 'ether');

      if (parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods
          .approve(contractLPSell, web3.utils.toWei('999999999999999', 'ether'))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          });
        callback();
      } else {
        callback();
      }
    } catch (error) {
      // console.log(error);
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };
  _checkApprovalExchange = async (asset, account, amount, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.address
      );
      const allowance = await erc20Contract.methods
        .allowance(account.address, config.exchangeAddress)
        .call({ from: account.address });

      const ethAllowance = web3.utils.fromWei(allowance, 'ether');

      if (parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods
          .approve(
            config.exchangeAddress,
            web3.utils.toWei('999999999999999', 'ether')
          )
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          });
        callback();
      } else {
        callback();
      }
    } catch (error) {
      // console.log(error);
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };
  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.address
      );
      const allowance = await erc20Contract.methods
        .allowance(account.address, contract)
        .call({ from: account.address });

      const ethAllowance = web3.utils.fromWei(allowance, 'ether');

      if (parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods
          .approve(contract, web3.utils.toWei('999999999999999', 'ether'))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          });
        callback();
      } else {
        callback();
      }
    } catch (error) {
      // console.log(error);
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };

  _checkApprovalWaitForConfirmation = async (
    asset,
    account,
    amount,
    contract,
    callback
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address);
    const allowance = await erc20Contract.methods
      .allowance(account.address, contract)
      .call({ from: account.address });

    const ethAllowance = web3.utils.fromWei(allowance, 'ether');

    if (parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods
        .approve(contract, web3.utils.toWei('999999999999999', 'ether'))
        .send({
          from: account.address,
          gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        })
        .on('transactionHash', function (hash) {
          callback();
        })
        .on('error', function (error) {
          if (!error.toString().includes('-32601')) {
            if (error.message) {
              return callback(error.message);
            }
            callback(error);
          }
        });
    } else {
      callback();
    }
  };

  _getRatePerWeek = async (web3, asset, account, callback) => {
    let contract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      var rate = await contract.methods
        .currentReward()
        .call({ from: account.address });
      rate = parseFloat(rate) / 10 ** asset.decimals;
      callback(null, rate);
    } catch (ex) {
      callback(null, ex);
    }
  };

  _getBonusAvailable = async (web3, asset, account, callback) => {
    let contract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      var beastmodes = await contract.methods
        .timeLockLevel()
        .call({ from: account.address });
      beastmodes = parseFloat(beastmodes[1]);
      callback(null, beastmodes);
    } catch (ex) {
      callback(null, ex);
    }
  };

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address);

    try {
      var balance = await erc20Contract.methods
        .balanceOf(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** asset.decimals;
      // console.log(
      //   'balance ---',
      //   parseFloat(balance) / 10,
      //   balance,
      //   asset.decimals
      // );
      if (callback && typeof callback === 'function') {
        callback(null, parseFloat(balance));
      } else {
        return parseFloat(balance);
      }
    } catch (ex) {
      callback(ex);
    }
  };

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );
    try {
      var balance = await erc20Contract.methods
        .balanceOf(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, parseFloat(balance));
    } catch (ex) {
      callback(ex);
    }
  };

  _getBoostBalanceAvailable = async (web3, asset, account, callback) => {
    let boostTokenContract = new web3.eth.Contract(
      config.erc20ABI,
      config.boostTokenAddress
    );
    let boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );
    // console.log('++++++++++' + asset + '+++++++++++');
    try {
      var boosters = await boostContract.methods
        .numBoostersBought(account.address)
        .call({ from: account.address }); //await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      var balance = parseFloat(balance) / 10 ** asset.decimals;

      asset.boostBalance = await boostTokenContract.methods
        .balanceOf(account.address)
        .call({ from: account.address });

      var boostedPriceFuture = await boostContract.methods
        .getBoosterPrice(account.address)
        .call({ from: account.address });
      // console.log('>>>>>>>' + boostedPriceFuture);

      asset.costBooster = boostedPriceFuture[0] / 10 ** asset.decimals;
      asset.costBoosterUSD = 0;
      asset.currentActiveBooster = boosters;
      asset.currentBoosterStakeValue = 0;
      asset.stakeValueNextBooster =
        boostedPriceFuture[1] / 10 ** asset.decimals;
      // console.log('>>>>>>>' + balance);
      // console.log('>>>>>>>' + boostedPriceFuture);
      callback(null, parseFloat(balance));
    } catch (ex) {
      callback(ex);
    }
  };

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    try {
      var earned = await erc20Contract.methods
        .earned(account.address)
        .call({ from: account.address });
      earned = parseFloat(earned) / 10 ** asset.decimals;
      callback(null, parseFloat(earned));
    } catch (ex) {
      return callback(ex);
    }
  };

  _checkIfApprovalIsNeeded = async (
    asset,
    account,
    amount,
    contract,
    callback,
    overwriteAddress
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(
      config.erc20ABI,
      overwriteAddress ? overwriteAddress : asset.address
    );
    const allowance = await erc20Contract.methods
      .allowance(account.address, contract)
      .call({ from: account.address });

    const ethAllowance = web3.utils.fromWei(allowance, 'ether');
    if (parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount;
      callback(null, asset);
    } else {
      callback(null, false);
    }
  };

  _callApproval = async (
    asset,
    account,
    amount,
    contract,
    last,
    callback,
    overwriteAddress
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(
      config.erc20ABI,
      overwriteAddress ? overwriteAddress : asset.address
    );
    try {
      if (last) {
        await erc20Contract.methods
          .approve(contract, web3.utils.toWei('999999999999999', 'ether'))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          });
        callback();
      } else {
        erc20Contract.methods
          .approve(contract, web3.utils.toWei('999999999999999', 'ether'))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          })
          .on('transactionHash', function (hash) {
            callback();
          })
          .on('error', function (error) {
            if (!error.toString().includes('-32601')) {
              if (error.message) {
                return callback(error.message);
              }
              callback(error);
            }
          });
      }
    } catch (error) {
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };

  /**
   * -------------------------
   * EXCHANGE LOGIC
   * ----------------------------
   */

  buyWithEth = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;

    this._buyWithEthCall(assetOut, account, amountOut, amountIn, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXCHANGE_RETURNED, res); //EXCHANGEETHFORTOKEN_RETURNED
    });
  };
  _buyWithEthCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const exchangeContract = new web3.eth.Contract(
      config.exchangeABI,
      config.exchangeAddress
    );

    exchangeContract.methods
      .buyTokenWithEth(asset.address, 0) //address tokenOut, uint256 amountOut SET TO 0 FOR TEST PURPOSES
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(value, 'ether'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };
  buyWithToken = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;

    this._checkApprovalExchange(assetIn, account, amountIn, (err) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      this._buyWithTokenCall(
        assetIn,
        assetOut,
        amountIn,
        amountOut,
        account,
        (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(EXCHANGE_RETURNED, res);
        }
      );
    });
  };
  _buyWithTokenCall = async (
    assetIn,
    assetOut,
    amountIn,
    amountOut,
    account,
    callback
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const exchangeContract = new web3.eth.Contract(
      config.exchangeABI,
      config.exchangeAddress
    );

    var amountToSend = web3.utils.toWei(amountIn, 'ether');
    if (assetIn.decimals !== 18) {
      amountToSend = (amountIn * 10 ** assetIn.decimals).toFixed(0);
    }
    // console.log('Amount to send ', amountToSend);
    // console.log('Asset In ', assetIn.address);
    // console.log('Amount In ', amountIn);
    // console.log('Asset Out ', assetOut.address);
    // //console.log("Asset In ", assetIn.address);

    exchangeContract.methods
      .buyTokenWithToken(assetIn.address, assetOut.address, amountToSend, 0) //IERC20 tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };
  sellWithToken = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;

    this._checkApprovalExchange(assetIn, account, amountIn, (err) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      this._sellWithTokenCall(
        assetIn,
        assetOut,
        amountIn,
        amountOut,
        account,
        (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(EXCHANGE_RETURNED, res);
        }
      );
    });
  };
  _sellWithTokenCall = async (
    assetIn,
    assetOut,
    amountIn,
    amountOut,
    account,
    callback
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const exchangeContract = new web3.eth.Contract(
      config.exchangeABI,
      config.exchangeAddress
    );

    var amountToSend = web3.utils.toWei(amountIn, 'ether');
    if (assetIn.decimals !== 18) {
      amountToSend = (amountIn * 10 ** assetIn.decimals).toFixed(0);
    }
    // console.log('Amount to send ', amountToSend);
    // console.log('Asset In ', assetIn.address);
    // console.log('Amount In ', amountIn);
    // console.log('Asset Out ', assetOut.address);
    // //console.log("Asset In ", assetIn.address);

    exchangeContract.methods
      .sellTokenToToken(assetIn.address, assetOut.address, amountToSend, 0) //IERC20 tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };
  sellWithTokenToEth = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;

    this._checkApprovalExchange(assetIn, account, amountIn, (err) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      this._sellWithTokenToEthCall(
        assetIn,
        assetOut,
        amountIn,
        amountOut,
        account,
        (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(EXCHANGE_RETURNED, res);
        }
      );
    });
  };
  _sellWithTokenToEthCall = async (
    assetIn,
    assetOut,
    amountIn,
    amountOut,
    account,
    callback
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const exchangeContract = new web3.eth.Contract(
      config.exchangeABI,
      config.exchangeAddress
    );

    var amountToSend = web3.utils.toWei(amountIn, 'ether');
    if (assetIn.decimals !== 18) {
      amountToSend = (amountIn * 10 ** assetIn.decimals).toFixed(0);
    }
    // console.log('Amount to send ', amountToSend);
    // console.log('Asset In ', assetIn.address);
    // console.log('Amount In ', amountIn);
    // console.log('Asset Out ', assetOut.address);
    // //console.log("Asset In ", assetIn.address);

    exchangeContract.methods
      .sellTokenToEth(assetIn.address, amountToSend, 0) //IERC20 tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };
  exchange = (payload) => {
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;
    if (assetIn.group == 'inputs') {
      // buscar en que gerupo
      if (assetIn.label == 'ETH') {
        this.buyWithEth(payload);
      } else {
        this.buyWithToken(payload);
      }
    } // vender tokens
    else {
      if (assetOut.label == 'ETH') {
        this.sellWithTokenToEth(payload);
      } else {
        this.sellWithToken(payload);
      }
    }
  };

  buyLPWithEth = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;

    if (assetOut.label == 'WPE') {
      this._buyWPELPWithEthCall(
        assetOut,
        account,
        amountOut,
        amountIn,
        (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(BUY_LP_RETURNED, res); //EXCHANGEETHFORTOKEN_RETURNED
        }
      );
    } else {
      this._buyLPWithEthCall(
        assetOut,
        account,
        amountOut,
        amountIn,
        (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(BUY_LP_RETURNED, res); //EXCHANGEETHFORTOKEN_RETURNED
        }
      );
    }
  };
  _buyWPELPWithEthCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'lpAddress';
    const coinContract = new web3.eth.Contract(
      config.WPElpAddressABI,
      config[contract]
    );

    console.log('Amount ' + amount);
    console.log('value ' + value);
    let multiplier = 1.005;
    const buyAmount = web3.utils.toWei(amount.toString(), 'ether');

    console.log(buyAmount);
    coinContract.methods
      .createLPETHToken(buyAmount)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(value) * multiplier).toString(),
          'ether'
        ),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        /*if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }*/
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };
  _buyLPWithEthCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'lpAddress';
    const coinContract = new web3.eth.Contract(
      config.lpAddressABI,
      config[contract]
    );

    console.log('Amount ' + amount);
    console.log('value ' + value);
    let multiplier = 1.005;
    if (asset.label == 'PIXEL') {
      multiplier = 1.01;
    }
    const buyAmount = web3.utils.toWei(amount.toString(), 'ether');

    console.log(buyAmount);
    coinContract.methods
      .buyLPTokensEth(buyAmount)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(value) * multiplier).toString(),
          'ether'
        ),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        /*if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }*/
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  buyLPWithToken = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;
    this._checkApprovalLiquidity(
      assetIn,
      assetOut,
      account,
      amountIn,
      (err) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        this._buyLPWithTokenCall(
          assetOut,
          assetIn,
          account,
          amountOut,
          amountIn,
          (err, res) => {
            if (err) {
              return emitter.emit(ERROR, err);
            }

            return emitter.emit(BUY_LP_RETURNED, res);
          }
        );
      }
    );
  };
  _buyLPWithTokenCall = async (
    asset,
    token,
    account,
    amount,
    value,
    callback
  ) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'lpAddress';
    const coinContract = new web3.eth.Contract(
      config.lpAddressABI,
      config[contract]
    );
    console.log('ASSET IN LP TOKEN CALL');
    console.log(asset);
    console.log('sldjlkdajsflk');
    console.log(token);
    console.log('CONTRATO ', config[contract]);

    const buyAmount = web3.utils.toWei(amount.toString(), 'ether');
    // var amountToSend = web3.utils.toWei(amountIn, 'ether');
    // if (assetIn.decimals !== 18) {
    //   amountToSend = (amountIn * 10 ** assetIn.decimals).toFixed(0);
    // }
    coinContract.methods
      .buyLPTokensWithToken(buyAmount, token.address)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        /*if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }*/
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  buyLP = (payload) => {
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;

    if (assetIn.label == 'ETH') {
      //- [ ] BUYLPTOKENSWITHEYTHEREUM
      this.buyLPWithEth(payload);
    } else {
      //BUYWITHTOKEN
      console.log('buy lp with token');
      this.buyLPWithToken(payload);
    }
  };

  /**
   * -------------------------
   * START STAKE ON BOOST
   * ----------------------------
   */
  boostStake = (payload) => {
    // console.log('BOOOST!!!');
    const account = store.getStore('account');
    const { asset, amount, value } = payload.content;

    this._boostcallStake(asset, account, amount, value, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(STAKE_RETURNED, res);
    });
  };
  _boostcheckApproval = async (asset, account, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.boostTokenAddress
      );
      const allowance = await erc20Contract.methods
        .allowance(account.address, contract)
        .call({ from: account.address });

      const ethAllowance = web3.utils.fromWei(allowance, 'ether');

      if (parseFloat(ethAllowance) < parseFloat('999999999')) {
        await erc20Contract.methods
          .approve(contract, web3.utils.toWei('9999999999', 'ether'))
          .send({
            from: account.address,
            gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
          });
        callback();
      } else {
        callback();
      }
    } catch (error) {
      // console.log(error);
      if (error.message) {
        return callback(error.message);
      }
      callback(error);
    }
  };

  _boostcallStake = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    boostContract.methods
      .beastMode()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(value, 'ether'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  /**
   * -------------------------
   * END STAKE ON BOOST
   * ----------------------------
   */
  stake = (payload) => {
    const account = store.getStore('account');
    const { asset, amount } = payload.content;

    this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      this._callStake(asset, account, amount, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res);
      });
    });
  };

  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, 'ether');
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods
      .stake(amountToSend)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  withdraw = (payload) => {
    const account = store.getStore('account');
    const { asset, amount } = payload.content;

    this._callWithdraw(asset, account, amount, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res);
    });
  };

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, 'ether');
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods
      .withdraw(amountToSend)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getReward = (payload) => {
    const account = store.getStore('account');
    const { asset } = payload.content;

    this._callGetReward(asset, account, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res);
    });
  };

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    yCurveFiContract.methods
      .getReward()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  exit = (payload) => {
    const account = store.getStore('account');
    const { asset } = payload.content;

    this._callExit(asset, account, (err, res) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res);
    });
  };

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    yCurveFiContract.methods
      .exit()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getClaimableAsset = (payload) => {
    const account = store.getStore('account');
    const asset = store.getStore('claimableAsset');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel(
      [
        (callbackInnerInner) => {
          this._getClaimableBalance(web3, asset, account, callbackInnerInner);
        },
        (callbackInnerInner) => {
          this._getClaimable(web3, asset, account, callbackInnerInner);
        },
      ],
      (err, data) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        asset.balance = data[0];
        asset.claimableBalance = data[1];

        store.setStore({ claimableAsset: asset });
        emitter.emit(GET_CLAIMABLE_ASSET_RETURNED);
      }
    );
  };

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address);

    try {
      var balance = await erc20Contract.methods
        .balanceOf(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(
      config.claimABI,
      config.claimAddress
    );

    try {
      var balance = await claimContract.methods
        .claimable(account.address)
        .call({ from: account.address });
      balance = parseFloat(balance) / 10 ** asset.decimals;
      callback(null, parseFloat(balance));
    } catch (ex) {
      return callback(ex);
    }
  };

  claim = (payload) => {
    const account = store.getStore('account');
    const asset = store.getStore('claimableAsset');
    const { amount } = payload.content;

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if (err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res);
      });
    });
  };

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const claimContract = new web3.eth.Contract(
      config.claimABI,
      config.claimAddress
    );

    var amountToSend = web3.utils.toWei(amount, 'ether');
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    claimContract.methods
      .claim(amountToSend)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
      })
      .on('transactionHash', function (hash) {
        // console.log(hash);
        callback(null, hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // console.log(confirmationNumber, receipt);
        if (confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} });
        }
      })
      .on('receipt', function (receipt) {
        // console.log(receipt);
      })
      .on('error', function (error) {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      })
      .catch((error) => {
        if (!error.toString().includes('-32601')) {
          if (error.message) {
            return callback(error.message);
          }
          callback(error);
        }
      });
  };

  getClaimable = (payload) => {
    const account = store.getStore('account');
    const asset = store.getStore('claimableAsset');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel(
      [
        (callbackInnerInner) => {
          this._getClaimableBalance(web3, asset, account, callbackInnerInner);
        },
        (callbackInnerInner) => {
          this._getClaimable(web3, asset, account, callbackInnerInner);
        },
      ],
      (err, data) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        asset.balance = data[0];
        asset.claimableBalance = data[1];

        store.setStore({ claimableAsset: asset });
        emitter.emit(GET_CLAIMABLE_RETURNED);
      }
    );
  };

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/';
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString);
      if (priceJSON) {
        return priceJSON.fast.toFixed(0);
      }
      return store.getStore('universalGasPrice');
    } catch (e) {
      // console.log(e);
      return store.getStore('universalGasPrice');
    }
  };
}

var store = new Store();

export default {
  store,
  dispatcher,
  emitter,
};
