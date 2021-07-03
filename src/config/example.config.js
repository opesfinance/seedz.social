import abis from './abis.config';

const config = {
  infuraProvider:
    'https://mainnet.infura.io/v3/b111d8f387c847039541e29435e06cd2',

  yCurveFiRewardsAddress: '0x98C51906264ef99B7cF02a60c6cCC81C898C5fD4',
  yCurveFiRewardsABI: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'reward',
          type: 'uint256',
        },
      ],
      name: 'RewardAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'reward',
          type: 'uint256',
        },
      ],
      name: 'RewardPaid',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Staked',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Withdrawn',
      type: 'event',
    },
    {
      constant: true,
      inputs: [],
      name: 'DURATION',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'earned',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'exit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'getReward',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'isOwner',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'lastTimeRewardApplicable',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'lastUpdateTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'uint256', name: 'reward', type: 'uint256' }],
      name: 'notifyRewardAmount',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'periodFinish',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'rewardPerToken',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'rewardPerTokenStored',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'rewardRate',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'rewards',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address',
          name: '_rewardDistribution',
          type: 'address',
        },
      ],
      name: 'setRewardDistribution',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'stake',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: '', type: 'address' }],
      name: 'userRewardPerTokenPaid',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
      name: 'withdraw',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'wpe',
      outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'y',
      outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],

  // TODO
  pixelHiveAddress: '0x9f8A64574F73DC71E6FEb2300183aD6B4404C867',
  yfuHiveAddress: '0xc96d43006fE0058c5dd9d35D2763Aba9A0C300b1',
  liftHiveAddress: '0x558E4189d0A206Eb6fb7451B0A5263f75A13A3a3',
  strHiveAddress: '0xE1C0E3c6B0cbA894932a5599e91cCf63E23C1693',
  wpeHiveAddress: '0xf7233E9816C4c08a9B83Ffc944701854d3CEf6b4',
  wbtcHiveAddress: '0x9411aE40e4EefE2BDCF6F4e2beC81BEb7682bC63',
  wpeSuperHiveAddress: '0xD4c8D5de63ec1C808576D49842b22aeA6e389eF5',

  // CHANGE THIS!!!
  farmpixel: '0x1089c0132423CeBE0A5b03125B3D7f9f31c538EB',
  farmyfu: '0xAFc076D8a22D6698A8C7F2B591326DF418340f28',
  // farmlift: '0x9f8A64574F73DC71E6FEb2300183aD6B4404C867-LIFT',
  farmstr: '0x88121B6D8aED2afafE37D844D325a1579209e362',

  farmsRewardAddress: '0xa279dab6ec190eE4Efce7Da72896EB58AD533262',
  // farmsRewardsAbi: [],
  //Converter addresses
  YFUlpAddress: '0xb4DA88fA5292d6d7c9Bb9E20255Dd6596A9b93E0',
  LIFTlpAddress: '0x8a04e2991496CbC122E3f5d00289246e4e8ab7A9',
  STRlpAddress: '0x5d35a56d67a7659e252Bb2b5FAa942191911c9c1',
  PIXELlpAddress: '0xD20B4a71d1F59E37713aba361A0a25a64a7D335D',
  WBTClpAddress: '0xe9762E1b97bAdB0fdC95c7A6D229a93Ab87Fe3fD',
  WPEBPTbptAddress: '0xA0cEB04D3b3c9EBFa11f31C65887b5413D066C30',

  WPEBPT721Address: '0xD8F16fc27901f77d58A41101B096b47b30C052d2',
  IERC721Address: '0xc16d9049e251b872f269c09c3e9eb56c6d035f5f',

  ...abis,
};

export default config;
