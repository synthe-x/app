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
	InputGroup,Spinner,Link, Select
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


const EnterPool = ({assets, pool, poolIndex}: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);
	const [loader, setloader] = React.useState(false);
	const [hash, sethash] = React.useState('');
	const [depositerror, setdepositerror] = React.useState('');
	const [depositconfirm, setdepositconfirm] = React.useState(false);
	const [inputPoolIndex, setInputPoolIndex] = React.useState(0);
	const [outputPoolIndex, setOutputPoolIndex] = React.useState(1);
    const [activeAssetIndex, setActiveAssetIndex] = React.useState(0);

	const _onClose = () => {
		setAmount(0);
		sethash('');
		setdepositerror('');
		setdepositconfirm(false);
		onClose();
	}

	const {
		isConnected,
		pools,
		tronWeb
	} = useContext(WalletContext);

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
		let _amount = assets[assetIndex].amount[inputPoolIndex] > assets[assetIndex].walletBalance ? assets[assetIndex].walletBalance : assets[assetIndex].amount[inputPoolIndex];
		setAmount(_amount / 10 ** assets[assetIndex].decimal);
	};

	const changeAsset = (event: any) => {
		setActiveAssetIndex(event.target.value);
	}
	
	const transfer = async () => {
		if (!amount) return;
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount * 10 ** (pool.poolSynth_ids[activeAssetIndex]['decimal'] ?? 18)).toString();
		setloader(true);
		setdepositerror('');
		setdepositconfirm(false);

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
			}, (error: any, hash: any) => {
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


	return (
		<>{
		pool.poolSynth_ids ? <Box>

			<Button my={2} size="lg" bgColor={"#0CAD4B"} color="white" onClick={onOpen} aria-label={''} width={"100%"} 
			// disabled={!isConnected} 
			_hover={{bg: "gray.600"}}>
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
							disabled={!isConnected || !amount || amount == 0}
							isLoading={loader}
							colorScheme={'whatsapp'}
							width="100%"
							mt={4}
							onClick={transfer}
							
							>
							{isConnected? (!amount || amount == 0) ? <>Enter amount</> : <>Enter Pool</> : <>Please connect your wallet</>} 
						</Button>

						{loader && (
					<Flex
						alignItems={'center'}
						flexDirection={'row'}
						justifyContent="center"
						mt="1.5rem"
                        rounded={8}
                        py={4}
                        >

						<Box >
								<Text fontFamily={"Roboto"} fontSize="md"> Waiting for the blockchain to confirm your transaction. 
								<Link color="blue.200" fontSize={"sm"} href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">{' '}View on Tronscan</Link ></Text>
							</Box>
					</Flex>
				)}
				{depositerror && (
					<Text textAlign={'center'} color="red"
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
                        py={4}
                        >
						<Text fontFamily={'Roboto'} textAlign={'center'} fontSize="sm">
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
		</Box> : <>Loading</>}</>
	);
};


export default EnterPool;
