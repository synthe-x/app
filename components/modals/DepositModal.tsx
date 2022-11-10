import React from 'react';
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

const DepositModal = ({ asset, handleDeposit }: any) => {
	const balance = asset.walletBalance / (10**asset.decimal)
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(balance * 0.3);
	const [loader, setloader] = React.useState(false);
	const [hash, sethash] = React.useState('');
	const [depositerror, setdepositerror] = React.useState('');
	const [depositconfirm, setdepositconfirm] = React.useState(false);
	const [tryApprove, setTryApprove] = React.useState<string | boolean>(
		'null'
	);

	const _onClose = () => {
		setdepositerror('');
		setdepositconfirm(false);
		setAmount(balance * 0.3);
		sethash('');
		setloader(false);
		onClose();
	};

	const changeAmount = (event: any) => {
		setAmount(event.target.value);
	};

	const issue = async () => {
		if (!amount) return;
		let system = await getContract(tronWeb, 'System');
		let value = Big(amount).mul(Big(10).pow(Number(asset['decimal']))).toFixed(0);
		setloader(true);
		setdepositerror('');
		setdepositconfirm(false);
		system.methods.deposit(asset['coll_address'], value).send(
			{
				value,
				// shouldPollResponse:true
				feeLimit: 1000000000,
			},
			(error: any, hash: any) => {
				if (error) {
					if (error.output) {
						if (error.output.contractResult) {
							setdepositerror(
								(window as any).tronWeb.toAscii(
									error.output.contractResult[0]
								)
							);
						} else {
							setdepositerror('Errored. Please try again');
						}
					} else {
						setdepositerror(error.error);
					}
					setloader(false);
				}
				if (hash) {
					sethash(hash);
					if (hash) {
						setloader(false);
						setdepositconfirm(true);
						handleDeposit(asset['coll_address'], value);
					}
				}
			}
		);
	};

	const approve = async () => {
		let collateral = await getContract(
			tronWeb,
			'CollateralERC20',
			asset['coll_address']
		);
		setloader(true);
		collateral
			.approve(getAddress('System'), '100000000000000000000000000000000')
			.send({}, (error: any, hash: any) => {
				if (error) {
					console.log(error);
				}
				if (hash) {
					setTryApprove(false);
					setloader(false);
				}
			});
	};

	const allowanceCheck = async () => {
		if(!(tronWeb as any).contract) return;
		let collateral = await getContract(
			tronWeb,
			'CollateralERC20',
			asset['coll_address']
		);
		let allowance = await collateral.methods
			.allowance(
				address,
				getAddress('System')
			)
			.call();
		allowance = allowance
			.div((10 ** asset['decimal']).toString())
			.toString();
		// console.log(allowance, balance);
		if (allowance.length < 10) {
			if (parseInt(allowance) <= balance) {
				setAmount(0);
				setTryApprove(true);
			} else {
				setTryApprove(false);
			}
		} else {
			setTryApprove(false);
		}
	};

	useEffect(() => {
		if (tryApprove == 'null' && isConnected) allowanceCheck();
	});

	const updateSlider = (e: any) => {
		setAmount((balance * e) / 100);
	};

	const {isConnected, tronWeb, address} = useContext(WalletContext);
	const { updateCollateralWalletBalance, updateCollateralAmount } = useContext(AppDataContext);

	return (
		<Box>
			<IconButton
			// disabled={!isConnected}
				variant="ghost"
				onClick={onOpen}
				icon={<BiPlusCircle size={35} color="gray" />}
				aria-label={''}
				isRound={true}></IconButton>
			<Modal isCentered isOpen={isOpen} onClose={_onClose} >
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent width={'30rem'}
				// bgColor="blackAlpha.800" color={"white"}
				>
					<ModalCloseButton />

					<ModalHeader>
						Deposit {asset['symbol']} as collateral
					</ModalHeader>
					{/* {tryApprove} */}
					<ModalBody>
						{!tryApprove ? (
							<Box>
								<InputGroup size="md" alignItems={'center'}>
									<Image
										src={`/${asset.symbol}.png`}
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
									{asset['symbol']}
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
										<SliderFilledTrack bgColor="#276220" />
									</SliderTrack>
									<SliderThumb />
								</Slider>
								<Flex mt={4} justify="space-between">
									<Text fontSize={'xs'} color="gray.400">
										1 {asset['symbol']} = {asset['price']}{' '}
										USD
									</Text>
								</Flex>
							</Box>
						) : (
							<Flex my={4} gap={5}>
								<Image
									src={`/${asset.symbol}.png`}
									alt=""
									width="35"
									height={35}
									mb={5}
								/>
								<Text fontSize={'sm'}>
									To Deposit or Repay {asset.name} token to
									the SyntheX, you need to enable it first.
								</Text>
							</Flex>
						)}

						{(!tryApprove) ? (
							<Button
								isLoading={loader}
								disabled={!isConnected || !amount || amount == 0 || amount > balance}
								bgColor='#3EE6C4'
								color={'black'}
								width="100%"
								mt={4}
								onClick={issue}>
								{isConnected? (amount > balance) ? <>Insufficient Balance</> : (!amount || amount == 0) ?  <>Enter amount</> : <>Deposit</> : <>Please connect your wallet</>} 
							</Button>
						) : (
							<Button
								disabled={!isConnected}
								isLoading={loader}
								colorScheme={'orange'}
								width="100%"
								mt={4}
								onClick={approve}>
								{isConnected? <>Approve {asset['symbol']}</> : <>Please connect your wallet</>}
							</Button>
						)}

						{loader && (
							<Flex
								alignItems={'center'}
								flexDirection={'row'}
								justifyContent="center"
								mt="1.5rem">

								<Box>
									<Text fontFamily={'Roboto'} fontSize="md">
										{' '}
										Waiting for the blockchain to confirm
										your transaction.
										<Link
											color="blue.200"
											fontSize={'sm'}
											href={`https://nile.tronscan.org/#/transaction/${hash}`}
											target="_blank"
											rel="noreferrer">
											{' '}
											View on Tronscan
										</Link>
									</Text>
								</Box>
							</Flex>
						)}
						{depositerror && (
							<Text textAlign={'center'} color="red">
								{depositerror}
							</Text>
						)}
						{depositconfirm && (
							<Flex
								flexDirection={'column'}
								mt="1rem"
								justifyContent="center"
								alignItems="center">
								<Text
									fontFamily={'Roboto'}
									textAlign={'center'}>
									Transaction Submitted
								</Text>
								<Box>
									<Link
										fontSize={'sm'}
										color="blue.200"
										href={`https://nile.tronscan.org/#/transaction/${hash}`}
										target="_blank"
										rel="noreferrer">
										View on Tronscan
									</Link>
								</Box>
							</Flex>
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
