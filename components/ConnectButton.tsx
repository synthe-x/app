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

import { WalletContext } from './WalletContextProvider';
import { AppDataContext } from './AppDataProvider';
import { Avatar } from '@chakra-ui/react';
import { MdCopyAll, MdLogout } from 'react-icons/md';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {ChainID} from "../src/chains"

const ConnectButton = ({}) => {
	const { isConnected, isConnecting, address, connect, tronWeb, disconnect } = useContext(WalletContext);
	const { isDataReady, isFetchingData, fetchData } = useContext(AppDataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure();

	const _connect = (chain: ChainID) => {
		connect(chain, (_address: string|null, _err: string) => {
			if(!isDataReady && !isFetchingData && _address) {
				fetchData(chain, tronWeb, _address)
			}
		});
		onConnectClose();
	}

	const _copy = () => {
		navigator.clipboard.writeText(address as string)
	}

	const _disconnect = () => {
		if(isConnected){
			disconnect();
		}
		onClose();
	}

	return (
		<Box>
			{isConnected ? (
				<Box>
					<Button bgColor={"#0CAD4B"} color="gray.100" size="sm" _hover={{ bg: 'transparent' }} onClick={onOpen}>{address?.slice(0, 6) + "..." + address?.slice(-4)}</Button>
				</Box>
			) : (
				<Button
					bgColor={'#0CAD4B'}
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
							{(address)?.slice(0, 5)+"...."+(address)?.slice(-5)}
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
				// maxW={'38rem'}
				maxW={'29rem'}
				pt={0}
				pb={2}
				rounded={20}
				>
					{/* <ModalCloseButton rounded={20} bgColor="gray.100" m={2}/> */}
					<ModalBody>
					<Text fontSize={"lg"} fontWeight="bold" mb={5} mt={1}>Choose a network</Text>
						<Flex gap={5}>
							<Button display={"flex"} bgColor={"red"} minW={"125px"} height={"125px"} rounded="20" _hover={{"bg": "gray.600"}} onClick={() => _connect(ChainID.NILE)}>
								<Image src='/tron-outline.png' width={55} height={55} alt="tronlogo" />
							</Button>
							{/* <Button bgColor={"#101820"} minW={"125px"} height={"125px"} rounded="20" _hover={{"bg": "gray.600"}} onClick={() => _connect(ChainID.AURORA)}>
								<Image src='/aurora.png' width={50} height={50} alt="auroralogo" />
							</Button> */}
							<Button bgGradient="linear(to-tr, #0ABEF3, #88F1CB)" minW={"125px"} height={"125px"} rounded="20" _hover={{bg: 'gray.700'}} onClick={() => _connect(ChainID.HARMONY)}>
								<Image src='/harmony-one-logo.png' width={50} height={50} alt="onelogo" />
							</Button>
							<Button bgColor={'black'} minW={"125px"} height={"125px"} rounded="20" disabled _hover={{bg: 'gray.700'}}>
								<Flex flexDir={"column"} align="center" justify={"center"} gap={0}>
									<Text color={"gray.100"} fontSize="xs">Coming Soon</Text>
									<Image src='/BTT.png' width={70} height={70} alt="bttlogo" />
								</Flex>
							</Button>
							
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default ConnectButton;
