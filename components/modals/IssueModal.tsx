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
	Progress,
	Image,
	Alert,
	AlertIcon
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
import axios from 'axios';

import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getContract } from '../../src/utils';
import { useContext } from 'react';
import { WalletContext } from '../WalletContextProvider';
import { BiPlusCircle } from 'react-icons/bi';
import { AppDataContext } from '../AppDataProvider';

const DepositModal = ({ asset, handleIssue }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [hash, setHash] = useState(null);
	const [confirmed, setConfirmed] = useState(false);

	const [amount, setAmount] = React.useState(0);

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

	const { safeCRatio, totalCollateral, cRatio, availableToBorrow } = useContext(AppDataContext);

	const setMax = () => {
		// 1/mincRatio * collateralBalance = max amount of debt
		setAmount(max());
	};

	const max = () => {
		return (0.999 * availableToBorrow()) / asset.price
	}

	// 1/1.69 - 1/1.5 = 0.58823529411764705882352941176471 - 0.66666666666666666666666666666667 = -0.07843137254901960784313725490196
	const issue = async () => {
		if (!amount) return;
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');

		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount * 10 ** asset['decimal']).toString();
		system.methods.borrow(asset['synth_id'], value).send(
			{
				value,
				// shouldPollResponse:true
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

	const {isConnected, tronWeb} = useContext(WalletContext)

	return (
		<Box>
			{/* <IconButton
			// disabled={!isConnected}
				variant="ghost"
				onClick={onOpen}
				icon={<BiPlusCircle size={35} color="gray" />}
				aria-label={''}
				isRound={true}></IconButton> */}


				<Button disabled={!isConnected} onClick={onOpen} variant={'ghost'} size='sm' bgColor={'secondary'} rounded={100} color="white" my={1} _hover={{bgColor: 'gray.700'}}>
				<Text mr={1}>Borrow</Text> <BiPlusCircle size={20} /> 
				</Button>
				<Modal isCentered isOpen={isOpen} onClose={_onClose}>
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent width={'30rem'} bgColor="">
					<ModalCloseButton />
					<ModalHeader>Issue {asset['symbol']}</ModalHeader>
					<ModalBody>
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
							/>
							<InputRightElement width="4.5rem">
								<Button
									h="1.75rem"
									size="sm"
									mr={1}
									onClick={setMax}>
									Set Max
								</Button>
							</InputRightElement>
						</InputGroup>
						<Flex mt={4} justify="space-between">
							<Text fontSize={'xs'} color="gray.400">
								1 {asset['symbol']} = {asset['price']} USD
							</Text>
							<Text fontSize={'xs'} color="gray.400">
								Stability Fee ={' '}
								{(parseFloat(asset['apy']) * 100).toFixed(2)}% /
								Year
							</Text>
						</Flex>
						<Button
							disabled={loading || !isConnected || !amount || amount == 0 || amount > max()}
							isLoading={loading}
							loadingText='Please sign the transaction'
							colorScheme={'whatsapp'}
							width="100%"
							mt={4}
							onClick={issue}>
							{isConnected? (amount > max()) ? <>Insufficient Collateral</> : (!amount || amount == 0) ?  <>Enter amount</> : <>Issue</> : <>Please connect your wallet</>} 
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
