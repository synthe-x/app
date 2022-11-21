import React, { useContext, useEffect, useState } from 'react';
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
	Image,
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
import { AiOutlineDisconnect, AiOutlineInfoCircle } from 'react-icons/ai';

import { WalletContext } from './WalletContextProvider';
import { AppDataContext } from './AppDataProvider';
import { Avatar } from '@chakra-ui/react';
import { BiLogOut } from 'react-icons/bi';
import { MdCopyAll, MdLogout } from 'react-icons/md';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ChainID, chains } from '../src/chains';

const ConnectButton = ({}) => {
	const { isConnected: isTronConnected, isConnecting, address: tronAddress, connect: connectTron, tronWeb, disconnect } = useContext(WalletContext);
	const { isDataReady, isFetchingData, fetchData, chain, setChain } = useContext(AppDataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure();
	const {address: evmAddress, isConnected: isEvmConnected, isConnecting: isEvmConnecting} = useAccount();
	const {connectAsync: connectEvm, connectors} = useConnect();
	const { disconnect: disconnectEvm } = useDisconnect()

	useEffect(() => {
		// setAddress(window.tronWeb.defaultAddress.base58)
	}, []);

	const _connectTron = () => {
		connectTron((_address: string | null, _err: string) => {
			if (!isFetchingData && _address) {
				fetchData(_address, ChainID.NILE);
				setChain(ChainID.NILE);
			}
		});
		onConnectClose();
	};

	const _copy = () => {
		navigator.clipboard.writeText((tronAddress as string) ?? evmAddress)
	}

	const _connectEvm = (chain: number) => {
		connectEvm({chainId: chains[chain].id, connector: connectors[chain]}).then((res) => {
			fetchData(res.account, ChainID.AURORA);
			setChain(ChainID.AURORA);
			localStorage.setItem("address", res.account)
			localStorage.setItem("chain", ChainID.AURORA.toString());
		})
		onConnectClose();
	};

	const _disconnect = () => {
		if(chain == ChainID.NILE) {
			disconnect();
			// reload
			window.location.reload();
		} else {
			localStorage.removeItem("address");
			localStorage.removeItem("chain");
			disconnectEvm();
			window.location.reload();
		}
		onClose();
	};

	return (
		<Box>
			{isTronConnected || isEvmConnected ? (
				<Box>
					<Button bgColor={"secondary"} color="gray.100" size="sm" _hover={{ bg: 'transparent' }} onClick={onOpen}>{(tronAddress ?? evmAddress)?.slice(0, 6) + "..." + (tronAddress ?? evmAddress)?.slice(-4)}</Button>
				</Box>
			) : (
				<Button
					bgColor={'secondary'}
					color="gray.100"
					onClick={onConnectOpen}
					isLoading={isConnecting}
					size="sm"
					_hover={{ bg: 'transparent' }}
          		>
					Connect Wallet
				</Button>
			)}

			<Modal isCentered isOpen={isOpen} onClose={onClose} >
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent width={'23rem'}
				pt="5"
				pb={2}
				rounded={20}
				>
					<ModalCloseButton rounded={20} bgColor="gray.100" m={2}/>
					<ModalBody>
						<Flex flexDir="column" align={"center"} gap={4}>
							<Avatar size={"lg"}/>
							<Text fontSize={"lg"} fontWeight="bold">
							{(tronAddress ?? evmAddress)?.slice(0, 5)+"...."+(tronAddress ?? evmAddress)?.slice(-5)}
							</Text>
							<Flex gap={5} width="100%">
							<Button height={"55px"} width="50%" rounded={10} > <Flex flexDir={"column"} alignItems="center" onClick={_copy}><MdCopyAll/>
								<Text fontSize={"sm"}>Copy Address</Text>
								</Flex> </Button>
								<Button height={"55px"} width="50%" rounded={10} onClick={_disconnect}> <Flex flexDir={"column"} alignItems="center"><MdLogout/>
								<Text fontSize={"sm"}>Disconnect</Text>
								</Flex> </Button>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>

			<Modal isCentered isOpen={isConnectOpen} onClose={onConnectClose} >
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent 
				maxW={'19rem'}
				pt={0}
				pb={2}
				rounded={20}
				>
					{/* <ModalCloseButton rounded={20} bgColor="gray.100" m={2}/> */}
					<ModalBody>
					<Text fontSize={"lg"} fontWeight="bold" mb={5} mt={1}>Choose a network</Text>
						<Flex gap={5}>
							{/* <Button display={"flex"} bgColor={"red"} minW={"125px"} height={"125px"} rounded="20" onClick={_connectTron} _hover={{bgColor: 'gray.800'}}>
								<Image src='/tron-outline.png' width={55} height={55} alt="tronlogo" />
							</Button> */}
							<Button bgColor={"#6FD24D"} height={"125px"} rounded="20" _hover={{bgColor: 'gray.800'}} onClick={() => _connectEvm(0)} minW={'16rem'}>
								{/* <Image src='/aurora.png' width={55} height={55} alt="tronlogo" /> */}
								<Flex
									flexDir={'row'}
									align="center"
									justify={'center'}
									gap={2}>
									<Image
										src="/aurora.png"
										width={70}
										height={70}
										alt="tronlogo"
									/>
									<Box>
									<Text mb={1} fontSize='lg' color={'white'}>Aurora Testnet</Text>
									<Text fontSize={'sm'} color={'white'}>{ChainID.AURORA}</Text>
									</Box>

								</Flex>
							</Button>
							{/* <Button bgColor={'black'} minW={"125px"} height={"125px"} rounded="20" disabled _hover={{bg: 'gray.800'}}>
								<Flex flexDir={"column"} align="center" justify={"center"} gap={0}>

								<Text color={"gray.100"} fontSize="xs">Coming Soon</Text>
								<Image src='/BTT.png' width={70} height={70} alt="tronlogo" />
								</Flex>
							</Button> */}
							{/* <Button bgGradient="linear(to-tr, #0ABEF3, #88F1CB)" minW={"100px"} height={"100px"} rounded="20">
								<Image src='/harmony-one-logo.png' width={35} height={35} alt="tronlogo" />
							</Button> */}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default ConnectButton;
