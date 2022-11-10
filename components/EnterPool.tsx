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

	const { isConnected, tronWeb } = useContext(WalletContext);
	const { pools } = useContext(AppDataContext);

	const changeAmount = (event: any) => {
		if(event.target.value < 0) {
			return;
		}
		setAmount(event.target.value);
	};
	
	const setMax = () => {
		let assetIndex = 0;
		for(let i in assets){
			if(assets[i].synth_id == pool.poolSynth_ids[activeAssetIndex].synth_id){
				assetIndex = Number(i);
				break;
			}
		}
		let _amount = Math.min(assets[assetIndex].amount[inputPoolIndex], assets[assetIndex].walletBalance);
		setAmount(0.999 * _amount / 10 ** assets[assetIndex].decimal);
	};

	const changeAsset = (event: any) => {
		setActiveAssetIndex(event.target.value);
	}
	
	const transfer = async () => {
		if (!amount) return;
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount * 10 ** (pool.poolSynth_ids[activeAssetIndex]['decimal'] ?? 18)).toString();
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
		
		system.methods.enterPool(poolIndex, pool.poolSynth_ids[activeAssetIndex]['synth_id'], value)
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


	return (
		<>{
		pool.poolSynth_ids ? <Box>

			<Button my={2} size="md" bgColor={"primary"} color="#171717" onClick={onOpen} aria-label={''} width={"100%"} _hover={{bg: "gray.600"}}>
                Enter Pool
			</Button>
            
			<Modal isCentered isOpen={isOpen} onClose={_onClose}>
                <ModalOverlay
                    bg='blackAlpha.100'
                    backdropFilter='blur(30px)'
                />
				<ModalContent width={'30rem'} >
					<ModalCloseButton />
					<ModalHeader>Enter {pool.poolSynth_ids[activeAssetIndex]['name'].split(" ").slice(1).join(" ")}</ModalHeader>
					<ModalBody>
						<Select disabled>
									<option >
										My Wallet
									</option>
						</Select>
                        <Flex>
						<InputGroup size="md" >
							<Input
								type="number"
								placeholder={`Enter ${pool.poolSynth_ids[activeAssetIndex]['symbol']} amount`}
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
                            {pool.poolSynth_ids.map((asset: any, index: number) => {
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

						<Box width={"100%"} border="1px" px="3" py={2} rounded={5} borderColor="gray.100">
									<Text color={"gray"}>
										{pool.name}
									</Text>
						</Box>

						<Flex mt={4} justify="space-between">
							<Text fontSize={'xs'} color="gray.400">
								1 {pool.poolSynth_ids[activeAssetIndex]['symbol']} = {pool.poolSynth_ids[activeAssetIndex]['price']} USD
							</Text>
						</Flex>

						<Button
							disabled={loading || !isConnected || !amount || amount == 0}
							isLoading={loading}
							loadingText='Please sign the transaction'
							bgColor='#3EE6C4'
							width="100%"
							mt={4}
							onClick={transfer}
							>
							{isConnected? (!amount || amount == 0) ? <>Enter amount</> : <>Enter Pool</> : <>Please connect your wallet</>} 
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
