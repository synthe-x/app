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
	InputGroup,Spinner,Link
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

import { BsPlusCircle } from 'react-icons/bs';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getAddress, getContract } from '../../src/utils';
import { useEffect } from 'react';


const DepositModal = ({ asset, balance }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);
	const [loader, setloader] = React.useState(false)
	const [hash, sethash] =  React.useState("")
	const [depositerror,setdepositerror] = React.useState("")
	const [depositconfirm, setdepositconfirm] = React.useState(false)
	const [tryApprove, setTryApprove] = React.useState<string|boolean>("null");

	const changeAmount = (event: any) =>{
		setAmount(event.target.value);
	}
	const setMax = () =>{
		setAmount(balance);
	}
	const issue = async () => {
		if(!amount) return
		let system = await getContract('System');
		let value = BigInt(amount*10**asset['decimal']).toString();
		setloader(true)
		setdepositerror("");
		setdepositconfirm(false);
		system.methods.deposit(asset['coll_address'], value)
		.send({value, 
			// shouldPollResponse:true
		}, (error: any, hash: any) => {
			if(error){
				if(error.output) {
					if(error.output.contractResult){
						setdepositerror((window as any).tronWeb.toAscii(error.output.contractResult[0]));
					} else {
						setdepositerror("Errored. Please try again");
					}
				} else {
					setdepositerror(error.error);
				}
				setloader(false)
			}
			if(hash){
				sethash(hash)
				if(hash){
					setloader(false)
					setdepositconfirm(true)
				}
			}
		})
	}

	const approve = async () => {
		let collateral = await getContract('CollateralERC20', asset['coll_address']);
		collateral.approve(getAddress("System"), "100000000000000000000000000000000").send({}, (error: any, hash: any) => {
			if(error){
				console.log(error)
			}
			if(hash){
				setTryApprove(false);
			}
		})
	}

	const allowanceCheck = async () => {
		let collateral = await getContract("CollateralERC20", asset['coll_address']);
		let allowance = await collateral.methods.allowance((window as any).tronWeb.defaultAddress.base58, getAddress("System")).call()
		allowance = (allowance.div((10**asset['decimal']).toString()).toString())
		console.log(allowance, balance);
		if(allowance.length < 10){
			if(parseInt(allowance) <= balance){
				setTryApprove(true)
			} else{
				setTryApprove(false)
			}
		} else {
			setTryApprove(false)
		}
	}

	useEffect(() => {
		if(tryApprove == "null") allowanceCheck();
	})

	return (
		<Box>
			<IconButton variant="ghost" onClick={onOpen} icon={<BsPlusCircle size={30} />} aria-label={''} isRound={true}>
			</IconButton>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent width={'30rem'} height="30rem">
					<ModalCloseButton />
                    <ModalHeader>Deposit {asset['symbol']} as collateral</ModalHeader>
					{/* {tryApprove} */}
					<ModalBody>
					<InputGroup size='md'>
						<Input
							type="number"
								placeholder='Enter amount'
								onChange={changeAmount}
								value={amount}
								disabled={tryApprove as boolean}
							/>
							
							<InputRightElement width='4.5rem'>
								<Button h='1.75rem' size='sm' mr={1} onClick={setMax}
								disabled={tryApprove as boolean}
								>
									Set Max
								</Button>
							</InputRightElement>
						</InputGroup>
						<Flex mt={4} justify="space-between">
							<Text fontSize={"xs"} color="gray.400" >1 {asset['symbol']} = {(asset['price'])} USD</Text>
						</Flex>
						
						{!tryApprove ? <Button colorScheme={"whatsapp"} width="100%" mt={4} onClick={issue}>Deposit</Button> 
						: <Button colorScheme={"orange"} width="100%" mt={4} onClick={approve}>Approve {asset['symbol']}</Button>}

						{loader && <Flex alignItems={"center"} flexDirection={"row"} justifyContent="center" mt="1rem">
							<Box>
								<Spinner
									thickness='4px'
									speed='0.65s'
									emptyColor='gray.200'
									color='blue.500'
									size='xl'
								/>
							</Box>

							<Box ml="0.5rem">
								<Text fontFamily={"Roboto"} fontSize="sm"> Waiting for the blockchain to confirm your transaction... </Text>
								<Link color="blue.200" fontSize={"xs"} href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">View on Tronscan</Link >
							</Box>
						</Flex>}
						{depositerror && <Text textAlign={"center"} color="red">{depositerror}</Text>}
						{depositconfirm && <Flex flexDirection={"column"} mt="1rem" justifyContent="center" alignItems="center">
							<Text fontFamily={"Roboto"} textAlign={"center"}>Transaction Submitted</Text>
							<Box>
							<Link fontSize={"sm"} color="blue.200" href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">View on Tronscan</Link >
							</Box>

						</Flex>}

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


export default DepositModal;
