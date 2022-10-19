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

import { BiMinusCircle } from 'react-icons/bi';

import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getContract } from '../../src/utils';


const WithdrawModal = ({ asset, balance }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [amount, setAmount] = React.useState(0);
	const [loader, setloader] = React.useState(false)
	const [hash, sethash] =  React.useState("")
	const [withdrawerror,setwithdrawerror] = React.useState("")
	const [withdrawconfirm, setwithdrawconfirm] = React.useState(false)

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
		setwithdrawerror("");
		setwithdrawconfirm(false);
		system.methods.withdraw(asset['coll_address'], value)
		.send({value, 
			// shouldPollResponse:true
		}, (error: any, hash: any) => {
			if(error){
				if(error.output) {
					if(error.output.contractResult){
						setwithdrawerror((window as any).tronWeb.toAscii(error.output.contractResult[0]));
					} else {
						setwithdrawerror("Errored. Please try again");
					}
				} else {
					setwithdrawerror(error.error);
				}
				setloader(false)
			}
			if(hash){
				console.log("hash", hash);
				sethash(hash)
				if(hash){
					setloader(false)
					setwithdrawconfirm(true)
				}
			}
		})
	}

	return (
		<Box>
			<IconButton variant="ghost" onClick={onOpen} icon={<BiMinusCircle size={37} />} aria-label={''} isRound={true}>
			</IconButton>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent width={'30rem'} height="30rem">
					<ModalCloseButton />
                    <ModalHeader>Withdraw {asset['symbol']}</ModalHeader>
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
                        <Button colorScheme={"whatsapp"} width="100%" mt={4} onClick={issue}>Withdraw</Button>
					
						{loader &&<Flex alignItems={"center"} flexDirection={"row"} justifyContent="center" mt="1rem">
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
								<Text fontFamily={"Roboto"}> Waiting for the blockchain to confirm your transaction... </Text>
								<Link color="blue.200" href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">View on Tronscan</Link >
							</Box>
						</Flex>}
						{withdrawerror && <Text textAlign={"center"} color="red">{withdrawerror}</Text>}
							{withdrawconfirm && <Flex flexDirection={"column"} mt="1rem" justifyContent="center" alignItems="center">
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


export default WithdrawModal;
