import config from '../config';
import { injected, walletconnect, walletlink } from './connectors';
const themeType = localStorage.getItem('themeType');

const STORE_INIT_CONSTANTS = {
  startBeastReductionTimestamp: 1615082400,
  votingStatus: false,
  governanceContractVersion: 2,
  currentBlock: 0,
  universalGasPrice: '70',
  account: {},
  web3: null,
  valueopen: '',
  activeClass: false,
  themeType: themeType,
  connectorsByName: {
    MetaMask: injected,
    WalletLink: walletlink,
    WalletConnect: walletconnect,
  },
  web3context: null,
  languages: [
    {
      language: 'English',
      code: 'en',
    },
  ],
  proposals: [],
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
    claimableBalance: 0,
  },
  rewardPools: [
    {
      id: 'seedzindex',
      name: 'Seedz Balancer Pool',
      website: 'Balancer',
      description: 'Used in the 2nd Pool UI',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WPE',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'Seedz Balancer Pool',
          address: '0x5B2dC8c02728e8FB6aeA03a622c3849875A48801',
          symbol: 'BPT',
          disableStake: true,
          liquidityLink:
            'https://pools.balancer.exchange/#/pool/0x5B2dC8c02728e8FB6aeA03a622c3849875A48801',
          abi: config.erc20ABI,
          beastBonus: 2000,
          bonusReductionIn: '0 hours',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.seedzAddress,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
    },
    {
      id: 'seedzuni',
      name: 'Seedz UNI-LP Pool',
      website: 'Uniswap',
      description: 'Used in the 2nd Pool UI',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WPE',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'Seedz UNI-LP Pool',
          address: '0x75f89ffbe5c25161cbc7e97c988c9f391eaefaf9',
          symbol: 'UNI-v2',
          disableStake: true,
          liquidityLink:
            'https://uniswap.info/pair/0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9',
          abi: config.erc20ABI,
          beastBonus: 2000,
          bonusReductionIn: '0 hours',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.seedzAddressTwo,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
    },
    {
      id: 'pixelhive',
      name: 'iUPixel',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy iUPixel',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'iUPixel/WPE POOL',
          address: '0x469485cA145D850c0e54367076558dC72b5DCe19',
          symbol: 'PIXEL-LP',
          liquidityLink:
            'https://uniswap.info/pair/0x469485cA145D850c0e54367076558dC72b5DCe19',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.pixelHiveAddress,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
      socialLinks: {
        website: 'https://iupixel.com',
        twitter: 'https://twitter.com/iu_pixel',
        telegram: 'https://t.me/iupixel',
        discord: 'https://discord.com/invite/pTEaVBE',
        medium: 'https://iupixel.medium.com/',
      },
    },
    {
      id: 'yfuhive',
      name: 'YFU',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy YFU',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'YFU/WPE POOL',
          address: '0x8dc082087ee75b528dfd4e68fa28966666de1a60',
          symbol: 'YFU-LP',
          liquidityLink:
            'https://uniswap.info/pair/0x8dc082087ee75b528dfd4e68fa28966666de1a60',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.yfuHiveAddress,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
      socialLinks: {
        website: 'https://yfu.finance',
        twitter: 'https://twitter.com/YFuFinance',
        telegram: 'https://t.me/joinchat/RfldRBfhzHSSLchXsCwLhA',
        discord: 'https://discord.com/invite/RGt5Ukw',
        medium: 'https://yfu-finance.medium.com',
      },
    },
    {
      id: 'lifthive',
      name: 'Missions Fund',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy LIFT',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'Missions Fund/WPE POOL',
          address: '0xEcEa1bAe3Bb692510693FAc2932C32BeB1FA866E',
          symbol: 'LIFT-LP',
          liquidityLink:
            'https://uniswap.info/pair/0xEcEa1bAe3Bb692510693FAc2932C32BeB1FA866E',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.liftHiveAddress,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
      socialLinks: {
        website: 'https://missions.fund',
        twitter: 'https://twitter.com/Crypto_Swarm',
      },
    },
    {
      id: 'strhive',
      name: 'Starwire',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy STR',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'Starwire/WPE POOL',
          address: '0x8eAA970BE66D4DE446453AEA538173382C2CACE8',
          symbol: 'STR-LP',
          liquidityLink:
            'https://uniswap.info/pair/0x8eAA970BE66D4DE446453AEA538173382C2CACE8',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.strHiveAddress,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
      socialLinks: {
        website: 'https://starwire.io',
        telegram: 'https://t.me/starwireio',
        twitter: 'https://twitter.com/starwireio',
        discord: 'https://discord.com/invite/FGDawFeUNk',
        youtube:
          'https://www.youtube.com/channel/UC9IWPP_ePC5QnJHql0F_sOA?view_as=subscriber',
      },
    },
    {
      id: 'wpehive',
      name: 'WPE LP 2',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WPE',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'WPE-LP',
          address: '0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9',
          symbol: 'UNI-v2',
          liquidityLink:
            'https://app.uniswap.org/#/add/ETH/0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.wpeHiveAddress,
          rewardsABI: config.seedzABI,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
    },
    {
      id: 'wbtchive',
      name: 'Crypto Club Pool',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WBTC',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'Crypto Club Pool',
          address: '0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
          symbol: 'UNI-v2',
          liquidityLink:
            'https://app.uniswap.org/#/add/ETH/0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.wbtcHiveAddress,
          rewardsABI: config.wbtcBoostAbi,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
        },
      ],
      isSuperHive: false,
      isNormalHive: true,
    },
    {
      id: 'wpeshive',
      name: 'Crypto Club Pool',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WBTC',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'WPE ETH Super Hive',
          address: '0xE24281bc68C2a56e19B67b3787Fd5e95937bd970',
          symbol: 'UNI-v2',
          liquidityLink:
            'https://app.uniswap.org/#/add/ETH/0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
          abi: config.erc20ABI,
          beastBonus: 1000,
          bonusReductionIn: '7 days',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.wpeSuperHiveAddress,
          rewardsABI: config.superHiveAbi,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
          isSuper: true,
          stakeNFT: '0xD8F16fc27901f77d58A41101B096b47b30C052d2',
          nftIds: [],
        },
      ],
      isSuperHive: true,
      isNormalHive: true,
    },
    {
      id: 'yfushive',
      name: 'YFU SUPER HIVE',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WBTC',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'YFU ETH Super Hive',
          address: '0x9f2b223da9f3911698c9b90ecdf3ffee37dd54a8',
          symbol: 'YFU-BPT',
          liquidityLink:
            'https://app.uniswap.org/#/add/ETH/0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
          abi: config.erc20ABI,
          beastBonus: 0,
          bonusReductionIn: '',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.yfuSuperHiveAddress,
          rewardsABI: config.superHiveAbi,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
          isSuper: true,
          stakeNFT: '0x326574d7Ea8E5d84d2161b579D37F998532Fa2Ed',
          nftIds: [],
        },
      ],
      isSuperHive: true,
      isNormalHive: true,
    },
    {
      id: 'pixelshive',
      name: 'PIXEL SUPER Pool',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WBTC',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'PIXEL ETH Super Hive',
          address: '0x60B4601cDdDc4467f31b1F770cb93c51dC7dC728',
          symbol: 'PIXEL-BPT',
          liquidityLink:
            'https://app.uniswap.org/#/add/ETH/0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
          abi: config.erc20ABI,
          beastBonus: 0,
          bonusReductionIn: '',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.pixelSuperHiveAddress,
          rewardsABI: config.superHiveAbi,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
          isSuper: true,
          stakeNFT: '0xe5335507c6079Aef657d4B7bFE3A467d19fd0D31',
          nftIds: [],
        },
      ],
      isSuperHive: true,
      isNormalHive: true,
    },
    {
      id: 'strshive',
      name: 'STR Club Pool',
      website: 'Uniswap',
      description: '',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      linkName: 'Buy WBTC',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      displayDecimal: 4,
      tokens: [
        {
          id: 'boostrewards',
          name: 'STR ETH Super Hive',
          address: '0x8e9690E135005E415BD050B11768615DE43fe5f8',
          symbol: 'STR-BPT',
          liquidityLink:
            'https://app.uniswap.org/#/add/ETH/0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
          abi: config.erc20ABI,
          beastBonus: 0,
          bonusReductionIn: '',
          decimals: 18,
          tokenAddress: '0x3269244011893f957a3b82c55437083430BDac02',
          tokenSymbol: 'Seedz',
          rewardsAddress: config.strSuperHiveAddress,
          rewardsABI: config.superHiveAbi,
          rewardsSymbol: 'Seedz',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
          selectedNftId: -2,
          isSuper: true,
          stakeNFT: '0x0E919cdB0f14db270E3AE1966E0F3Fb04B0c46d2',
          nftIds: [],
        },
      ],
      isSuperHive: true,
      isNormalHive: true,
    },
  ],
  farmPools: [
    {
      id: 'farmpixel',
      poolAddress: config.farmpixel,
      symbol: 'PIXEL',
      stakedSymbol: 'Seedz',
      address: '0x3269244011893f957a3b82c55437083430BDac02',
      name: 'iUPixel',
      website: '',
      description: '',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      apy: 0,
      timeLeft: '',
      weeklyRewards: 0,
      myBeastModes: 0,
      myRewards: 0,
      decimals: 18,
      rewardsAddress: config.farmpixel, //config.farmsRewardAddress,
      rewardsABI: config.farmsRewardsAbi,
      tokens: [
        {
          id: 'farmpixel',
          address: '0x3269244011893f957a3b82c55437083430BDac02', // este es el LP token
          symbol: 'Seedz',
          stakedSymbolLogo: 'SEEDZ',
          imageLogo: 'PIXEL',
          name: 'iUPixel',
          abi: config.erc20ABI,
          decimals: 18,
          tokenAddress: '0x89045d0af6a12782ec6f701ee6698beaf17d0ea2', //PIXEL
          tokenSymbol: 'PIXEL',
          rewardsAddress: config.farmpixel, //config.farmsRewardAddress,
          rewardsABI: config.farmsRewardsAbi,
          rewardsSymbol: 'PIXEL',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
        },
      ],
    },
    {
      id: 'farmyfu',
      poolAddress: config.farmyfu,
      symbol: 'YFU',
      stakedSymbol: 'Seedz',
      address: '0x3269244011893f957a3b82c55437083430BDac02',
      name: 'YFU',
      website: '',
      description: '',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      apy: 0,
      timeLeft: '',
      weeklyRewards: 0,
      myBeastModes: 0,
      myRewards: 0,
      decimals: 18,
      rewardsAddress: config.farmyfu, //config.farmsRewardAddress,
      rewardsABI: config.farmsRewardsAbi,
      tokens: [
        {
          id: 'farmyfu',
          address: '0x3269244011893f957a3b82c55437083430BDac02', // este es el LP token
          name: 'YFU',
          symbol: 'Seedz',
          stakedSymbolLogo: 'SEEDZ',
          imageLogo: 'YFU',
          abi: config.erc20ABI,
          decimals: 18,
          tokenAddress: '0xa279dab6ec190eE4Efce7Da72896EB58AD533262', //YFU
          tokenSymbol: 'YFU',
          rewardsAddress: config.farmyfu, //config.farmsRewardAddress,
          rewardsABI: config.farmsRewardsAbi,
          rewardsSymbol: 'YFU',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
        },
      ],
    },
    {
      id: 'farmstr',
      poolAddress: config.farmstr,
      symbol: 'STR',
      stakedSymbol: 'Seedz',
      address: '0x3269244011893f957a3b82c55437083430BDac02',
      name: 'Starwire',
      website: '',
      description: '',
      liquidityValue: 0,
      depositsEnabled: true,
      boost: true,
      apy: 0,
      timeLeft: '',
      weeklyRewards: 0,
      myBeastModes: 0,
      myRewards: 0,
      decimals: 18,
      rewardsAddress: config.farmstr, //config.farmsRewardAddress,
      rewardsABI: config.farmsRewardsAbi,
      tokens: [
        {
          id: 'farmstr',
          address: '0x3269244011893f957a3b82c55437083430BDac02', // este es el LP token
          name: 'Starwire',
          symbol: 'Seedz',
          stakedSymbolLogo: 'SEEDZ',
          imageLogo: 'STR',
          abi: config.erc20ABI,
          decimals: 18,
          tokenAddress: '0x11c1a6b3ed6bb362954b29d3183cfa97a0c806aa', //STR
          tokenSymbol: 'STR',
          rewardsAddress: config.farmstr, //config.farmsRewardAddress,
          rewardsABI: config.farmsRewardsAbi,
          rewardsSymbol: 'STR',
          balance: 0,
          stakedBalance: 0,
          rewardsAvailable: 0,
          ratePerWeek: 0,
          beastModeBonus: 0,
          boostTokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          boostTokenSymbol: 'ETH',
          boostTokenBalance: 0,
          boostBalance: 0,
          costBooster: 0,
          costBoosterUSD: 0,
          currentActiveBooster: 0,
          currentBoosterStakeValue: 0,
          stakeValueNextBooster: 0,
          timeToNextBoost: 0,
          ethPrice: 0,
          poolRateSymbol: 'Seedz/Week',
        },
      ],
    },
  ],
  exchangeAssets: {
    tokens: [
      {
        label: 'USDC',
        logo: 'USD_Coin_icon.webp',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
        group: 'inputs',
        box: 'false',
        availableViews: ['exchange'],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'DAI',
        logo: 'dai-multi-collateral-mcd.webp',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        decimals: 18,
        group: 'inputs',
        box: 'false',
        availableViews: ['exchange'],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'USDT',
        logo: 'tether_32.webp',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimals: 6,
        group: 'inputs',
        box: 'false',
        availableViews: ['exchange'],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'WPE+ETH',
        logo: 'WPE.png',
        address: 'WPE+ETH',
        decimals: 18,
        group: 'inputs',
        box: 'false',
        availableViews: [],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'STR+ETH',
        logo: 'WPE.png',
        address: 'STR+ETH',
        decimals: 18,
        group: 'inputs',
        box: 'false',
        availableViews: ['pools'],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'YFU+ETH',
        logo: 'WPE.png',
        address: 'YFU+ETH',
        decimals: 18,
        group: 'inputs',
        box: 'false',
        availableViews: ['pools'],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'PIXEL+ETH',
        logo: 'WPE.png',
        address: 'PUXEL+ETH',
        decimals: 18,
        group: 'inputs',
        box: 'false',
        availableViews: ['pools'],
        denomination: 'USD',
        price: 1.0,
      },
      {
        label: 'STR',
        labelLP: 'STR/WPE LP',
        logo: 'STR.png',
        address: '0x11C1a6B3Ed6Bb362954b29d3183cfA97A0c806Aa',
        liquidityPoolAddress: '0x8eAA970BE66D4DE446453AEA538173382C2CACE8',
        decimals: 18,
        group: 'outputs',
        box: 'true',
        availableViews: ['exchange'],
        denomination: 'WPE',
        price: 0.0,
        tradingViewKey: 'UNISWAP:STRWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT',
        route: [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
        ],
      },
      {
        label: 'PIXEL',
        labelLP: 'PIXEL/WPE LP',
        logo: 'PIXEL.png',
        address: '0x89045d0Af6A12782Ec6f701eE6698bEaF17d0eA2',
        liquidityPoolAddress: '0x469485cA145D850c0e54367076558dC72b5DCe19',
        decimals: 18,
        group: 'outputs',
        box: 'true',
        availableViews: ['exchange'],
        denomination: 'WPE',
        price: 0.0,
        tradingViewKey: 'UNISWAP:PIXELWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT',
        route: [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
        ],
      },
      {
        label: 'LIFT',
        labelLP: 'LIFT/WPE LP',
        logo: 'LIFT.png',
        address: '0x47bd5114c12421FBC8B15711cE834AFDedea05D9',
        liquidityPoolAddress: '0xEcEa1bAe3Bb692510693FAc2932C32BeB1FA866E',
        decimals: 18,
        group: 'outputs',
        box: 'true',
        availableViews: ['exchange'],
        denomination: 'WPE',
        price: 0.0,
        tradingViewKey: 'UNISWAP:LIFTWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT',
        route: [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
        ],
      },
      {
        label: 'YFU',
        labelLP: 'YFU/WPE LP',
        logo: 'YFU.png',
        address: '0xa279dab6ec190eE4Efce7Da72896EB58AD533262',
        liquidityPoolAddress: '0x8dc082087ee75b528dfd4e68fa28966666de1a60',
        decimals: 18,
        group: 'outputs',
        box: 'true',
        availableViews: ['exchange'],
        denomination: 'WPE',
        price: 0.0,
        tradingViewKey: 'UNISWAP:YFUWPE/UNISWAP:WETHWPE*BINANCE:ETHUSDT',
        route: [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
        ],
      },
      {
        label: 'M2',
        labelLP: 'M2/WPE LP',
        logo: 'M2.png',
        address: '0x965d79F1A1016B574a62986e13Ca8Ab04DfdD15C',
        liquidityPoolAddress: '0x9816f26f43c4c02df0daae1a0ba6a4dcd30b8ab7',
        decimals: 18,
        group: 'outputs',
        box: 'true',
        availableViews: ['exchange'],
        denomination: 'WPE',
        price: 0.0,
        tradingViewKey: 'UNISWAP:M2WPE/UNISWAP:WETHWPE*BINANCE:ETHUSD',
        route: [
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
        ],
      },
      {
        label: 'ETH',
        logo: 'logo-eth.png',
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        decimals: 18,
        group: 'inputs',
        box: 'false',
        availableViews: ['exchange', 'pools'],
        denomination: 'USD',
        price: 1829.0,
      },
      {
        label: 'WPE',
        labelLP: 'WPE/ETH LP',
        logo: 'WPE.png',
        address: '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
        liquidityPoolAddress: '0x75F89FfbE5C25161cBC7e97c988c9F391EaeFAF9',
        decimals: 18,
        group: 'outputs',
        box: 'false',
        availableViews: [],
        onlyPurchaseableWith: ['ETH'],
        denomination: 'ETH',
        price: 2.067,
        route: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      },
      {
        label: 'WBTC',
        labelLP: 'WPE/WBTC LP',
        logo: 'WBTC.png',
        address: '0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
        liquidityPoolAddress: '0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
        decimals: 18,
        group: 'outputs',
        box: 'false',
        availableViews: [],
        onlyPurchaseableWith: ['ETH'],
        denomination: 'ETH',
        price: 2.067,
        route: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      },
      {
        label: 'WPEBPT',
        labelLP: 'WPE/ETH BPT ',
        logo: 'BPT.png',
        address: '0x98a498D8e7ce64A873d5029a34F37FdAa3F6F799',
        liquidityPoolAddress: '0xE24281bc68C2a56e19B67b3787Fd5e95937bd970',
        decimals: 18,
        group: 'outputs',
        box: 'false',
        availableViews: [],
        onlyPurchaseableWith: ['ETH', 'WPE+ETH'],
        denomination: 'ETH',
        price: 2.067,
        route: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      },
      {
        label: 'YFUBPT',
        labelLP: 'YFU/ETH BPT ',
        logo: 'BPT.png',
        address: '0x9f2b223da9f3911698c9b90ecdf3ffee37dd54a8',
        liquidityPoolAddress: '0x9f2b223da9f3911698c9b90ecdf3ffee37dd54a8',
        decimals: 18,
        group: 'outputs',
        box: 'false',
        availableViews: ['pools'],
        onlyPurchaseableWith: ['ETH', 'YFU+ETH'],
        denomination: 'ETH',
        price: 2.067,
        route: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      },
      {
        label: 'PIXELBPT',
        labelLP: 'PIXEL/ETH BPT ',
        logo: 'BPT.png',
        address: '0x69dD1ef819Afde481d81E6C1C1Bb91CabCFe780f',
        liquidityPoolAddress: '0x60B4601cDdDc4467f31b1F770cb93c51dC7dC728',
        decimals: 18,
        group: 'outputs',
        box: 'false',
        availableViews: ['pools'],
        onlyPurchaseableWith: ['ETH', 'PIXEL+ETH'],
        denomination: 'ETH',
        price: 2.067,
        route: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      },
      {
        label: 'STRBPT',
        labelLP: 'STR/ETH BPT ',
        logo: 'BPT.png',
        address: '0x8e9690E135005E415BD050B11768615DE43fe5f8',
        liquidityPoolAddress: '0x8e9690E135005E415BD050B11768615DE43fe5f8',
        decimals: 18,
        group: 'outputs',
        box: 'false',
        availableViews: ['pools'],
        onlyPurchaseableWith: ['ETH', 'STR+ETH'],
        denomination: 'ETH',
        price: 2.067,
        route: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
      },
    ],
  },
  poolInTokens: [
    {
      label: 'ETH',
      logo: 'logo-eth.png',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimals: 18,
    },
    // {
    //   label: 'WPE',
    //   logo: 'WPE.png',
    //   address: '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
    //   decimals: 18,
    // },
    // {
    //   label: 'USDC',
    //   logo: 'USD_Coin_icon.webp',
    //   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    //   decimals: 6,
    // },
    // {
    //   label: 'USDT',
    //   logo: 'tether_32.webp',
    //   address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    //   decimals: 6,
    // },
    // {
    //   label: 'WPE+ETH',
    //   logo: 'WPE.png',
    //   address: 'WPE+ETH',
    //   decimals: 18,
    // },
    {
      label: 'YFU+ETH',
      logo: 'WPE.png',
      address: 'YFU+ETH',
      decimals: 18,
    },
    {
      label: 'PIXEL+ETH',
      logo: 'WPE.png',
      address: 'PIXEL+ETH',
      decimals: 18,
    },
    {
      label: 'STR+ETH',
      logo: 'WPE.png',
      address: 'STR+ETH',
      decimals: 18,
    },
  ],
  lpTokens: [
    {
      label: 'STR',
      address: '0x11C1a6B3Ed6Bb362954b29d3183cfA97A0c806Aa',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'PIXEL',
      address: '0x89045d0Af6A12782Ec6f701eE6698bEaF17d0eA2',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'LIFT',
      address: '0x47bd5114c12421FBC8B15711cE834AFDedea05D9',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'YFU',
      address: '0xa279dab6ec190eE4Efce7Da72896EB58AD533262',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'ETH',
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      box: false, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'WPE',
      address: '0xd075e95423c5c4ba1e122cae0f4cdfa19b82881b',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'WPEBPT',
      address: '0x98a498D8e7ce64A873d5029a34F37FdAa3F6F799',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'YFUBPT',
      address: '0x9f2b223da9f3911698c9b90ecdf3ffee37dd54a8',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'PIXELBPT',
      address: '0x69dD1ef819Afde481d81E6C1C1Bb91CabCFe780f',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'STRBPT',
      address: '0x8e9690E135005E415BD050B11768615DE43fe5f8',
      box: true, // shows its box price in pool view
      decimals: 18,
      price: 0.0,
      priceETH: 0.0,
      priceWPE: 0.0,
    },
    {
      label: 'WBTC',
      address: '0x0731ee4cf7376A1bd5A78199ac9BEdc8213DeF24',
      box: true, // shows its box price in pool view
      decimals: 18,
      onlyPurchaseableWith: ['ETH'],
      denomination: 'ETH',
      price: 2.067,
    },
  ],
};
export default STORE_INIT_CONSTANTS;
