import ierC721ENUMERABLE from './abis/ierc721ENUMERABLE';
import seedzABI from './abis/seedzABI';
import superHiveAbi from './abis/superHiveAbi';
import wbtcBoostAbi from './abis/wbtcBoostAbi';
import boostRewardABI from './abis/boostRewardABI';
import boostABI2 from './abis/boostABI2';
import boostABI from './abis/boostABI';
import feeRewardsABI from './abis/feeRewardsABI';
import erc20ABI from './abis/erc20ABI';
import governanceV2ABI from './abis/governanceV2ABI';
import exchangeABI from './abis/exchangeABI';
import lpAddressABI from './abis/lpAddressABI';
import WPElpAddressABI from './abis/WPElpAddressABI';
import uniswapRouterABI from './abis/uniswapRouterABI';
import farmsRewardsAbi from './abis/farmsRewardsAbi';
import ierC721 from './abis/ierC721';
import yfiABI from './abis/yfiABI';
import bpoolABI from './abis/bpoolABI';
import balancerABI from './abis/balancerABI';
import balancerRewardsABI from './abis/balancerRewardsABI';
import governanceABI from './abis/governanceABI';
import claimABI from './abis/claimABI';

export default {
  seedzAddress: '0xfdAA319A95bA06150Cac68794738130dF077a396', //BPT
  seedzAddressTwo: '0xA03c590340B72FEf861Df1Fef1355D18AD60B11D', //UNI
  seedzABI,

  superHiveAbi,

  wbtcBoostAbi,

  boostRewardAddress: '0x32f1d4BB869Ae0Be174A4d06EE359877C1B6B71B',
  boostRewardABI,

  boostAddress2: '0x3637a45545Af424aD18c27c77a9D39549a7E50E6',
  boostABI2,

  boostAddress: '0x3e780920601D61cEdb860fe9c4a90c9EA6A35E78',
  boostABI,

  balancerAddress: '0x5B2dC8c02728e8FB6aeA03a622c3849875A48801',
  balancerABI,

  //Boost Smart COntract Rewards
  balancerRewardsAddress: '0xE09b08270b40498f3CAccd944b051D2Bf3C465C8',
  balancerRewardsABI,

  yfiAddress: '0xd075e95423C5c4BA1E122CaE0f4CdFA19b82881b',
  yfiABI,

  claimAddress: '0xcc9EFea3ac5Df6AD6A656235Ef955fBfEF65B862',
  claimABI,

  governanceAddress: '0x3A22dF48d84957F907e67F4313E3D43179040d6E',
  governanceABI,

  bpoolAddress: '0x95c4b6c7cff608c0ca048df8b81a484aa377172b',
  bpoolABI,

  feeRewardsAddress: '0xb01419E74D8a2abb1bbAD82925b19c36C191A701',
  feeRewardsABI,

  erc20ABI,

  governanceV2Address: '0x0D6BB6A3910A950eF975c51DbBE32eCf0527F338',
  governanceV2ABI,

  exchangeAddress: '0xeee4de1b937A7784FF40f0364D7a700Bd0c05D66',
  exchangeABI,

  lpAddressABI,

  //WPEbptAddress: '0xBc000F9836dE6FAD37CA1D4852A59D553142A187',
  WPEbptAddressABI: [
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "option",
				"type": "bool"
			}
		],
		"name": "autoStakeSet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "createLPETHToken",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountToken",
				"type": "uint256"
			}
		],
		"name": "createLPWithTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getChange",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "_lpToken",
				"type": "address"
			},
			{
				"internalType": "contract IERC20",
				"name": "_firstToken",
				"type": "address"
			},
			{
				"internalType": "contract stakeContractInterface",
				"name": "stakeContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "firstToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "getAmountFor",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountToken",
				"type": "uint256"
			}
		],
		"name": "getAmountForToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ethNeeded",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lpToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "poolId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "secondToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
],

  WPElpAddress: '0x2eBE0E90f57086F76163c68A69e78fC5F76232F9',
  WPElpAddressABI,

  uniswapRouterAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  uniswapRouterABI,
  farmsRewardsAbi,

  ierC721,

  ierC721ENUMERABLE,
};
