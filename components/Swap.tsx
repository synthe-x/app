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
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { getContract } from '../src/utils';
import { useAccount } from 'wagmi';
import web3 from 'web3';
import { WalletContext } from '../components/WalletContextProvider';
import { MdOutlineSwapVert } from 'react-icons/md';
import TradingChart from './charts/TradingChart';
import { AppDataContext } from './AppDataProvider';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { BsArrowRightCircle } from 'react-icons/bs';

function Swap() {
	const [inputAssetIndex, setInputAssetIndex] = useState(1);
	const [outputAssetIndex, setOutputAssetIndex] = useState(0);
	const [inputAmount, setInputAmount] = useState(0);
	const [outputAmount, setOutputAmount] = useState(0);

	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [hash, setHash] = useState(null);
	const [confirmed, setConfirmed] = useState(false);

	const updateInputAmount = (e: any) => {
		setInputAmount(e.target.value);
		let outputAmount =
			(e.target.value * inputToken().price) / outputToken().price;
		setOutputAmount(outputAmount);
	};

	const updateInputAssetIndex = (e: any) => {
		if (outputAssetIndex == e.target.value) {
			setOutputAssetIndex(inputAssetIndex);
		}
		setInputAssetIndex(e.target.value);
		// calculate output amount
		let _outputAmount =
			(inputAmount * inputToken(e.target.value).price) /
			outputToken().price;
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
		if (inputAssetIndex == e.target.value) {
			setInputAssetIndex(outputAssetIndex);
		}
		setOutputAssetIndex(e.target.value);
		// calculate input amount
		let _inputAmount =
			(outputAmount * outputToken(e.target.value).price) /
			inputToken().price;
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
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');
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
			.send({
				feeLimit: 1000000000,
			})
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

	// check response in intervals
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

	const { isConnected, tronWeb } = useContext(WalletContext);

	const { synths, tradingPool, pools, tradingBalanceOf, tokenFormatter } =
		useContext(AppDataContext);

	useEffect(() => {
		if (
			inputAssetIndex > 1 &&
			(pools[tradingPool].poolSynth_ids ?? synths).length <
				inputAssetIndex
		) {
			setInputAssetIndex(0);
		}
		if (
			outputAssetIndex > 1 &&
			(pools[tradingPool].poolSynth_ids ?? synths).length <
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
			(0.999 * tradingBalanceOf(_inputAsset.synth_id)) /
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
	};

	const outputToken = (_outputAssetIndex = outputAssetIndex) => {
		if (pools[tradingPool].poolSynth_ids) {
			return pools[tradingPool].poolSynth_ids[_outputAssetIndex];
		} else {
			return synths[_outputAssetIndex];
		}
	};

	return (
		<>
			<Head>
				<title>
					{' '}
					{tokenFormatter.format(
						inputToken()?.price / outputToken()?.price
					)}{' '}
					{outputToken().symbol}/{inputToken().symbol} | Synthex
				</title>
				<link rel="icon" type="image/x-icon" href="/logo32.png"></link>
			</Head>
			{pools[tradingPool] && (
				<Box
					px={10}
					// pt={10}
					pb={20}
					mt={8}
					// bgColor={'#171717'}
					// border={'1px solid #2C2C2C'}
					rounded={6}>
					<Flex justify={'space-between'} mb={5}>
						{/* Asset Name */}
						<Flex gap={2}>
							<Box mt={2}>
								<Image
									src={'/' + inputToken()?.symbol + '.png'}
									height={'50px'}
									width={'50px'}
									style={{
										maxHeight: '50px',
										maxWidth: '50px',
									}}
									alt={inputToken()?.symbol}
								/>
							</Box>

							<Box mb={3}>
								<Text fontSize="3xl" fontWeight={'bold'}>
									{inputToken()?.symbol}/
									{outputToken()?.symbol}
								</Text>
								<Text
									mb={3}
									fontSize="md"
									display={'flex'}
									alignItems="center"
									gap={1}>
									{inputToken()
										?.name.split(' ')
										.slice(1)
										.join(' ')}{' '}
									<BsArrowRightCircle />{' '}
									{outputToken()
										?.name.split(' ')
										.slice(1)
										.join(' ')}
								</Text>
							</Box>
						</Flex>
						{/* Asset Price */}
						<Box>
							<Flex flexDir={'column'} align={'end'} gap={1}>
								<Text fontSize={'3xl'} fontWeight="bold">
									{tokenFormatter.format(
										inputToken()?.price /
											outputToken()?.price
									)}
								</Text>
								<Text fontSize={'sm'}>
									{outputToken()?.symbol}/
									{inputToken()?.symbol}
								</Text>
							</Flex>
						</Box>
					</Flex>
					<TradingChart
						input={
							(pools[tradingPool].poolSynth_ids ?? synths)[
								inputAssetIndex
							]?.symbol
						}
						output={
							(pools[tradingPool].poolSynth_ids ?? synths)[
								outputAssetIndex
							]?.symbol
						}
					/>

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
						bgColor={'primary'}
						onClick={exchange}
						disabled={loading || !isConnected || inputAmount <= 0}
						loadingText="Sign the transaction in your wallet"
						isLoading={loading}
						_hover={{ bg: 'gray.600' }}
						color="#171717">
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
				</Box>
			)}
		</>
	);
}

export default Swap;
