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

import { WalletContext } from './WalletContextProvider';

const ConnectButton = ({}) => {
	const { isConnected, isConnecting, address, connect } = useContext(WalletContext);

	useEffect(() => {
		// setAddress(window.tronWeb.defaultAddress.base58)
	}, []);

	return (
		<Box>
			{isConnected ? (
				<Box>
					<Button bgColor={"#0CAD4B"} color="gray.100" size="sm" _hover={{ bg: 'transparent' }}>{address?.slice(0, 6) + "..." + address?.slice(-4)}</Button>
				</Box>
			) : (
				<Button
					bgColor={'#0CAD4B'}
					color="gray.100"
					onClick={() => {connect()}}
					isLoading={isConnecting}
					size="sm"
					// clear background
					_hover={{ bg: 'transparent' }}
          		>
					Connect Wallet
				</Button>
			)}
		</Box>
	);
};

export default ConnectButton;
