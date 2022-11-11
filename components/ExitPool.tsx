import React, { useContext, useState } from 'react';
import {
	Button,
	Box,
	Text,
	Flex,
	useDisclosure,
    Input,
    IconButton,
	InputRightElement,
	InputGroup,Spinner,Link, Select, Alert, AlertIcon
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

import { AiOutlineInfoCircle, AiOutlineSwap } from 'react-icons/ai';
import { getContract } from '../src/utils';
import { BsArrowDown } from 'react-icons/bs';
import { WalletContext } from './WalletContextProvider';
import { AppDataContext } from './AppDataProvider';
import axios from 'axios';


const EnterPool = ({assets, pool, poolIndex}: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);
	
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [hash, setHash] = useState(null);
	const [confirmed, setConfirmed] = useState(false);

	const [inputPoolIndex, setInputPoolIndex] = React.useState(0);
	const [outputPoolIndex, setOutputPoolIndex] = React.useState(1);
    const [activeAssetIndex, setActiveAssetIndex] = React.useState(0);

	const _onClose = () => {
		setLoading(false);
		setResponse(null);
		setHash(null);
		setConfirmed(false);
		setAmount(0);
		onClose();
	}

	const {
		isConnected,
		tronWeb
	} = useContext(WalletContext);

	const {
		updateSynthAmount,
		pools,
	} = useContext(AppDataContext);

	const changeAmount = (event: any) => {
		if(event.target.value < 0) {
			return;
		}
		setAmount(event.target.value);
	};
	const setMax = () => {
        for(let i in pools){
			if(pools[i].pool_address == pool.pool_address){
				poolIndex = i;
				break;
			}
		}
		setAmount(0.999 * assets[activeAssetIndex].amount[poolIndex] / 10 ** assets[activeAssetIndex].decimal);
	};
	const changeAsset = (event: any) => {
		setActiveAssetIndex(event.target.value);
	}
	const transfer = async () => {
		if (!amount) return;
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount * 10 ** assets[activeAssetIndex]['decimal']).toString();
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');

		poolIndex = 0;
		for(let i in pools){
			if(pools[i].pool_address == pool.pool_address){
				poolIndex = i;
				break;
			}
		}
    
		system.methods.exitPool(poolIndex, assets[activeAssetIndex]['synth_id'], value)
		.send(
			{
				value,
                feeLimit: 1000000000,
				// shouldPollResponse:true
			},
		)
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
						handleExchange(assets[activeAssetIndex]['synth_id'], BigInt(amount * 10 ** assets[activeAssetIndex]['decimal']).toString())
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

	const handleExchange = (synth: string, value: string) => {
		updateSynthAmount(synth, poolIndex, value, true);
	}


	return (
		<>{assets[0] ? <Box>
            
			<Button my={2} size="md" onClick={onOpen} aria-label={''} width={"100%"} variant="outline" _hover={{bg: "gray.100"}} bgColor='#fff'>
                Exit Pool
			</Button>
            
			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
                <ModalOverlay
                    bg='blackAlpha.100'
                    backdropFilter='blur(30px)'
                />
				<ModalContent width={'30rem'} height="30rem">
					<ModalCloseButton />
					<ModalHeader>Enter {assets[activeAssetIndex]['symbol']}</ModalHeader>
					<ModalBody>
						

                        <Box width={"100%"} border="1px" px="3" py={2} rounded={5} borderColor="gray.600">
									<Text color={"gray"}>
										{pool.name}
									</Text>
						</Box>

                        <Flex>
						<InputGroup size="md"  >
							<Input
							// disabled={!isConnected}
								type="number"
								placeholder={`Enter ${assets[activeAssetIndex]['symbol']} amount`}
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
                        <Select width={"40%"} value={activeAssetIndex} onChange={changeAsset}>
                            {assets.map((asset: any, index: number) => {
                                return (
                                    <option key={index} value={index}>
                                        {asset.symbol}
                                    </option>
                                )
                            })}
                        </Select>
                        </Flex>

						<Box my={5}>
							<BsArrowDown />
						</Box>

						<Select disabled>
									<option >
										My Wallet
									</option>
						</Select>

						<Flex mt={4} justify="space-between">
							<Text fontSize={'xs'} color="gray.400">
								1 {assets[activeAssetIndex]['symbol']} = {assets[activeAssetIndex]['price']} USD
							</Text>
						</Flex>

						<Button
							disabled={loading || !isConnected || !amount || amount == 0}
							isLoading={loading}
							loadingText='Please sign the transaction'
							colorScheme={'red'}
							width="100%"
							mt={4}
							onClick={transfer}>
							{isConnected? (!amount || amount == 0) ? <>Enter amount</> : <>Exit Pool</> : <>Please connect your wallet</>} 
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
		</Box> : <>Loading</>}</>
	);
};


export default EnterPool;
