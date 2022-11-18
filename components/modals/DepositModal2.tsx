import React, { useState } from 'react';
import {
	Button,
	Box,
	Text,
	Flex,
	useDisclosure,
	Input,
	IconButton,
	InputRightElement,
	InputGroup,
	Spinner,
	Link,
	Image,
	InputLeftAddon,
	InputRightAddon,
	Select,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react';

import {
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
} from '@chakra-ui/react';

const Big = require('big.js');

import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getAddress, getContract, send, call } from '../../src/contract';
import { useEffect, useContext } from 'react';
import { WalletContext } from '../WalletContextProvider';
import { BiPlusCircle } from 'react-icons/bi';
import { AppDataContext } from '../AppDataProvider';
import axios from 'axios';
import { ChainID } from '../../src/chains';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const CLAIM_AMOUNTS: any = {
	'WTRX': '100000000000',
	'ETH': ethers.utils.parseEther('10').toString()
}
const DepositModal = ({ handleDeposit }: any) => {
	const [selectedAsset, setSelectedAsset] = React.useState<number>(0);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);
	const [claimLoading, setClaimLoading] = useState(false);

	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [hash, setHash] = useState(null);
	const [confirmed, setConfirmed] = useState(false);

	const [tryApprove, setTryApprove] = React.useState<string | boolean>(
		'null'
	);

	const { isConnected, tronWeb, address } = useContext(WalletContext);

	const { collaterals, tokenFormatter, chain, updateCollateralWalletBalance } = useContext(AppDataContext);

	const asset = () => collaterals[selectedAsset];
	const balance = () => asset().walletBalance / 10 ** asset().decimal;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const allowanceCheck = async () => {
		if (!asset()) return;
		let collateral = await getContract(
			'CollateralERC20',
			chain,
			asset()['coll_address']
		);
		let allowance = await call(collateral, 'allowance', [address ?? evmAddress, getAddress('System', chain)], chain)
		// collateral.methods
		// 	.allowance(address, getAddress('System'))
		// 	.call();
		allowance = allowance
			.div((10 ** asset()['decimal']).toString())
			.toString();
		if (allowance.length < 10) {
			if (parseInt(allowance) <= balance()) {
				setAmount(0);
				setTryApprove(true);
			} else {
				setTryApprove(false);
			}
		} else {
			setTryApprove(false);
		}
	};

	// const balance = asset.walletBalance / (10**asset.decimal)
	useEffect(() => {
		if (tryApprove == 'null' && (isConnected || isEvmConnected) && chain > 0) allowanceCheck();
	}, [allowanceCheck, selectedAsset, collaterals, isConnected, tryApprove, chain]);

	const _onClose = () => {
		setLoading(false);
		setResponse(null);
		setHash(null);
		setConfirmed(false);
		setAmount(0);
		onClose();
	};

	const changeAmount = (event: any) => {
		setAmount(event.target.value);
	};

	const issue = async () => {
		if (!amount) return;
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');
		let system = await getContract('System', chain);
		let value = Big(amount)
			.mul(Big(10).pow(Number(asset()['decimal'])))
			.toFixed(0);

		send(system, 'deposit', [asset()['coll_address'], value], chain)
		.then(async (res: any) => {
			setLoading(false);
			setResponse('Transaction sent! Waiting for confirmation...');
			if (chain == ChainID.NILE) {
				setHash(res);
				checkResponse(res);
			} else {
				setHash(res.hash);
				await res.wait(1);
				setConfirmed(true);
				setResponse('Transaction Successful!');
			}
		})
		.catch((err: any) => {
			setLoading(false);
			setConfirmed(true);
			setResponse('Transaction failed. Please try again!');
		});
	};

	const checkResponse = (tx_id: string, retryCount = 0) => {
		axios
			.get(
				'https://nile.trongrid.io/wallet/gettransactionbyid?value=' +
					tx_id
			)
			.then((res) => {
				if (!res.data.ret) {
					setTimeout(() => {
						checkResponse(tx_id);
					}, 2000);
				} else {
					setConfirmed(true);
					if (res.data.ret[0].contractRet == 'SUCCESS') {
						setResponse('Transaction Successful!');
						handleDeposit(
							asset()['coll_address'],
							Big(amount)
								.mul(Big(10).pow(Number(asset()['decimal'])))
								.toFixed(0)
						);
					} else {
						if (retryCount < 3)
							setTimeout(() => {
								checkResponse(tx_id, retryCount + 1);
							}, 2000);
						else {
							setResponse(
								'Transaction Failed. Please try again.'
							);
						}
					}
				}
			});
	};

	const claim = async () => {
		setClaimLoading(true);
		let wtrx = await getContract('WTRX', chain);
		send(wtrx, 'deposit', [], chain)
		.then(async (res: any) => {
			console.log(hash);
			setClaimLoading(false);
			updateCollateralWalletBalance(
				wtrx.address,
				CLAIM_AMOUNTS[asset().symbol],
				false
			);
		})
		.catch((err: any) => {
			console.log(err);
			setClaimLoading(false);
		});
	};


	const amountLowerThanMin = () => {
		if (Number(amount) > asset()?.minCollateral / 10 ** asset().decimal) {
			return false;
		}
		return true;
	};

	const approve = async () => {
		setLoading(true);
		let collateral = await getContract(
			'CollateralERC20',
			chain,
			asset()['coll_address']
		);
		send(collateral, 'approve', [getAddress('System', chain), ethers.constants.MaxUint256], chain)
		.then(async (res: any) => {
			setTryApprove(false);
			setLoading(false);
		})
		.catch((err: any) => {
			console.log(err);
		});
	};

	const updateSlider = (e: any) => {
		setAmount((balance() * e) / 100);
	};

	const updateAsset = (e: any) => {
		setSelectedAsset(e.target.value);
	};

	const {address: evmAddress, isConnected: isEvmConnected, isConnecting: isEvmConnecting} = useAccount();

	return (
		<Box>
			<Button
				width={'100%'}
				size="lg"
				bgColor={'primary'}
				rounded={10}
				onClick={onOpen}>
				Add
			</Button>

			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent
					width={'30rem'}
					// bgColor="blackAlpha.800" color={"white"}
				>
					<ModalCloseButton />

					<ModalHeader>Deposit collateral</ModalHeader>
					{/* {tryApprove} */}
					<ModalBody>
						<Select
							placeholder="Select asset"
							onChange={updateAsset}
							mb={2}
							value={selectedAsset}>
							{collaterals.map(
								(collateral: any, index: number) => (
									<option
										key={collateral.symbol}
										value={index}>
										{collateral.name}
									</option>
								)
							)}
						</Select>
						{!tryApprove ? (
							<Box>
								<Flex justify={'space-between'} align='center' width={'100%'} mb={2}>
								<Text textAlign="right" fontSize={'xs'}>
									Balance: {tokenFormatter.format(balance())} {asset()?.symbol}
								</Text>
								{(asset()?.symbol == 'WTRX' || asset()?.symbol == 'ETH') && (isConnected || isEvmConnected) ? (
								<Button
									
									isLoading={claimLoading}
									size={'xs'}
									// rounded={40}
									onClick={claim} 
									color='black'
									// variant={'ghost'}
									>
									Claim {asset()?.symbol} Tokens 💰
								</Button>
							) : (
								<></>
							)}
								</Flex>
								<InputGroup size="md" alignItems={'center'}>
									<Image
										src={`/${asset()?.symbol}.png`}
										alt=""
										width="35"
										height={35}
										mr={2}
									/>
									<Input
										type="number"
										placeholder="Enter amount"
										onChange={changeAmount}
										value={amount}
										disabled={tryApprove as boolean}
									/>
									<InputRightAddon>
										{asset()?.symbol}
									</InputRightAddon>
								</InputGroup>
								<Slider
									isDisabled={Boolean(tryApprove)}
									aria-label="slider-ex-1"
									defaultValue={30}
									onChange={updateSlider}
									mt={4}
									// mx="13%"
									// width={"74%"}
								>
									<SliderTrack>
										<SliderFilledTrack bgColor='#3EE6C4' />
									</SliderTrack>
									<SliderThumb />
								</Slider>
								<Flex mt={4} justify="space-between">
									<Text fontSize={'xs'} color="gray.400">
										1 {asset()?.symbol} = {asset()?.price}{' '}
										USD
									</Text>
								</Flex>
							</Box>
						) : (
							<Flex my={4} gap={5}>
								<Image
									src={`/${asset()?.symbol}.png`}
									alt=""
									width="35"
									height={35}
									mb={5}
								/>
								<Text fontSize={'sm'}>
									To Deposit or Repay {asset()?.name} token to
									the SyntheX, you need to enable it first.
								</Text>
							</Flex>
						)}

						{!tryApprove ? (
							<Button
								isLoading={loading}
								loadingText="Please sign the transaction"
								disabled={
									amountLowerThanMin() ||
									loading ||
									!(isConnected || isEvmConnected) ||
									!amount ||
									amount == 0 ||
									amount > balance()
								}
								bgColor='#3EE6C4'
								color={'gray.800'}
								width="100%"
								mt={4}
								isDisabled={loading}
								onClick={issue}>
								{(isConnected || isEvmConnected) ? (
									!amount || amount == 0 ? (
										'Enter amount'
									) : amountLowerThanMin() ? (
										'Amount too less'
									) : amount > balance() ? (
										'Insufficient Balance'
									) : (
										<>Deposit</>
									)
								) : (
									<>Please connect your wallet</>
								)}
							</Button>
						) : (
							<Button
								disabled={!(isConnected || isEvmConnected)}
								isLoading={loading}
								loadingText="Please sign the transaction"
								colorScheme={'orange'}
								width="100%"
								mt={4}
								onClick={approve}
								isDisabled={loading}>
								{(isConnected || isEvmConnected) ? (
									<>Approve {asset()?.symbol}</>
								) : (
									<>Please connect your wallet</>
								)}
							</Button>
						)}

						{response && (
							<Box width={'100%'} my={2} color="black">
								<Alert
									status={
										response.includes('confirm')
											? 'info'
											: confirmed &&
											  response.includes('Success')
											? 'success'
											: 'error'
									}
									variant="subtle"
									rounded={6}>
									<AlertIcon />
									<Box>
										<Text fontSize="md" mb={0}>
											{response}
										</Text>
										{hash && (
											<Link
												href={
													'https://nile.tronscan.org/#/transaction/' +
													hash
												}
												target="_blank">
												{' '}
												<Text fontSize={'sm'}>
													View on TronScan
												</Text>
											</Link>
										)}
									</Box>
								</Alert>
							</Box>
						)}
					</ModalBody>
					<ModalFooter>
						<AiOutlineInfoCircle size={20} />
						<Text ml="2">More Info</Text>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default DepositModal;
