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
	InputGroup,Spinner,Link, AlertIcon, Alert
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

import { BiMinusCircle } from 'react-icons/bi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getContract } from '../../src/utils';
import { useContext } from 'react';
import { WalletContext } from '../WalletContextProvider';
import axios from 'axios';

const RepayModal = ({ asset, handleRepay }: any) => {
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
	}

	const changeAmount = (event: any) =>{
		setAmount(event.target.value);
	}

	const setMax = () =>{
		setAmount(max());
	}

	const max = () => {
		return 0.999 * Math.min(asset.amount[0], asset['walletBalance'])/1e18;
	}

	const issue = async () => {
		if(!amount) return
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount*10**asset['decimal']).toString();
		system.methods.repay(asset['synth_id'], value)
		.send({
			value, 
			// shouldPollResponse:true
			feeLimit: 1000000000
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
	}

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
						handleRepay(asset['synth_id'], BigInt(amount*10**asset['decimal']).toString())
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

	const {isConnected, tronWeb }= useContext(WalletContext);

	return (
		<Box>
			<IconButton 
			// disabled={!isConnected} 
			variant="ghost" onClick={onOpen} icon={<BiMinusCircle size={20} color="gray"/>} aria-label={''} isRound={true} bgColor='white' size={'sm'} my={1}>
			</IconButton>
			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
				<ModalOverlay bg='blackAlpha.100'
                    backdropFilter='blur(30px)' />
				<ModalContent width={'30rem'}>
					<ModalCloseButton />
                    <ModalHeader>Repay {asset['symbol']}</ModalHeader>
					<ModalBody>
					<InputGroup size='md'>
						<Input
							type="number"
							placeholder='Enter amount'
							onChange={changeAmount}
							value={amount}
						/>
						<InputRightElement width='4.5rem'>
							<Button h='1.75rem' size='sm' mr={1} onClick={setMax}>
								Set Max
							</Button>
						</InputRightElement>
						</InputGroup>
                        <Flex mt={4} justify="space-between">
						<Text fontSize={"xs"} color="gray.400" >1 {asset['symbol']} = {(asset['price'])} USD</Text>
                        </Flex>
                        <Button 
							disabled={loading || !isConnected || !amount || amount == 0 || amount > max()}
							isLoading={loading} colorScheme={"red"} width="100%" mt={4} onClick={issue}
							loadingText='Please sign the transaction'
						>
							{isConnected? (amount > max()) ? <>Insufficient Debt</> : (!amount || amount == 0) ?  <>Enter amount</> : <>Repay</> : <>Please connect your wallet</>} 
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
                        <Text ml="2"> 
                            More Info
                            </Text>
                        </ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};


export default RepayModal;
