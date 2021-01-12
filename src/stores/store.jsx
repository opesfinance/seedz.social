import config from "../config";
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
  BOOST_STAKE
} from '../constants';
import Web3 from 'web3';

import {
  injected,
  walletconnect,
  walletlink,
} from "./connectors";

const rp = require('request-promise');


const Dispatcher = require('flux').Dispatcher;
const Emitter = require('events').EventEmitter;

const dispatcher = new Dispatcher();
const emitter = new Emitter();

class Store {
  constructor() {
    let themeType = localStorage.getItem("themeType")
    console.log("FIRST STORE ", themeType)
    if(themeType === undefined || themeType === null){
      themeType = true
      localStorage.setItem("themeType", true);
    }
    this.store = {
      votingStatus: false,
      governanceContractVersion: 2,
      currentBlock: 0,
      universalGasPrice: '70',
      account: {},
      web3: null,
      valueopen : '',
      activeClass : false,
      themeType : themeType,
      connectorsByName: {
        MetaMask: injected,
        WalletLink: walletlink,
        WalletConnect: walletconnect
      },
      web3context: null,
      languages: [
        {
          language: 'English',
          code: 'en'
        }
      ],
      proposals: [
      ],
      claimableAsset: {
        id: 'wPE',
        name: 'opes.finance',
        address: config.yfiAddress,
        abi: config.yfiABI,
        symbol: 'wPE',
        balance: 0,
        decimals: 18,
        rewardAddress: '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d',
        rewardSymbol: 'aDAI',
        rewardDecimals: 18,
        claimableBalance: 0
      },
      rewardPools: [
        {
          id: 'uniswap',
          name: 'Uniswap Pool (UNI-V2)',
          website: 'Curve.fi/s',
          link: 'https://www.curve.fi/iearn/deposit',
          linkName : "Buy sCrv",
          liquidityLink : "",
          liquidityValue : 0,
          depositsEnabled: false,
          boost: false,
          displayDecimal : 4,
          tokenAddress : '0xC25a3A3b969415c80451098fa907EC722572917F',
          tokenSymbol :'wPE',
          tokens: [
            {
              id: 'ycurvefi',
              address: '0xC25a3A3b969415c80451098fa907EC722572917F',
              symbol: 'wPE',
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.yCurveFiRewardsAddress,
              rewardsABI: config.yCurveFiRewardsABI,
              rewardsSymbol: 'wPE',
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
              rewardsEndDate : {
                year : 2020,
                month : 9,
                day : 10,
                hour : 0,
                minute : 0
              },
              poolRatePerWeek : 'ENDED',
              poolRateSymbol : 'WPE/Week'
            }
          ]
        },{
          id: 'balancer',
          name: 'Balancer Pool (BPT)',
          website: 'Uniswap',
          description : 'Used in the 2nd Pool UI',
          link: 'https://app.uniswap.org/#/add/ETH/0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
          linkName : "Buy Uni-v2",
          liquidityLink : "https://uniswap.info/pair/0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9",
          liquidityValue : 0,
          depositsEnabled: false,
          boost: false,
          displayDecimal : 4,
          tokenAddress : '0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9',
          tokenSymbol :'wPE',
          tokens: [
            {
              id: 'boostrewards',
              address: '0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9',
              symbol: 'wPE',
              abi: config.erc20ABI,
              decimals: 18,
              rewardsAddress: config.boostRewardAddress,
              rewardsABI: config.boostRewardABI,
              rewardsSymbol: 'wPE',
              balance: 0,
              stakedBalance: 0,
              rewardsAvailable: 0,
              boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
              boostTokenSymbol:'UNI',
              boostTokenBalance: 0,
              boostBalance : 0,
              costBooster : 0,
              costBoosterUSD : 0,
              currentActiveBooster : 0,
              currentBoosterStakeValue : 0,
              stakeValueNextBooster : 0,
              timeToNextBoost: 0,
              rewardsEndDate : {
                year : 2020,
                month : 11,
                day : 3,
                hour : 0,
                minute : 0
              },
              poolRatePerWeek : 250,
              poolRateSymbol : 'WPE/Week'
            }
          ]
        }
      ]
    }

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
            this.getClaimableAsset(payload)
            break;
          case CLAIM:
            this.claim(payload)
            break;
          case GET_CLAIMABLE:
            this.getClaimable(payload)
            break;
          
          default: {
          }
        }
      }.bind(this)
    );
  }

  getStore(index) {
    return(this.store[index]);
  };

  setStore(obj) {
    this.store = {...this.store, ...obj}
    // console.log(this.store)
    return emitter.emit('StoreUpdated');
  };

  configure = async () => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    const currentBlock = await web3.eth.getBlockNumber()

    store.setStore({ currentBlock: currentBlock })

    window.setTimeout(() => {
      emitter.emit(CONFIGURE_RETURNED)
    }, 100)
  }

  getBalancesPerpetual = async () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    const currentBlock = await web3.eth.getBlockNumber()
    store.setStore({ currentBlock: currentBlock })

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {

        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRatePerWeek(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            //console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]
          token.ratePerWeek = data[3]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          //console.log(err)
          return callback(err)
        }
        
        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        //console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_PERPETUAL_RETURNED)
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }

  getBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {

      async.map(pool.tokens, (token, callbackInner) => {

        async.parallel([
          (callbackInnerInner) => { this._getERC20Balance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getstakedBalance(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getRewardsAvailable(web3, token, account, callbackInnerInner) },
          (callbackInnerInner) => { this._getUniswapLiquidity(callbackInnerInner) },
          (callbackInnerInner) => { this._getBalancerLiquidity(callbackInnerInner) },
          (callbackInnerInner) => { this._getRatePerWeek(web3, token, account, callbackInnerInner) }
        ], (err, data) => {
          if(err) {
            console.log(err)
            return callbackInner(err)
          }

          token.balance = data[0]
          token.stakedBalance = data[1]
          token.rewardsAvailable = data[2]
          if(pool.id ==='uniswap'){
            pool.liquidityValue = data[3]
          }else if(pool.id === 'balancer'){
            pool.liquidityValue = data[4]
          }else{
            pool.liquidityValue = 0
          }
          pool.ratePerWeek = data[5]

          callbackInner(null, token)
        })
      }, (err, tokensData) => {
        if(err) {
          console.log(err)
          return callback(err)
        }

        pool.tokens = tokensData
        callback(null, pool)
      })

    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BALANCES_RETURNED)
    })
  }


  getBoostBalances = () => {
    const pools = store.getStore('rewardPools')
    const account = store.getStore('account')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.map(pools, (pool, callback) => {
      if(pool.boost === true){
        async.map(pool.tokens, (token, callbackInner) => {

          async.parallel([
            (callbackInnerInner) => { this._getBoosters(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getBoosterCost(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getBoostTokenBalance(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getboostedBalances(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getBoosterPrice(callbackInnerInner) },
            (callbackInnerInner) => { this._getNextBoostTime(web3, token, account, callbackInnerInner) },
            (callbackInnerInner) => { this._getETHPrice(callbackInnerInner) },
            //(callbackInnerInner) => { this._getBoostBalanceAvailable(web3, token, account, callbackInnerInner) }
          ], (err, data) => {
            if(err) {
              console.log(err)
              return callbackInner(err)
            }

            token.boosters = data[2]
            token.costBooster = data[1][0]

            console.log(data)

            console.log("DATA" + data )
            //token.boostBalance = data[0]

            token.boostBalance = data[2]
            //token.costBooster = 11
            token.costBoosterUSD = data[4]*data[1][0]
            token.currentActiveBooster = data[0]
            token.currentBoosterStakeValue = data[3]
            token.stakeValueNextBooster = data[1][1]
            token.timeToNextBoost = data[5]
            token.ethPrice = data[6]

            callbackInner(null, token)
          })
        }, (err, tokensData) => {
          if(err) {
            console.log(err)
            return callback(err)
          }

          pool.tokens = tokensData
          callback(null, pool)
        })
      }
    }, (err, poolData) => {
      if(err) {
        console.log(err)
        return emitter.emit(ERROR, err)
      }
      store.setStore({rewardPools: poolData})
      emitter.emit(GET_BOOSTEDBALANCES_RETURNED)
    })
  }


  _getUniswapLiquidity = async(callback)=>{
    try{
      var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var graphql = JSON.stringify({
            query: "{\n pair(id: \"0x75f89ffbe5c25161cbc7e97c988c9f391eaefaf9\"){\n     reserveUSD\n}\n}",
            variables: {}
          })
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: graphql,
            redirect: 'follow'
          };

      const response = await fetch("https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2", requestOptions)
      const myJson = await response.json();
      console.log(myJson.data.pair.reserveUSD)
      callback(null, parseFloat(myJson.data.pair.reserveUSD).toFixed(2))
    }catch(e){
      return callback(e)
    }
  }

  _getBalancerLiquidity = async(callback)=>{
    try{
      var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          var graphql = JSON.stringify({
            query: "{\n pool(id: \"0x5b2dc8c02728e8fb6aea03a622c3849875a48801\"){\n     liquidity\n}\n}",
            variables: {}
          })
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: graphql,
            redirect: 'follow'
          };

      const response = await fetch("https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-beta", requestOptions)
      const myJson = await response.json();
      console.log(myJson.data.pool.liquidity)
      callback(null, parseFloat(myJson.data.pool.liquidity).toFixed(2))
    }catch(e){
      return callback(e)
    }
  }

  _getETHPrice = async (callback) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD');
      const myJson = await response.json();
      var balance = parseFloat(myJson.ethereum.usd)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getBoosterPrice = async (callback) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD');
      const myJson = await response.json();
      console.log(myJson.ethereum.usd)
      var balance = parseFloat(myJson.ethereum.usd)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }
  _getBoosters = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await boostContract.methods.numBoostersBought(account.address).call({ from: account.address });
      balance = parseFloat(balance)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }
  _getBoosterCost = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await boostContract.methods.getBoosterPrice(account.address).call({ from: account.address });
      console.log(balance)
      console.log(balance[0])
      console.log(balance[1])

      var boostInfo = [parseFloat(balance[0])/10**asset.decimals, parseFloat(balance[1])/10**asset.decimals]
      callback(null, boostInfo)
    } catch(ex) {
      return callback(ex)
    }
  }
  _getboostedBalances = async (web3, asset, account, callback) => {
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var balance = await boostContract.methods.boostedBalances(account.address).call({ from: account.address });
      console.log(balance)

      var boostInfo = parseFloat(balance)/10**asset.decimals
      callback(null, boostInfo)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getBoostTokenBalance = async (web3, asset, account, callback) => {

    try {
      var balance = await web3.eth.getBalance(account.address);

      var boostInfo = parseFloat(balance)/10**asset.decimals
      callback(null, boostInfo)
    } catch(ex) {
      return callback(ex)
    }
  }

  _getNextBoostTime = async (web3, asset, account, callback) => {
	    let boostTokenContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
	    console.log(">>>>>>> NEXT BOOST TIME")
	    try {
	      var time = await boostTokenContract.methods.nextBoostPurchaseTime(account.address).call({ from: account.address });
	      console.log(time)
	      console.log(new Date().getTime()/1000)
	      var boostInfo = parseInt(time)
	      callback(null, boostInfo)
	
	    } catch(ex) {
	      return callback(ex)
	    }
	  }



  _checkApproval = async (asset, account, amount, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(asset.abi, asset.address)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")

      if(parseFloat(ethAllowance) < parseFloat(amount)) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _checkApprovalWaitForConfirmation = async (asset, account, amount, contract, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")

    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        .on('transactionHash', function(hash){
          callback()
        })
        .on('error', function(error) {
          if (!error.toString().includes("-32601")) {
            if(error.message) {
              return callback(error.message)
            }
            callback(error)
          }
        })
    } else {
      callback()
    }
  }

  _getRatePerWeek = async (web3, asset, account, callback) => {
    let contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var rate = await contract.methods.currentReward().call({ from: account.address });
      rate = parseFloat(rate)/10**asset.decimals
      callback(null, rate)
    } catch(ex) {
      return callback(null,ex)
    }
  }

  _getERC20Balance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getstakedBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }


  _getBoostBalanceAvailable = async (web3, asset, account, callback) => {
    let boostTokenContract = new web3.eth.Contract(config.erc20ABI, config.boostTokenAddress)
    let boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)
    console.log("++++++++++"+asset+"+++++++++++");
    try {
      var boosters = await boostContract.methods.numBoostersBought(account.address).call({ from: account.address });//await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      var balance = parseFloat(balance)/10**asset.decimals

      asset.boostBalance = await boostTokenContract.methods.balanceOf(account.address).call({ from: account.address });

      var boostedPriceFuture = await boostContract.methods.getBoosterPrice(account.address).call({ from: account.address });
      console.log(">>>>>>>"+boostedPriceFuture)

      asset.costBooster = boostedPriceFuture[0]/10**asset.decimals
      asset.costBoosterUSD = 0
      asset.currentActiveBooster = boosters
      asset.currentBoosterStakeValue = 0
      asset.stakeValueNextBooster = boostedPriceFuture[1]/10**asset.decimals
      console.log(">>>>>>>"+balance)
      console.log(">>>>>>>"+boostedPriceFuture)
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getRewardsAvailable = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    try {
      var earned = await erc20Contract.methods.earned(account.address).call({ from: account.address });
      earned = parseFloat(earned)/10**asset.decimals
      callback(null, parseFloat(earned))
    } catch(ex) {
      return callback(ex)
    }
  }

  _checkIfApprovalIsNeeded = async (asset, account, amount, contract, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

    const ethAllowance = web3.utils.fromWei(allowance, "ether")
    if(parseFloat(ethAllowance) < parseFloat(amount)) {
      asset.amount = amount
      callback(null, asset)
    } else {
      callback(null, false)
    }
  }

  _callApproval = async (asset, account, amount, contract, last, callback, overwriteAddress) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);
    let erc20Contract = new web3.eth.Contract(config.erc20ABI, (overwriteAddress ? overwriteAddress : asset.address))
    try {
      if(last) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        erc20Contract.methods.approve(contract, web3.utils.toWei("999999999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
          .on('transactionHash', function(hash){
            callback()
          })
          .on('error', function(error) {
            if (!error.toString().includes("-32601")) {
              if(error.message) {
                return callback(error.message)
              }
              callback(error)
            }
          })
      }
    } catch(error) {
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }




  /**
 * -------------------------
 * START STAKE ON BOOST
 * ----------------------------
 */
  boostStake = (payload)=>{
    console.log("BOOOST!!!")
    const account = store.getStore('account')
    const { asset, amount, value } = payload.content

      this._boostcallStake(asset, account, amount, value, (err, res) => {  
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })

  };
  _boostcheckApproval = async (asset, account, contract, callback) => {
    try {
      const web3 = new Web3(store.getStore('web3context').library.provider);

      const erc20Contract = new web3.eth.Contract(config.erc20ABI, asset.boostTokenAddress)
      const allowance = await erc20Contract.methods.allowance(account.address, contract).call({ from: account.address })

      const ethAllowance = web3.utils.fromWei(allowance, "ether")
  
      if(parseFloat(ethAllowance) < parseFloat("999999999")) {
        await erc20Contract.methods.approve(contract, web3.utils.toWei("9999999999", "ether")).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
        callback()
      } else {
        callback()
      }
    } catch(error) {
      console.log(error)
      if(error.message) {
        return callback(error.message)
      }
      callback(error)
    }
  }

  _boostcallStake = async (asset, account, amount, value, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const boostContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    boostContract.methods.beastMode().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei'), value: web3.utils.toWei(value, 'ether') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

/**
 * -------------------------
 * END STAKE ON BOOST
 * ----------------------------
 */
  stake = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._checkApproval(asset, account, amount, asset.rewardsAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callStake(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(STAKE_RETURNED, res)
      })
    })
  }

  _callStake = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.stake(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  withdraw = (payload) => {
    const account = store.getStore('account')
    const { asset, amount } = payload.content

    this._callWithdraw(asset, account, amount, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(WITHDRAW_RETURNED, res)
    })
  }

  _callWithdraw = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    yCurveFiContract.methods.withdraw(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getReward = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callGetReward(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(GET_REWARDS_RETURNED, res)
    })
  }

  _callGetReward = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.getReward().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  exit = (payload) => {
    const account = store.getStore('account')
    const { asset } = payload.content

    this._callExit(asset, account, (err, res) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      return emitter.emit(EXIT_RETURNED, res)
    })
  }

  _callExit = async (asset, account, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const yCurveFiContract = new web3.eth.Contract(asset.rewardsABI, asset.rewardsAddress)

    yCurveFiContract.methods.exit().send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_BALANCES, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }



  

  getClaimableAsset = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_ASSET_RETURNED)
    })
  }

  _getClaimableBalance = async (web3, asset, account, callback) => {
    let erc20Contract = new web3.eth.Contract(asset.abi, asset.address)

    try {
      var balance = await erc20Contract.methods.balanceOf(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  _getClaimable = async (web3, asset, account, callback) => {
    let claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    try {
      var balance = await claimContract.methods.claimable(account.address).call({ from: account.address });
      balance = parseFloat(balance)/10**asset.decimals
      callback(null, parseFloat(balance))
    } catch(ex) {
      return callback(ex)
    }
  }

  claim = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')
    const { amount } = payload.content

    this._checkApproval(asset, account, amount, config.claimAddress, (err) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      this._callClaim(asset, account, amount, (err, res) => {
        if(err) {
          return emitter.emit(ERROR, err);
        }

        return emitter.emit(CLAIM_RETURNED, res)
      })
    })
  }

  _callClaim = async (asset, account, amount, callback) => {
    const web3 = new Web3(store.getStore('web3context').library.provider);

    const claimContract = new web3.eth.Contract(config.claimABI, config.claimAddress)

    var amountToSend = web3.utils.toWei(amount, "ether")
    if (asset.decimals !== 18) {
      amountToSend = (amount*10**asset.decimals).toFixed(0);
    }

    claimContract.methods.claim(amountToSend).send({ from: account.address, gasPrice: web3.utils.toWei(await this._getGasPrice(), 'gwei') })
      .on('transactionHash', function(hash){
        console.log(hash)
        callback(null, hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber, receipt);
        if(confirmationNumber === 2) {
          dispatcher.dispatch({ type: GET_CLAIMABLE_ASSET, content: {} })
        }
      })
      .on('receipt', function(receipt){
        console.log(receipt);
      })
      .on('error', function(error) {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
      .catch((error) => {
        if (!error.toString().includes("-32601")) {
          if(error.message) {
            return callback(error.message)
          }
          callback(error)
        }
      })
  }

  getClaimable = (payload) => {
    const account = store.getStore('account')
    const asset = store.getStore('claimableAsset')

    const web3 = new Web3(store.getStore('web3context').library.provider);

    async.parallel([
      (callbackInnerInner) => { this._getClaimableBalance(web3, asset, account, callbackInnerInner) },
      (callbackInnerInner) => { this._getClaimable(web3, asset, account, callbackInnerInner) },
    ], (err, data) => {
      if(err) {
        return emitter.emit(ERROR, err);
      }

      asset.balance = data[0]
      asset.claimableBalance = data[1]

      store.setStore({claimableAsset: asset})
      emitter.emit(GET_CLAIMABLE_RETURNED)
    })
  }

  

  

  _getGasPrice = async () => {
    try {
      const url = 'https://gasprice.poa.network/'
      const priceString = await rp(url);
      const priceJSON = JSON.parse(priceString)
      if(priceJSON) {
        return priceJSON.fast.toFixed(0)
      }
      return store.getStore('universalGasPrice')
    } catch(e) {
      console.log(e)
      return store.getStore('universalGasPrice')
    }
  }
}

var store = new Store();

export default {
  store: store,
  dispatcher: dispatcher,
  emitter: emitter
};
