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
import { useContext } from 'react';
import { WalletContext } from '../WalletContextProvider';

const RepayModal = ({ asset }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loader, setloader] = React.useState(false)
	const [hash, sethash] =  React.useState("")
	const [repayerror,setrepayerror] = React.useState("")
	const [repayconfirm, setrepayconfirm] = React.useState(false)
	const [amount, setAmount] = React.useState(0);

	const _onClose = () => {
		setAmount(0);
		setrepayerror("");
		setrepayconfirm(false);
		sethash("");
		setloader(false);
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
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount*10**asset['decimal']).toString();
		setloader(true)
		setrepayerror("");
		setrepayconfirm(false);
		system.methods.repay(asset['synth_id'], value)
		.send({
			value, 
			// shouldPollResponse:true
			feeLimit: 1000000000
		}, (error: any, hash: any) => {
			if(error){
				if(error.output) {
					if(error.output.contractResult){
						setrepayerror((window as any).tronWeb.toAscii(error.output.contractResult[0]));
					} else {
						setrepayerror("Errored. Please try again");
					}
				} else {
					setrepayerror(error.error);
				}
				setloader(false)
			}
			if(hash){
				console.log("hash", hash);
				sethash(hash)
				if(hash){
					setloader(false)
					setrepayconfirm(true)
				}
			}
		})
	}
	const {isConnected, tronWeb }= useContext(WalletContext);

	return (
		<Box>
			<IconButton 
			// disabled={!isConnected} 
			variant="ghost" onClick={onOpen} icon={<BiMinusCircle size={35} color="gray"/>} aria-label={''} isRound={true}>
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
							disabled={!isConnected || !amount || amount == 0 || amount > max()}
							isLoading={loader} colorScheme={"red"} width="100%" mt={4} onClick={issue}
						>
							{isConnected? (amount > max()) ? <>Insufficient Debt</> : (!amount || amount == 0) ?  <>Enter amount</> : <>Repay</> : <>Please connect your wallet</>} 
						</Button>
						{loader &&<Flex alignItems={"center"} flexDirection={"row"} justifyContent="center" mt="1.5rem">
							
							<Box >
								<Text fontFamily={"Roboto"} fontSize="md"> Waiting for the blockchain to confirm your transaction. 
								<Link color="blue.200" fontSize={"sm"} href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">{' '}View on Tronscan</Link ></Text>
							</Box>
						</Flex>}
						{repayerror && <Text textAlign={"center"} color="red">{repayerror}</Text>}
							{repayconfirm && <Flex flexDirection={"column"} mt="1rem" justifyContent="center" alignItems="center">
								<Text fontFamily={"Roboto"} textAlign={"center"}>Transaction Successful</Text>
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


export default RepayModal;
