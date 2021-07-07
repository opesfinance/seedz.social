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
import STORE_INIT_CONSTANTS from './store-init-constant';
import * as balancesLib from './lib';
// import * as balanceHivesFns from './balance.hives.functions';

const rp = require('request-promise');

const { Dispatcher } = require('flux');
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {
    let themeType = localStorage.getItem('themeType');
    // console.log('FIRST STORE_INIT_CONSTANTS ', themeType);
    if (themeType === undefined || themeType === null) {
      themeType = true;
      localStorage.setItem('themeType', true);
    }
    this.store = STORE_INIT_CONSTANTS;

    dispatcher.register(
      function (payload) {
        switch (payload.type) {
          case CONFIGURE:
            this.configure(payload);
            break;
          case GET_BOOSTEDBALANCES:
            this.getBoostBalances(payload);
            this.getBoostBalancesFarms(payload);
            break;
          case GET_BALANCES:
            this.getBalancesFarms(payload);
            this.getBalances(payload);
            break;
          case GET_BALANCES_PERPETUAL:
            this.getBalancesPerpetualFarms(payload);
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

  getBalancesPerpetualFarms = async () => {
    let methods = [
      '_getERC20Balance',
      '_getstakedBalance',
      '_getRewardsAvailable',
      '_getRatePerWeek',
      '_getBonusAvailable',
    ];

    const pools = store.getStore('farmPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber();
    store.setStore({ currentBlock });

    try {
      let poolsPromises = pools.map(async (pool) => {
        let tokenPromises = pool.tokens.map(async (token) => {
          // console.log(web3, token, account);
          let methodPromises = methods.map((method) =>
            balancesLib[method](web3, token, account)
          );

          let results = await Promise.all(methodPromises);
          // console.log(results);
          token.balance = results[0];
          token.stakedBalance = results[1];
          token.rewardsAvailable = results[2];
          token.ratePerWeek = results[3];
          token.beastModeBonus = results[4];

          return token;
        });

        pool.tokens = await Promise.all(tokenPromises);
        return pool;
      });
      // console.log(poolsPromises);
      let poolData = await Promise.all(poolsPromises);
      // console.log(poolData);
      store.setStore({ farmPools: poolData });
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED);
      emitter.emit(GET_BALANCES_RETURNED);
    } catch (error) {
      console.log(error);
      return emitter.emit(ERROR, error);
    }
  };

  getBalancesPerpetual = async () => {
    let methods = [
      '_getERC20Balance',
      '_getstakedBalance',
      '_getRewardsAvailable',
      '_getRatePerWeek',
      '_getBonusAvailable',
    ];
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber();
    store.setStore({ currentBlock });

    let nftIds = [];

    // this loop sets the selected nft for each pool.
    // to do - store the nft selection in localstorage
    // nft by pool
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if (pool.isSuperHive) {
        nftIds = await this.getNFTIds(pool.tokens[0].stakeNFT);
        if (nftIds?.length) {
          if (pool.tokens[0].selectedNftId == -2) {
            pool.tokens[0].selectedNftId = nftIds[0];
          }
          pool.tokens[0].nftIds = nftIds;
        } else {
          pool.tokens[0].selectedNftId = -1;
        }
      }
    }

    try {
      let poolsPromises = pools.map(async (pool) => {
        let tokenPromises = pool.tokens.map(async (token) => {
          // console.log(web3, token, account);
          let methodPromises = methods.map((method) =>
            balancesLib[method](web3, token, account)
          );

          let results = await Promise.all(methodPromises);
          // console.log(results);
          token.balance = results[0];
          token.stakedBalance = results[1];
          token.rewardsAvailable = results[2];
          token.ratePerWeek = results[3];
          token.beastModeBonus = results[4];

          return token;
        });

        pool.tokens = await Promise.all(tokenPromises);
        return pool;
      });
      // console.log(poolsPromises);
      let poolData = await Promise.all(poolsPromises);
      // console.log(poolData);
      store.setStore({ rewardPools: poolData });
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED);
      emitter.emit(GET_BALANCES_RETURNED);
    } catch (error) {
      console.log(error);
      return emitter.emit(ERROR, error);
    }
  };

  /**
   *
   * @param {Token} token from which balance will be retrieved
   */
  getAssetBalance = async (token) => {
    try {
      const account = store.getStore('account');
      const web3 = new Web3(store.getStore('web3context').library.provider);

      let balance;

      if (token.label === 'ETH') {
        balance = await web3.eth.getBalance(account.address);
        return balance / 10 ** 18;
      }

      return await this._getERC20Balance(web3, token, account, null);
    } catch (error) {
      return 0;
    }
  };

  getBalancesFarms = async () => {
    const methods = [
      '_getERC20Balance',
      '_getstakedBalance',
      '_getRewardsAvailable',
      '_getRatePerWeek',
    ];
    const pools = store.getStore('farmPools');
    const account = store.getStore('account');
    const web3 = new Web3(store.getStore('web3context').library.provider);

    try {
      let poolsPromises = pools.map(async (pool) => {
        let tokenPromises = pool.tokens.map(async (token) => {
          // console.log(web3, token, account);
          let methodPromises = methods.map((method) =>
            balancesLib[method](web3, token, account)
          );

          let results = await Promise.all(methodPromises);
          // console.log(results);
          token.balance = results[0];
          token.stakedBalance = results[1];
          token.rewardsAvailable = results[2];

          pool.ratePerWeek = results[3];

          return token;
        });

        pool.tokens = await Promise.all(tokenPromises);
        return pool;
      });
      // console.log(poolsPromises);
      let poolData = await Promise.all(poolsPromises);
      // console.log(poolData);
      store.setStore({ farmPools: poolData });
      emitter.emit(GET_BALANCES_RETURNED);
    } catch (error) {
      console.log(error);
      return emitter.emit(ERROR, error);
    }
  };

  getBalances = async () => {
    let methods = [
      '_getERC20Balance',
      '_getstakedBalance',
      '_getRewardsAvailable',
      '_getUniswapLiquidity',
      '_getBalancerLiquidity',
      '_getRatePerWeek',
      '_getBonusAvailable',
    ];
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    let nftIds = [];

    const web3 = new Web3(store.getStore('web3context').library.provider);
    // const web3 = new Web3(window.ethereum);

    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if (pool.isSuperHive) {
        console.log(
          'pool.tokens[0].selectedNftId ------',
          pool.tokens[0].selectedNftId
        );
        nftIds = await this.getNFTIds(pool.tokens[0].stakeNFT);
        if (nftIds?.length) {
          if (pool.tokens[0].selectedNftId == -2) {
            pool.tokens[0].selectedNftId = nftIds[0];
          }
          pool.tokens[0].nftIds = nftIds;
        } else {
          pool.tokens[0].selectedNftId = -1;
        }
        console.log(
          'pool.tokens[0].selectedNftId ------',
          pool.tokens[0].selectedNftId
        );
      }
    }

    try {
      let poolsPromises = pools.map(async (pool) => {
        let tokenPromises = pool.tokens.map(async (token) => {
          // console.log(web3, token, account);
          let methodPromises = methods.map((method) =>
            balancesLib[method](web3, token, account)
          );

          let results = await Promise.all(methodPromises);
          // console.log(results);
          token.balance = results[0];
          token.stakedBalance = results[1];
          token.rewardsAvailable = results[2];
          if (pool.id === 'uniswap') {
            pool.liquidityValue = results[3];
          } else if (pool.id === 'balancer') {
            pool.liquidityValue = results[4];
          } else {
            pool.liquidityValue = 0;
          }
          pool.ratePerWeek = results[5];
          pool.beastModeBonus = results[6];

          return token;
        });

        pool.tokens = await Promise.all(tokenPromises);
        return pool;
      });
      // console.log(poolsPromises);
      let poolData = await Promise.all(poolsPromises);
      // console.log(poolData);
      store.setStore({ rewardPools: poolData });
      emitter.emit(GET_BALANCES_RETURNED);
    } catch (error) {
      console.log(error);
      return emitter.emit(ERROR, error);
    }
  };

  getBoostBalancesFarms = async () => {
    const methods = [
      '_getBoosters',
      '_getBoosterCost',
      '_getBoostTokenBalance',
      '_getboostedBalances',
      '_getBoosterPrice',
      '_getNextBoostTime',
      '_getETHPrice',
    ];

    const pools = store.getStore('farmPools');
    const account = store.getStore('account');

    const web3 = new Web3(store.getStore('web3context').library.provider);

    try {
      let poolsPromises = pools.map(async (pool) => {
        let tokenPromises = pool.tokens.map(async (token) => {
          // console.log(web3, token, account);
          let methodPromises = methods.map((method) =>
            balancesLib[method](web3, token, account)
          );

          let results = await Promise.all(methodPromises);

          token.boosters = results[2];
          token.costBooster = results[1][0];
          token.boostBalance = results[2];
          token.costBoosterUSD = results[4] * token.costBooster;
          token.currentActiveBooster = results[0];
          token.currentBoosterStakeValue = results[3];
          token.stakeValueNextBooster = results[1][1];
          token.timeToNextBoost = results[5];
          token.ethPrice = results[6];

          return token;
        });

        pool.tokens = await Promise.all(tokenPromises);
        return pool;
      });
      // console.log(poolsPromises);
      let poolData = await Promise.all(poolsPromises);
      // console.log(poolData);
      store.setStore({ farmPools: poolData });
      emitter.emit(GET_BOOSTEDBALANCES_RETURNED);
    } catch (error) {
      console.log(error);
      return emitter.emit(ERROR, error);
    }
  };

  getBoostBalances = async () => {
    let methods = [
      '_getBoosters',
      '_getBoosterCost',
      '_getBoostTokenBalance',
      '_getboostedBalances',
      '_getBoosterPrice',
      '_getNextBoostTime',
      '_getETHPrice',
    ];
    const pools = store.getStore('rewardPools');
    const account = store.getStore('account');

    // let nftIds = await this.getNFTIds();
    // console.log('nftIds', nftIds);

    const web3 = new Web3(store.getStore('web3context').library.provider);
    // const web3 = new Web3(window.ethereum);

    const currentBlock = await web3.eth.getBlockNumber();
    store.setStore({ currentBlock });

    let nftIds = [];

    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if (pool.isSuperHive) {
        nftIds = await this.getNFTIds(pool.tokens[0].stakeNFT);
        if (nftIds?.length) {
          if (pool.tokens[0].selectedNftId == -2) {
            pool.tokens[0].selectedNftId = nftIds[0];
          }
          pool.tokens[0].nftIds = nftIds;
        } else {
          pool.tokens[0].selectedNftId = -1;
        }
      }
    }

    try {
      let poolsPromises = pools.map(async (pool) => {
        let tokenPromises = pool.tokens.map(async (token) => {
          let methodPromises = methods.map((method) =>
            balancesLib[method](web3, token, account)
          );

          let results = await Promise.all(methodPromises);
          token.boosters = results[2];
          token.costBooster = results[1][0];
          token.boostBalance = results[2];
          token.costBoosterUSD = results[4] * token.costBooster;
          token.currentActiveBooster = results[0];
          token.currentBoosterStakeValue = results[3];
          token.stakeValueNextBooster = results[1][1];
          token.timeToNextBoost = results[5];
          token.ethPrice = results[6];

          return token;
        });

        pool.tokens = await Promise.all(tokenPromises);
        return pool;
      });
      // console.log(poolsPromises);
      let poolData = await Promise.all(poolsPromises);
      // console.log(poolData);
      store.setStore({ rewardPools: poolData });
      emitter.emit(GET_BOOSTEDBALANCES_RETURNED);
    } catch (error) {
      console.log(error);
      return emitter.emit(ERROR, error);
    }
  };

  getPrice = async (assetIn, assetOut) => {
    try {
      if (assetIn.label == assetOut.label) return 0;
      // console.log(assetIn, assetOut);
      // console.log(
      //   'in',
      //   assetIn.label,
      //   assetIn.address,
      //   'out',
      //   assetOut.label,
      //   assetOut.address
      // );

      const account = store.getStore('account');
      if (!store.getStore('web3context')) return 0;
      const web3 = new Web3(store.getStore('web3context').library.provider);
      const assets = store.getStore('exchangeAssets').tokens;

      //const { assetIn, assetOut} = payload.content;
      let route = [];
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
    } catch (error) {
      console.log(error);
    }
  };

  getLpPrice = async (assetOut) => {
    const account = store.getStore('account');

    if (!store.getStore('web3context')) return 0;

    const web3 = new Web3(store.getStore('web3context').library.provider);
    const assets = store.getStore('lpTokens');
    let price;
    // console.log(assetOut);
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
      // console.log(assetOut, test);

      price = (test[test.length - 3] / 100 / 10 ** 6).toFixed(4);
      const priceETH = (test[test.length - 2] / 100 / 10 ** 18).toFixed(4);
      const priceWPE = (test[test.length - 1] / 100 / 10 ** 18).toFixed(4);
      const current = assets.find((i) => i.address == assetOut.address);

      current.price = !Number.isNaN(price) ? price : 0;
      current.priceETH = !Number.isNaN(priceETH) ? priceETH : 0;
      current.priceWPE = !Number.isNaN(priceWPE) ? priceWPE : 0;

      // console.log('price', price, assetOut.label);
      // console.log('priceETH', priceETH, assetOut.label);
      // console.log('priceWPE', priceWPE, assetOut.label);
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
    try {
      // console.log(assetIn, assetOut, amountIn);
      const account = store.getStore('account');
      if (!store.getStore('web3context')) return 0;
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

      if (!dataBack || !dataBack.length) return 0;

      let amountOut = (
        dataBack[dataBack.length - 1] /
        10 ** assetOut.decimals
      ).toFixed(9);
      // console.log('Asset IN ', assetIn.label);
      // console.log('Asset Out ', assetOut.label);
      // console.log('AMOUNT IN ', amountIn);
      // console.log('AMOUNT OUT ', amountOut);

      return amountOut;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getLpAmountOut = async (assetIn, assetOut, amountIn) => {
    // console.log(assetOut);
    const assets = store.getStore('lpTokens');

    var current = assets.find((i) => i.address == assetOut.address);
    // console.log(current);
    const account = store.getStore('account');
    if (!store.getStore('web3context')) return 0;
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let amountOut;
    // console.log(current);
    //LP price
    if (assetIn.label === 'ETH') {
      if (current.label == 'WPE') {
        amountOut = await this._getOutputForWPELP(web3, amountIn, account);
      } else if (current.label == 'WBTC') {
        amountOut = await this._getOutputForWBTCLP(web3, amountIn, account);
      } else if (current.label == 'WPEBPT') {
        amountOut = await this._getOutputForWPEBPT(web3, amountIn, account);
      } else if (current.label == 'YFUBPT') {
        amountOut = await this._getOutputForYFUBPT(web3, amountIn, account);
      } else if (current.label == 'PIXELBPT') {
        amountOut = await this._getOutputForPIXELBPT(web3, amountIn, account);
      } else if (current.label == 'STRBPT') {
        amountOut = await this._getOutputForSTRBPT(web3, amountIn, account);
      } else {
        // console.log(current);
        amountOut = amountIn * (1 / current.priceETH);
      }
    } else if (assetIn.label === 'WPE') {
      amountOut = amountIn * (1 / current.priceWPE);
    } else if (assetIn.label === 'WPE+ETH') {
      amountOut = await this._getOutputForWPEBPTwToken(web3, amountIn, account);
    } else if (assetIn.label === 'YFU+ETH') {
      amountOut = await this._getOutputForYFUBPTwToken(web3, amountIn, account);
    } else if (assetIn.label === 'PIXEL+ETH') {
      amountOut = await this._getOutputForPIXELBPTwToken(
        web3,
        amountIn,
        account
      );
    } else if (assetIn.label === 'STR+ETH') {
      amountOut = await this._getOutputForSTRBPTwToken(web3, amountIn, account);
    } else {
      //stable coin
      amountOut = amountIn * (1 / current.price);
    }

    return amountOut;
  };

  _getOutputForWPEBPTwToken = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.WPEBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[0] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForYFUBPTwToken = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.YFUBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[0] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForPIXELBPTwToken = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.PIXELBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[0] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForSTRBPTwToken = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.STRBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[0] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForWPEBPTwTokenEthVal = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.WPEBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[1] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForYFUBPTwTokenEthVal = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.YFUBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[1] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForSTRBPTwTokenEthVal = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.STRBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[1] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForPIXELBPTwTokenEthVal = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.PIXELBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountForToken(amountToSend)
        .call({ from: account.address });
      console.log(amount);
      return (amount[1] / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForYFUBPT = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.YFUBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountFor(amountToSend) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      // console.log(amount);
      return (amount / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForSTRBPT = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.STRBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountFor(amountToSend) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      // console.log(amount);
      return (amount / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForPIXELBPT = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.PIXELBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountFor(amountToSend) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      // console.log(amount);
      return (amount / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
  };

  _getOutputForWPEBPT = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config.WPEBPTbptAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountFor(amountToSend) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      // console.log(amount);
      return (amount / 10 ** 18).toFixed(4);
    } catch (ex) {
      return ex;
    }
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

  _getOutputForWBTCLP = async (web3, amountIn, account) => {
    let wpeLPExchange = new web3.eth.Contract(
      config.WPElpAddressABI,
      config.WBTClpAddress
    );
    var amountToSend = web3.utils.toWei(amountIn, 'ether');

    try {
      const amount = await wpeLPExchange.methods
        .getAmountFor(amountToSend) //[assetIn.address, assetOut.address])
        .call({ from: account.address });
      // console.log(amount);
      return (amount / 10 ** 18).toFixed(12);
    } catch (ex) {
      return ex;
    }
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
    var amountToSend = web3.utils.toWei(amountIn.toString(), 'ether');
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

      // console.log(contract);
      // console.log(amounts);
      return amounts;
    } catch (ex) {
      // console.log(ex);
      return ex;
    }
  };

  _checkApprovalLiquidityBPT = async (
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

      let contractLPSell = config[assetOut.label + 'bptAddress'];
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

  checkAllowance = async (asset, contract) => {
    try {
      const account = store.getStore('account');
      const web3 = new Web3(store.getStore('web3context').library.provider);
      // console.log(asset);
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.address
      );
      const allowance = await erc20Contract.methods
        .allowance(account.address, contract)
        .call({ from: account.address });

      return allowance;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);
      console.log(asset);
      const erc20Contract = new web3.eth.Contract(
        config.erc20ABI,
        asset.address
      );
      const allowance = await erc20Contract.methods
        .allowance(account.address, contract)
        .call({ from: account.address });

      const ethAllowance = web3.utils.fromWei(allowance, 'ether');
      console.log(allowance);
      console.log(ethAllowance);

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

      if (callback && typeof callback === 'function') {
        callback(null, parseFloat(balance));
      } else {
        return parseFloat(balance);
      }
    } catch (ex) {
      if (callback && typeof callback === 'function') {
        callback(ex);
      } else {
        throw ex;
      }
    }
  };

  // apparently this is not used anywhere
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

  // apparently this is not used anywhere
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

  buyLPWithCombo = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;
    const assets = store.getStore('exchangeAssets').tokens;

    console.log(assetOut);
    var realIn;
    if (assetIn.label == 'WPE+ETH') {
      realIn = assets.find((i) => i.label == 'WPE');
    } else if (assetIn.label == 'YFU+ETH') {
      realIn = assets.find((i) => i.label == 'YFU');
    } else if (assetIn.label == 'PIXEL+ETH') {
      realIn = assets.find((i) => i.label == 'PIXEL');
    } else if (assetIn.label == 'STR+ETH') {
      realIn = assets.find((i) => i.label == 'STR');
    }
    if (
      assetOut.label == 'WPEBPT' ||
      assetOut.label == 'YFUBPT' ||
      assetOut.label == 'PIXELBPT' ||
      assetOut.label == 'STRBPT'
    ) {
      this._checkApprovalLiquidityBPT(
        realIn,
        assetOut,
        account,
        amountIn,
        (err) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          this._buyWPEBPTWithComboCall(
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
      );
    } else {
      // this._buyLPWithEthCall(
      //   assetOut,
      //   account,
      //   amountOut,
      //   amountIn,
      //   (err, res) => {
      //     if (err) {
      //       return emitter.emit(ERROR, err);
      //     }
      //
      //     return emitter.emit(BUY_LP_RETURNED, res); //EXCHANGEETHFORTOKEN_RETURNED
      //   }
      // );
    }
  };

  _buyWPEBPTWithComboCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'bptAddress';
    const coinContract = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config[contract]
    );

    console.log('Amount ', amount);
    console.log('value ', value);
    let multiplier = 1.005;
    const buyAmount = web3.utils.toWei(
      (+amount).toFixed(18).toString(),
      'ether'
    );

    var ethValue = await this._getOutputForWPEBPTwTokenEthVal(
      web3,
      value,
      account
    );
    if (asset.label == 'YFUBPT') {
      ethValue = await this._getOutputForYFUBPTwTokenEthVal(
        web3,
        value,
        account
      );
    } else if (asset.label == 'STRBPT') {
      ethValue = await this._getOutputForSTRBPTwTokenEthVal(
        web3,
        value,
        account
      );
    } else if (asset.label == 'PIXELBPT') {
      ethValue = await this._getOutputForPIXELBPTwTokenEthVal(
        web3,
        value,
        account
      );
    }
    var amountToSend = web3.utils.toWei(value, 'ether');
    // if (assetIn.decimals !== 18) {
    //   amountToSend = (value * 10 ** asset.decimals).toFixed(0);
    // }
    console.log('ETH VALUE ', ethValue);
    console.log(buyAmount);
    console.log(value);
    coinContract.methods
      .createLPWithTokens(amountToSend)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(ethValue) * multiplier).toFixed(18).toString(),
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

  buyLPWithEth = (payload) => {
    const account = store.getStore('account');
    const { assetIn, assetOut, amountIn, amountOut } = payload.content;
    console.log(assetOut);
    if (assetOut.label == 'WPE' || assetOut.label == 'WBTC') {
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
    } else if (
      assetOut.label == 'WPEBPT' ||
      assetOut.label == 'YFUBPT' ||
      assetOut.label == 'PIXELBPT' ||
      assetOut.label == 'STRBPT'
    ) {
      this._buyWPEBPTWithEthCall(
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

  _buyLPWithTokensEthCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'bptAddress';
    const coinContract = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config[contract]
    );

    console.log('Amount ', amount);
    console.log('value ', value);
    let multiplier = 1.005;
    const buyAmount = web3.utils.toWei(
      (+amount).toFixed(18).toString(),
      'ether'
    );
    console.log(buyAmount);
    console.log(value);
    coinContract.methods
      .createLPETHToken()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(value) * multiplier).toFixed(18).toString(),
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

  _buyWPEBPTWithEthCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'bptAddress';
    const coinContract = new web3.eth.Contract(
      config.WPEbptAddressABI,
      config[contract]
    );

    console.log('Amount ', amount);
    console.log('value ', value);
    let multiplier = 1.005;
    const buyAmount = web3.utils.toWei(
      (+amount).toFixed(18).toString(),
      'ether'
    );
    console.log(buyAmount);
    console.log(value);
    coinContract.methods
      .createLPETHToken()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(value) * multiplier).toFixed(18).toString(),
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

  _buyWPELPWithEthCall = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    let contract = asset.label + 'lpAddress';
    const coinContract = new web3.eth.Contract(
      config.WPElpAddressABI,
      config[contract]
    );

    console.log('Amount ', amount);
    console.log('value ', value);
    let multiplier = 1.005;
    const buyAmount = web3.utils.toWei(
      (+amount).toFixed(18).toString(),
      'ether'
    );
    console.log(buyAmount);
    console.log(value);
    coinContract.methods
      .createLPETHToken()
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(value) * multiplier).toFixed(18).toString(),
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

    console.log('Amount ', amount);
    console.log('value ', value);
    let multiplier = 1.005;
    if (asset.label == 'PIXEL') {
      multiplier = 1.01;
    }
    const buyAmount = web3.utils.toWei(
      (+amount).toFixed(18).toString(),
      'ether'
    );

    console.log(buyAmount);
    console.log(value);
    console.log(multiplier);
    coinContract.methods
      .buyLPTokensEth(buyAmount)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(
          (parseFloat(value) * multiplier).toFixed(18).toString(),
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
    const { assetIn } = payload.content;
    if (assetIn.label == 'ETH') {
      //- [ ] BUYLPTOKENSWITHEYTHEREUM
      this.buyLPWithEth(payload);
    } else if (
      assetIn.label == 'WPE+ETH' ||
      assetIn.label == 'YFU+ETH' ||
      assetIn.label == 'PIXEL+ETH' ||
      assetIn.label == 'STR+ETH'
    ) {
      this.buyLPWithCombo(payload);
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
    const { asset, amount, value, beastModesAmount } = payload.content;

    // return
    if (asset.isSuper) {
      this._boostcallStake2NFT(
        asset,
        account,
        beastModesAmount,
        value,
        (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(STAKE_RETURNED, res);
        }
      );
    } else {
      if (asset.hiveId == 'wbtchive' || !asset.isHive) {
        console.log('hiiii', payload.content);
        this._boostcallStake2(
          asset,
          account,
          beastModesAmount,
          value,
          (err, res) => {
            if (err) {
              return emitter.emit(ERROR, err);
            }

            return emitter.emit(STAKE_RETURNED, res);
          }
        );
      } else {
        console.log('not hiiii', payload.content);
        this._boostcallStake(asset, account, amount, value, (err, res) => {
          if (err) {
            return emitter.emit(ERROR, err);
          }

          return emitter.emit(STAKE_RETURNED, res);
        });
      }
    }
  };

  _boostcallStake2NFT = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    boostContract.methods
      .bulkBeastMode(asset.selectedNftId, amount)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(`${value * 1.01}`, 'ether'),
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

  _boostcallStake2 = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    boostContract.methods
      .bulkBeastMode(amount)
      .send({
        from: account.address,
        gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'),
        value: web3.utils.toWei(`${value * 1.01}`, 'ether'),
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

  _boostcallStakeNFT = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const boostContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    boostContract.methods
      .beastMode(asset.selectedNftId)
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
    console.log('stake ============', asset.selectedNftId);
    console.log('stake ============', asset.isSuper);

    this._checkApproval(
      asset,
      account,
      amount,
      asset.rewardsAddress,

      (err) => {
        if (err) {
          return emitter.emit(ERROR, err);
        }

        if (asset.isSuper && asset.selectedNftId >= 0) {
          console.log('stake super ===========', asset.isSuper);

          this._callStakeSuper(asset, account, amount, (err, res) => {
            if (err) {
              return emitter.emit(ERROR, err);
            }
            console.log(res);
            return emitter.emit(STAKE_RETURNED, res);
          });
        } else {
          this._callStake(asset, account, amount, (err, res) => {
            if (err) {
              return emitter.emit(ERROR, err);
            }
            console.log(res);
            return emitter.emit(STAKE_RETURNED, res);
          });
        }
      }
    );
  };

  _callStakeSuper = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    console.log('SUPER ASSSETR CALL STAKE');
    console.log(asset);
    console.log(asset.rewardsABI);
    const yCurveFiContract = new web3.eth.Contract(
      asset.rewardsABI,
      asset.rewardsAddress
    );

    var amountToSend = web3.utils.toWei(amount, 'ether');
    if (asset.decimals !== 18) {
      amountToSend = (amount * 10 ** asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods
      .stakeExistingToken(asset.selectedNftId, amountToSend)
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
  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    console.log('ASSSETR CALL STAKE');
    console.log(asset);
    console.log(asset.rewardsABI);
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

  /**
   *
   * @param {String} user - address
   * @param {Number} amount - uint256
   * @returns
   */
  getBoosterPriceBulk = async (asset, amount) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const account = store.getStore('account');

    // console.log(asset.rewardsAddress, account.address, amount);
    // console.log(asset);

    try {
      const boostContract = new web3.eth.Contract(
        asset.rewardsABI,
        asset.rewardsAddress
      );
      if (asset.isSuper && asset?.selectedNftId < 0) {
        return {
          boosterPrice: 0,
          newBoostBalance: 0,
        };
      }
      let id =
        asset?.selectedNftId >= 0 ? asset.selectedNftId : account.address;
      console.log('id ----', id);
      let results = await boostContract.methods
        .getBoosterPriceBulk(id, +amount)
        .call({ from: account.address });

      // return { boosterPrice: 0.00333 };
      console.log(results);
      return {
        boosterPrice: results.boosterPrice / 10 ** 18,
        newBoostBalance: results.newBoostBalance / 10 ** 18,
      };
    } catch (error) {
      console.log(error);
    }

    // return {
    //   boosterPrice,
    //   newBoostBalance,
    // };
  };

  getTotalSupply = async (asset) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const account = store.getStore('account');

    try {
      const boostContract = new web3.eth.Contract(
        asset.abi,
        asset.rewardsAddress
      );

      // console.log(asset.name, asset.rewardsAddress);

      let results = await boostContract.methods
        .totalSupply()
        .call({ from: account.address });
      return results / 10 ** 18;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Function that returns the total lock volume of a pool.
   * @param {String} lpLabel label of the lpToken which will be used to get price.
   * @param {Token} pool token which will be used to get Total Supply.
   * @returns {Number} value of the total lock volume.
   */
  getTotalLockVolume = async (lpLabel, pool) => {
    const eth = store
      .getStore('exchangeAssets')
      .tokens.find((e) => e.label === 'ETH');
    const ethPrice = await store.getETHPrice();
    const token = store.getStore('lpTokens').find((e) => e.label === lpLabel);

    await store.getLpPrice(token);
    const lpPrice = await store.getLpAmountOut(eth, token, `1`);
    const price = ethPrice / lpPrice;
    if (!price) return 0;
    const supplyToken = store
      .getStore('rewardPools')
      .map((x) => x.tokens)
      .flat()
      .find(
        ({ address, tokenAddress }) =>
          pool.address === address || pool.address === tokenAddress
      );
    const totalSupply = await store.getTotalSupply(supplyToken);
    return totalSupply * price;
  };

  getLockTime = async (address) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const account = store.getStore('account');
    try {
      const contract = new web3.eth.Contract(
        config.seedzABI,
        config.seedzAddress
      );
      let lockTime = await contract.methods
        .lockTime(address)
        .call({ from: account.address });
      console.log(lockTime);
      return lockTime;
      // lockTime siempre son iguales a 0
    } catch (error) {
      console.log(error);
    }
  };

  getETHPrice = async (callback) => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD'
      );
      const res = await response.json();
      return parseFloat(res.ethereum.usd);
    } catch (error) {
      throw error;
    }
  };

  // super hive functions -----------------------------------

  /**
   * @returns return the ids available in your wallet
   */
  walletNftQty = async (nftAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const account = store.getStore('account');
    let ierc721Contract = new web3.eth.Contract(
      config.ierC721ENUMERABLE,
      nftAddress
    );

    try {
      var nftQty = await ierc721Contract.methods
        .balanceOf(account.address)
        .call({ from: account.address });

      console.log(nftQty);
      return nftQty;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * @param {index} index
   * if no index is provided, it will crash.
   */
  tokenOfOwnerByIndex = async (index, nftAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const account = store.getStore('account');
    let ierc721Contract = new web3.eth.Contract(
      config.ierC721ENUMERABLE,
      nftAddress
    );

    try {
      var tokenofowner = await ierc721Contract.methods
        .tokenOfOwnerByIndex(account.address, index)
        .call({ from: account.address });

      console.log('tokenofowner', tokenofowner);
      return tokenofowner;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getNFTIds = async (nftAddress) => {
    var nftIdsResult = [];
    let walletNftQty = await this.walletNftQty(nftAddress);
    // console.log(walletNftQty);
    // 0 | N

    if (!+walletNftQty) return null;
    // console.log(walletNftQty);
    for (var i = 0; i < walletNftQty; i++) {
      nftIdsResult.push(await this.tokenOfOwnerByIndex(i, nftAddress));
    }
    // let nftIdsPromises = new Array(walletNftQty).map((el, i) =>
    //   this.tokenOfOwnerByIndex(i)
    // );
    // nftIdsResult = await Promise.all(nftIdsPromises);
    return nftIdsResult;
    // ['4', '10']
  };
}

var store = new Store();

export default {
  store,
  dispatcher,
  emitter,
};
