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
	InputGroup,
	Spinner,
	Link,
	Progress,
	Image
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

import { AiOutlineInfoCircle } from 'react-icons/ai';
import { getContract } from '../../src/utils';
import { useContext } from 'react';
import { WalletContext } from '../WalletContextProvider';
import { BiPlusCircle } from 'react-icons/bi';

const DepositModal = ({ asset, handleIssue }: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loader, setloader] = React.useState(false);
	const [hash, sethash] = React.useState('');
	const [issueerror, setissueerror] = React.useState('');
	const [issueconfirm, setissueconfirm] = React.useState(false);
	const [amount, setAmount] = React.useState(0);

	const _onClose = () => {
		setissueerror('');
		setissueconfirm(false);
		setAmount(0);
		sethash('');
		setloader(false);
		onClose();
	};

	const changeAmount = (event: any) => {
		setAmount(event.target.value);
	};

	const { safeCRatio, totalCollateral, cRatio, availableToBorrow } = useContext(WalletContext);

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
		let system = await getContract(tronWeb, 'System');
		let value = BigInt(amount * 10 ** asset['decimal']).toString();
		setloader(true);
		setissueerror('');
		setissueconfirm(false);
		system.methods.borrow(asset['synth_id'], value).send(
			{
				value,
				// shouldPollResponse:true
				feeLimit: 1000000000,
			},
			(error: any, hash: any) => {
				if (error) {
					if (error.output) {
						if (error.output.contractResult) {
							setissueerror(
								(window as any).tronWeb.toAscii(
									error.output.contractResult[0]
								)
							);
						} else {
							setissueerror('Errored. Please try again');
						}
					} else {
						setissueerror(error.error);
					}
					setloader(false);
				}
				if (hash) {
					console.log('hash', hash);
					sethash(hash);
					if (hash) {
						setloader(false);
						setissueconfirm(true);
						handleIssue(asset['synth_id'], value);
					}
				}
			}
		);
	};
	const {isConnected, tronWeb} = useContext(WalletContext)

	return (
		<Box>
			<IconButton
			// disabled={!isConnected}
				variant="ghost"
				onClick={onOpen}
				icon={<BiPlusCircle size={35} color="gray" />}
				aria-label={''}
				isRound={true}></IconButton>
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
							disabled={!isConnected || !amount || amount == 0 || amount > max()}
							isLoading={loader}
							colorScheme={'whatsapp'}
							width="100%"
							mt={4}
							onClick={issue}>
							{isConnected? (amount > max()) ? <>Insufficient Collateral</> : (!amount || amount == 0) ?  <>Enter amount</> : <>Issue</> : <>Please connect your wallet</>} 
						</Button>
						{loader && (
							<Flex
								alignItems={'center'}
								flexDirection={'column'}
								justifyContent="center"
								mt="1.5rem"
								gap={8}>
								
								<Box ml="0.5rem">
									<Text fontFamily={'Roboto'} fontSize="md">
										{' '}
										Waiting for the blockchain to confirm
										your transaction.
										<Link
											color="blue.200"
											href={`https://nile.tronscan.org/#/transaction/${hash}`}
											target="_blank"
											rel="noreferrer"
											fontSize={'sm'}>
											{' '}
											View on Tronscan
										</Link>
									</Text>
								</Box>
								{/* <PacmanLoader color='#B3B3B3'/> */}
							</Flex>
						)}
						{issueerror && (
							<Text textAlign={'center'} color="red">
								{issueerror}
							</Text>
						)}
						{issueconfirm && (
							<Flex
								flexDirection={'column'}
								mt="1rem"
								justifyContent="center"
								alignItems="center">
								<Text
									fontFamily={'Roboto'}
									textAlign={'center'}>
									Transaction Successful
								</Text>
								<Box>
									<Link
										color="blue.200"
										fontSize={'sm'}
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

export default DepositModal;
