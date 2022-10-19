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
import { getContract } from '../../src/utils';


const DepositModal = ({ asset, collateralBalance, minCRatio, cRatio }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loader, setloader] = React.useState(false)
	const [hash, sethash] =  React.useState("")
	const [issueerror,setissueerror] = React.useState("")
	const [issueconfirm, setissueconfirm] = React.useState(false)
	const [amount, setAmount] = React.useState(0);

	const changeAmount = (event: any) =>{
		setAmount(event.target.value);
	}

	const setMax = () => {
		// 1/mincRatio * collateralBalance = max amount of debt
		console.log(cRatio*1e18, minCRatio, cRatio*1e18 - minCRatio);
		setAmount(((1e18/(minCRatio)) - 1/cRatio)*collateralBalance/asset['price']);
	}

	// 1/1.69 - 1/1.5 = 0.58823529411764705882352941176471 - 0.66666666666666666666666666666667 = -0.07843137254901960784313725490196 

	const issue = async () => {
		if(!amount) return
		let system = await getContract('System');
		let value = BigInt(amount*10**asset['decimal']).toString();
		setloader(true)
		setissueerror("");
		setissueconfirm(false);
		system.methods.borrow(asset['synth_id'], value)
		.send({value, 
			// shouldPollResponse:true
		}, (error: any, hash: any) => {
			if(error){
				if(error.output) {
					if(error.output.contractResult){
						setissueerror((window as any).tronWeb.toAscii(error.output.contractResult[0]));
					} else {
						setissueerror("Errored. Please try again");
					}
				} else {
					setissueerror(error.error);
				}
				setloader(false)
			}
			if(hash){
				console.log("hash", hash);
				sethash(hash)
				if(hash){
					setloader(false)
					setissueconfirm(true)
				}
			}
		})
	}

	return (
		<Box>
			<IconButton variant="ghost" onClick={onOpen} icon={<BsPlusCircle size={30} />} aria-label={''} isRound={true}>
			</IconButton>
			<Modal isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent width={'30rem'} height="30rem">
					<ModalCloseButton />
                    <ModalHeader>Issue {asset['symbol']}</ModalHeader>
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
							<Text fontSize={"xs"} color="gray.400" >Stability Fee = {(parseFloat(asset['apy'])*100).toFixed(2)}% / Year</Text>
                        </Flex>
                        <Button colorScheme={"whatsapp"} width="100%" mt={4} onClick={issue}>Issue</Button>
						{loader &&<Flex alignItems={"center"} flexDirection={"row"} justifyContent="center" mt="1rem">
							<Box>
							<Spinner
								thickness='4px'
								speed='0.65s'
								emptyColor='gray.200'
								color='blue.500'
								size='xl'
							/></Box>
							<Box ml="0.5rem">
								<Text fontFamily={"Roboto"}> Waiting for the blockchain to confirm your transaction... </Text>
								<Link color="blue.200" href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">View on Tronscan</Link >
							</Box>
						</Flex>}
						{issueerror && <Text textAlign={"center"} color="red">{issueerror}</Text>}
							{issueconfirm && <Flex flexDirection={"column"} mt="1rem" justifyContent="center" alignItems="center">
								<Text fontFamily={"Roboto"} textAlign={"center"}>Transaction Successful</Text>
								<Box>
									<Link color="blue.200" href={`https://nile.tronscan.org/#/transaction/${hash}`} target="_blank" rel="noreferrer">View on Tronscan</Link >
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
