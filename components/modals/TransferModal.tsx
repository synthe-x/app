import React, { useContext } from 'react';
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
	Select,
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

import { BsArrowDown } from 'react-icons/bs';
import { AiOutlineInfoCircle, AiOutlineSwap } from 'react-icons/ai';
import { getAddress, getContract } from '../../src/utils';
import { useEffect } from 'react';
import { WalletContext } from '../WalletContextProvider';

const TransferModal = ({ asset }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);
	const [loader, setloader] = React.useState(false);
	const [hash, sethash] = React.useState('');
	const [depositerror, setdepositerror] = React.useState('');
	const [depositconfirm, setdepositconfirm] = React.useState(false);
	const [inputPoolIndex, setInputPoolIndex] = React.useState(0);
	const [outputPoolIndex, setOutputPoolIndex] = React.useState(1);

	const {
		isConnected,
		isConnecting,
		address,
		connect,
		synths,
		totalDebt,
		isDataReady,
		tradingPool,
		setTradingPool,
		pools,
		poolUserData,
		tronWeb
	} = useContext(WalletContext);

	const changeAmount = (event: any) => {
		setAmount(event.target.value);
	};
	const setMax = () => {
		setAmount(max());
	};

	const max = () => {
		if(asset.amount) return 0.999 * asset.amount[inputPoolIndex] / 10 ** asset.decimal
		return 0.999 * asset.balance / 10 ** (asset.decimal ?? 18) ?? 0
	} 

	const transfer = async () => {
		if (!amount) return;
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount * 10 ** (asset['decimal'] ?? 18)).toString();
		setloader(true);
		setdepositerror('');
		setdepositconfirm(false);
		console.log(inputPoolIndex, outputPoolIndex);
		let tx =
			inputPoolIndex == 0
				? system.methods.enterPool(
						outputPoolIndex,
						asset['synth_id'],
						value
				  )
				: system.methods.exitPool(
						inputPoolIndex,
						asset['synth_id'],
						value
				  );
				
		
		tx.send(
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

	const inputPoolChange = (event: any) => {
		if (outputPoolIndex == event.target.value) {
			setOutputPoolIndex(inputPoolIndex);
		}
		if (inputPoolIndex != 0) {
			setOutputPoolIndex(0);
		}
		console.log(event.target.value);
		setInputPoolIndex(event.target.value);
	};

	const outputPoolChange = (event: any) => {
		if (inputPoolIndex == event.target.value) {
			setInputPoolIndex(outputPoolIndex);
		}
		if (outputPoolIndex != 0) {
			setInputPoolIndex(0);
		}
		setOutputPoolIndex(event.target.value);
	};


	return (
		<Box>
			<IconButton
			disabled={!isConnected}
				variant="ghost"
				onClick={onOpen}
				icon={<AiOutlineSwap color="gray" />}
				aria-label={''}
				isRound={true}
				mr={-3}
				height={'24px'}></IconButton>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent width={'30rem'}>
					<ModalCloseButton />
					<ModalHeader>Transfer {asset['symbol']}</ModalHeader>
					<ModalBody>
						<Select
							value={inputPoolIndex}
							onChange={inputPoolChange}
							disabled={!isConnected}>
							{pools.map((pool: any, index) => {
								return (
									<option key={index} value={index}>
										{pool.name}
									</option>
								);
							})}
						</Select>
						<InputGroup size="md">
							<Input
							disabled={!isConnected}
								type="number"
								placeholder={`Enter ${asset['symbol']} amount`}
								onChange={changeAmount}
								value={amount}
							/>

							<InputRightElement width="4.5rem">
								<Button
								disabled={!isConnected}
									h="1.75rem"
									size="sm"
									mr={1}
									onClick={setMax}>
									Set Max
								</Button>
							</InputRightElement>
						</InputGroup>

						<Box my={5}>
							<BsArrowDown />
						</Box>

						<Select
						disabled={!isConnected}
							value={outputPoolIndex}
							onChange={outputPoolChange}>
							{pools.map((pool: any, index) => {
								return (
									<option key={index} value={index}>
										{pool.name}
									</option>
								);
							})}
						</Select>

						<Flex mt={4} justify="space-between">
							<Text fontSize={'xs'} color="gray.400">
								1 {asset['symbol']} = {asset['price']} USD
							</Text>
						</Flex>

						<Button
							disabled={!isConnected || !amount || amount == 0 || amount > max()}
							colorScheme={'whatsapp'}
							width="100%"
							mt={4}
							onClick={transfer}>
							{isConnected? (amount > max()) ? <>Insufficient Collateral</> : (!amount || amount == 0) ?  <>Enter amount</> : <>Transfer<AiOutlineSwap /></> : <>Please connect your wallet</>}
						</Button>

						{loader && (
							<Flex
								alignItems={'center'}
								flexDirection={'row'}
								justifyContent="center"
								mt="1.5rem"
								rounded={8}
								py={4}>
								{/* <Box>
							<Spinner
								thickness="10px"
								speed="0.65s"
								emptyColor="gray.200"
								color="green.500"
								size="xl"
                                mr={4}
							/>
						</Box> */}

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
							<Text
								textAlign={'center'}
								color="red"
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

export default TransferModal;
