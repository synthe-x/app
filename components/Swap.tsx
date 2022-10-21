import {
	Box,
	Text,
	Flex,
	Divider,
	useColorMode,
	Progress,
	Input,
	Button,
	InputGroup,
	InputRightElement,
	Select,
	Spinner,
	Link,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import IssuanceTable from '../components/IssuanceTable';
import CollateralTable from '../components/CollateralTable';
import { useContext, useEffect, useState } from 'react';
import { getContract } from '../src/utils';
import { useAccount } from 'wagmi';
import web3 from 'web3';
import Chart from '../components/DonutChart';
import axios from 'axios';
import { WalletContext } from '../components/WalletContextProvider';
import ConnectButton from '../components/ConnectButton';
import { BsArrowBarDown, BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { MdOutlineSwapVert } from 'react-icons/md';
import TradingChart from './charts/TradingChart';

function Swap() {
	const { colorMode } = useColorMode();
	const [inputAssetIndex, setInputAssetIndex] = useState(1);
	const [outputAssetIndex, setOutputAssetIndex] = useState(0);
	const [inputAmount, setInputAmount] = useState(0);
	const [outputAmount, setOutputAmount] = useState(0);
	const [loader, setloader] = useState(false);
	const [hash, sethash] = useState('');
	const [depositerror, setdepositerror] = useState('');
	const [depositconfirm, setdepositconfirm] = useState(false);

	const updateInputAmount = (e: any) => {
		setInputAmount(e.target.value);
		let outputAmount = (e.target.value * inputToken().price) / outputToken().price;
		setOutputAmount(outputAmount);
	};

	const updateInputAssetIndex = (e: any) => {
		setInputAssetIndex(e.target.value);
		if (outputAssetIndex == e.target.value) {
			let i = 0;
			if (e.target.value == synths.length) {
				i = e.target.value + 1;
			} else {
				if (e.target.value == 0) {
					i = e.target.value + 1;
				} else {
					i = e.target.value - 1;
				}
			}
			setOutputAssetIndex(i);
		}
		// calculate output amount
		let _outputAmount = inputAmount * inputToken(e.target.value).price / outputToken().price;
		setOutputAmount(_outputAmount);
	};

	const updateOutputAmount = (e: any) => {
		setOutputAmount(e.target.value);
		let inputAmount =
			(e.target.value *
				(pools[tradingPool].poolSynth_ids ?? synths)[outputAssetIndex]
					.price) /
			(pools[tradingPool].poolSynth_ids ?? synths)[inputAssetIndex].price;
		setInputAmount(inputAmount);
	};

	const updateOutputAssetIndex = (e: any) => {
		setOutputAssetIndex(e.target.value);
		if (inputAssetIndex == e.target.value) {
			let i = 0;
			if (
				e.target.value ==
				(pools[tradingPool].poolSynth_ids ?? synths).length
			) {
				i = e.target.value + 1;
			} else {
				if (e.target.value == 0) {
					i = e.target.value + 1;
				} else {
					i = e.target.value - 1;
				}
			}
			setInputAssetIndex(i);
		}
		// calculate input amount
		let _inputAmount = outputAmount * outputToken(e.target.value).price / inputToken().price;
		setInputAmount(_inputAmount);
	};

	const switchTokens = () => {
		let temp = inputAssetIndex;
		setInputAssetIndex(outputAssetIndex);
		setOutputAssetIndex(temp);
		setInputAmount(0);
		setOutputAmount(0);
	};

	const exchange = async () => {
		if (!inputAmount || !outputAmount) {
			return;
		}
		setloader(true);
		setdepositerror('');
		setdepositconfirm(false);
		let contract = await getContract(tronWeb, 'System');
		contract.methods
			.exchange(
				tradingPool,
				(pools[tradingPool].poolSynth_ids ?? synths)[inputAssetIndex]
					.synth_id,
				web3.utils.toWei(inputAmount.toString()),
				(pools[tradingPool].poolSynth_ids ?? synths)[outputAssetIndex]
					.synth_id
			)
			.send(
				{
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
						console.log('hash', hash);
						sethash(hash);
						if (hash) {
							setloader(false);
							setdepositconfirm(true);
						}
					}
				}
			);
	};

	const {
		isConnected,
		isConnecting,
		address,
		connect,
		collaterals,
		synths,
		totalCollateral,
		totalDebt,
		isDataReady,
		tradingPool,
		pools,
		poolUserData,
		tradingBalanceOf,
		tronWeb,
		tokenFormatter,
	} = useContext(WalletContext);

	useEffect(() => {
		if (
			inputAssetIndex > 1 && (pools[tradingPool].poolSynth_ids ?? synths).length <
			inputAssetIndex
		) {
			setInputAssetIndex(0);
		}
		if (
			outputAssetIndex > 1 && (pools[tradingPool].poolSynth_ids ?? synths).length <
			outputAssetIndex
		) {
			setOutputAssetIndex(
				(pools[tradingPool].poolSynth_ids ?? synths).length - 1
			);
		}
	}, [inputAssetIndex, outputAssetIndex, pools, synths, tradingPool]);

	const handleMax = () => {
		let _inputAsset = (pools[tradingPool].poolSynth_ids ?? synths)[
			inputAssetIndex
		];
		let _inputAmount =
			0.999 * tradingBalanceOf(_inputAsset.synth_id) /
			10 ** (_inputAsset.decimal ?? 18);
		setInputAmount(_inputAmount);
		let _outputAmount =
			(_inputAmount *
				(pools[tradingPool].poolSynth_ids ?? synths)[inputAssetIndex]!
					.price) /
			(pools[tradingPool].poolSynth_ids ?? synths)[outputAssetIndex]!
				.price;
		setOutputAmount(_outputAmount);
	};

	const inputToken = (_inputAssetIndex = inputAssetIndex) => {
		if (pools[tradingPool].poolSynth_ids) {
			return pools[tradingPool].poolSynth_ids[_inputAssetIndex];
		} else {
			return synths[_inputAssetIndex];
		}
	}

	const outputToken = (_outputAssetIndex = outputAssetIndex) => {
		if (pools[tradingPool].poolSynth_ids) {
			return pools[tradingPool].poolSynth_ids[_outputAssetIndex];
		} else {
			return synths[_outputAssetIndex];
		}
	}

	return (
		<>
			{pools[tradingPool] && (
				<Box
					px={10}
					// pt={10}
					pb={'150px'}
					mt={6}
					// bgColor={'#171717'}
					// border={'1px solid #2C2C2C'}
					rounded={6}>
					<Flex justify={'space-between'} mb={5}>
						{/* Asset Name */}
						<Text mb={3} fontSize="3xl" fontWeight={'bold'}>
							{inputToken()?.symbol}
							/
							{outputToken()?.symbol}
						</Text>
						{/* Asset Price */}
						<Box>
							<Flex align={'center'} gap={1}>
								<Text fontSize={'2xl'} fontWeight="bold">
									{tokenFormatter.format(
										inputToken()?.price / outputToken()?.price
									)}
								</Text>
								<Text fontSize={'sm'}>
									{
										outputToken()?.symbol
									}
								</Text>
								<Text fontSize={'sm'}>
									/{' '}
									{
										inputToken()?.symbol
									}
								</Text>
							</Flex>
						</Box>

					</Flex>
					<TradingChart input={(pools[tradingPool].poolSynth_ids ?? synths)[inputAssetIndex]?.symbol} output={(pools[tradingPool].poolSynth_ids ?? synths)[outputAssetIndex]?.symbol} />

					{/* Input */}
					<Flex>
						<InputGroup size="md">
							<Input
								pr="4.5rem"
								height="50px"
								type="number"
								placeholder="Enter amount"
								value={inputAmount}
								onChange={updateInputAmount}
							/>
							<InputRightElement width="5rem">
								<Button
									h="2.4rem"
									mr={1.5}
									mt={2.5}
									px={5}
									size="sm"
									variant={'ghost'}
									onClick={handleMax}
									_hover={{ bg: 'none' }}>
									Set Max
								</Button>
							</InputRightElement>
						</InputGroup>
						<Select
							width={'30%'}
							height="50px"
							value={inputAssetIndex}
							onChange={updateInputAssetIndex}>
							{(pools[tradingPool].poolSynth_ids ?? synths).map(
								(synth: any, index: number) => (
									<option
										key={synth['synth_id']}
										value={index}>
										{synth['symbol']}
									</option>
								)
							)}
						</Select>
					</Flex>

					{/* Output */}
					<Button
						my={5}
						rounded="100"
						onClick={switchTokens}
						variant="ghost"
						_hover={{ bg: 'none' }}>
						<MdOutlineSwapVert size={'20px'} />
					</Button>

					<Flex>
						<InputGroup size="md">
							<Input
								pr="4.5rem"
								height="50px"
								type="number"
								placeholder="Enter amount"
								value={outputAmount}
								onChange={updateOutputAmount}
							/>
						</InputGroup>
						<Select
							width={'30%'}
							height="50px"
							value={outputAssetIndex}
							onChange={updateOutputAssetIndex}>
							{(pools[tradingPool].poolSynth_ids ?? synths).map(
								(synth: any, index: number) => (
									<option
										key={synth['synth_id']}
										value={index}>
										{synth['symbol']}
									</option>
								)
							)}
						</Select>
					</Flex>

					<Text fontSize={'sm'} mt={6} color="gray">
						Trading Fee: 0.00 %
					</Text>
					<Button
						mt={6}
						size="lg"
						width={'100%'}
						bgColor={'#0CAD4B'}
						onClick={exchange}
						disabled={!isConnected || inputAmount <= 0}>
						{isConnected ? (
							inputAmount > 0 ? (
								<>Exchange</>
							) : (
								<>Enter Amount</>
							)
						) : (
							<>Please connect your wallet</>
						)}
					</Button>

					{loader && (
						<Flex
							alignItems={'center'}
							flexDirection={'row'}
							justifyContent="center"
							mt="1rem"
							bgColor={'#2C2C2C'}
							rounded={8}
							py={4}>
							<Box>
								<Spinner
									thickness="10px"
									speed="0.65s"
									emptyColor="gray.200"
									color="green.500"
									size="xl"
									mr={4}
								/>
							</Box>

							<Box ml="0.5rem">
								<Text fontFamily={'Roboto'} fontSize="sm">
									{' '}
									Waiting for the blockchain to confirm your
									transaction...{' '}
								</Text>
								<Link
									color="blue.200"
									fontSize={'xs'}
									href={`https://nile.tronscan.org/#/transaction/${hash}`}
									target="_blank"
									rel="noreferrer">
									View on Tronscan
								</Link>
							</Box>
						</Flex>
					)}
					{depositerror && (
						<Text
							textAlign={'center'}
							color="red"
							bgColor={'#2C2C2C'}
							rounded={8}
							py={4}>
							{depositerror}
						</Text>
					)}
					{depositconfirm && (
						<Flex
							flexDirection={'column'}
							mt="1rem"
							justifyContent="center"
							alignItems="center"
							bgColor={'#2C2C2C'}
							rounded={8}
							py={4}>
							<Text
								fontFamily={'Roboto'}
								textAlign={'center'}
								fontSize="sm">
								Transaction Submitted
							</Text>
							<Box>
								<Link
									fontSize={'xs'}
									color="blue.200"
									href={`https://nile.tronscan.org/#/transaction/${hash}`}
									target="_blank"
									rel="noreferrer">
									View on Tronscan
								</Link>
							</Box>
						</Flex>
					)}
				</Box>
			)}
		</>
	);
}

export default Swap;
