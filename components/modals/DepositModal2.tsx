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
import { getAddress, getContract } from '../../src/utils';
import { useEffect, useContext } from 'react';
import { WalletContext } from '../WalletContextProvider';
import { BiPlusCircle } from 'react-icons/bi';
import { AppDataContext } from '../AppDataProvider';
import axios from 'axios';

const DepositModal = ({ handleDeposit }: any) => {
	const [selectedAsset, setSelectedAsset] = React.useState<number>(0);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);

	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [hash, setHash] = useState(null);
	const [confirmed, setConfirmed] = useState(false);

	const [tryApprove, setTryApprove] = React.useState<string | boolean>(
		'null'
	);

	const { isConnected, tronWeb, address } = useContext(WalletContext);

	const { collaterals } = useContext(AppDataContext);

	const asset = () => collaterals[selectedAsset];
	const balance = () => asset().walletBalance / 10 ** asset().decimal;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const allowanceCheck = async () => {
		if (!(tronWeb as any).contract || !asset()) return;
		let collateral = await getContract(
			tronWeb,
			'CollateralERC20',
			asset()['coll_address']
		);
		let allowance = await collateral.methods
			.allowance(address, getAddress('System'))
			.call();
		allowance = allowance
			.div((10 ** asset()['decimal']).toString())
			.toString();
		// console.log(allowance, balance);
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
		if (tryApprove == 'null' && isConnected) allowanceCheck();
	}, [allowanceCheck, selectedAsset, collaterals, isConnected, tryApprove]);

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
		console.log(asset());
		if (!amount) return;
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');
		let system = await getContract(tronWeb, 'System');
		let value = Big(amount)
			.mul(Big(10).pow(Number(asset()['decimal'])))
			.toFixed(0);
		system.methods
			.deposit(asset()['coll_address'], value)
			.send({ feeLimit: 1000000000 })
			.then((res: any) => {
				setHash(res);
				setLoading(false);
				checkResponse(res);
				setResponse('Transaction sent! Waiting for confirmation...');
			})
			.catch((err: any) => {
				setLoading(false);
				setResponse('Transaction Failed: Signature rejected');
			});
	};

	const checkResponse = (tx_id: string, retryCount = 0) => {
		axios
			.get(
				'https://nile.trongrid.io/wallet/gettransactionbyid?value=' +
					tx_id
			)
			.then((res) => {
				console.log(res);
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

	const amountLowerThanMin = () => {
		if (Number(amount) > asset()?.minCollateral / 10 ** asset().decimal) {
			return false;
		}
		return true;
	};

	const approve = async () => {
		setLoading(true);
		let collateral = await getContract(
			tronWeb,
			'CollateralERC20',
			asset()['coll_address']
		);
		collateral
			.approve(getAddress('System'), '100000000000000000000000000000000')
			.send({}, (error: any, hash: any) => {
				if (error) {
					console.log(error);
				}
				if (hash) {
					setTryApprove(false);
					setLoading(false);
				}
			});
	};

	const updateSlider = (e: any) => {
		setAmount((balance() * e) / 100);
	};

	const updateAsset = (e: any) => {
		setSelectedAsset(e.target.value);
	};

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
								<Text mb={2} textAlign="right" fontSize={'sm'}>
									Balance: {balance()} {asset()?.symbol}
								</Text>
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
									!isConnected ||
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
								{isConnected ? (
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
								disabled={!isConnected}
								isLoading={loading}
								loadingText="Please sign the transaction"
								colorScheme={'orange'}
								width="100%"
								mt={4}
								onClick={approve}
								isDisabled={loading}>
								{isConnected ? (
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
