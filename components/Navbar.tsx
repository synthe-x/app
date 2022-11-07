import {
	Flex,
	Text,
	Box,
	useColorMode,
	Button,
	UnorderedList,
	ListItem,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	Switch,
} from '@chakra-ui/react';

import ConnectButton from './ConnectButton';
import { FaBars } from 'react-icons/fa';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../styles/Home.module.css';
import darklogo from '../public/dark_logo.svg';
import lightlogo from '../public/light_logo.svg';

function NavBar() {
	const [address, setAddress] = useState(null);
	const router = useRouter();
	const { toggleColorMode } = useColorMode();
	const { colorMode } = useColorMode();
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Flex justify={'space-between'} alignItems={'center'}>
				<Box mt={2}>
					<Image
						onClick={() => {
							router.push('/');
						}}
						src={
							// colorMode == "dark" ?
							// darklogo
							//  :
							lightlogo
						}
						alt=""
						width="100px"
						height="70px"
					/>
				</Box>

				<Box display={{ sm: 'none', md: 'block' }}>
					<Flex gap={8}>
							<Link href="/">
								<Text
									my="1rem"
									color={
										router.pathname == '/'
											? 'primary'
											: 'white'
									}
									textDecoration={
										router.pathname == '/'
											? 'underline'
											: ''
									}
									textUnderlineOffset={5}
									cursor={'pointer'}
									onClick={onClose}
									fontFamily="Roboto"
									fontWeight={'bold'}
									fontSize="sm">
									App
								</Text>
							</Link>

							<Link href="/pools">
								<Text
									my="1rem"
									color={
										router.pathname.includes('pool')
											? 'primary'
											: 'gray.100'
									}
									textDecoration={
										router.pathname.includes('pool')
											? 'underline'
											: ''
									}
									textUnderlineOffset={5}
									cursor={'pointer'}
									onClick={onClose}
									fontFamily="Roboto"
									fontWeight={'bold'}
									fontSize="sm">
									Pools
								</Text>
							</Link>

							<Link href={'/exchange'}>
								<Text
									cursor={'pointer'}
									color={
										router.pathname == '/exchange'
											? 'primary'
											: 'gray.100'
									}
									textDecoration={
										router.pathname == '/exchange'
											? 'underline'
											: ''
									}
									textUnderlineOffset={5}
									my="1rem"
									onClick={onClose}
									fontFamily="Roboto"
									fontWeight={'bold'}
									fontSize="sm">
									Exchange
								</Text>
							</Link>

					</Flex>
				</Box>
        <Box display={{ sm: 'none', md: 'block' }}>
				<ConnectButton />
        </Box>

				<Box display={{ sm: 'block', md: 'none', lg: 'none' }}>
					<FaBars size={20} onClick={onOpen} color="white" />
				</Box>
			</Flex>
			<Drawer placement={'right'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent alignItems={'center'} bgColor={'gray.800'}>
					<DrawerHeader borderBottomWidth="1px">
						<Flex alignItems={'center'}>
							<Image
								src={colorMode == 'dark' ? darklogo : lightlogo}
								alt=""
								width="100px"
								height="100px"
							/>
						</Flex>

						<Box mt="1rem" minWidth={'100%'}></Box>
					</DrawerHeader>
					<DrawerBody>
						<Box>
							<UnorderedList
								display={'flex'}
								flexDirection="column"
								alignItems="center"
								justifyContent={'center'}
								listStyleType="none">
								<ListItem>
									<Link href="/">
										<Text
											my="1rem"
											color={
												router.pathname == '/'
													? 'primary'
													: 'white'
											}
											textDecoration={
												router.pathname == '/'
													? 'underline'
													: ''
											}
											textUnderlineOffset={5}
											cursor={'pointer'}
											onClick={onClose}
											fontFamily="Roboto"
											fontWeight={'bold'}
											fontSize="sm">
											App
										</Text>
									</Link>
								</ListItem>

								<ListItem>
									<Link href="/pools">
										<Text
											my="1rem"
											color={
												router.pathname.includes('pool')
													? 'primary'
													: 'gray.100'
											}
											textDecoration={
												router.pathname.includes('pool')
													? 'underline'
													: ''
											}
											textUnderlineOffset={5}
											cursor={'pointer'}
											onClick={onClose}
											fontFamily="Roboto"
											fontWeight={'bold'}
											fontSize="sm">
											Pools
										</Text>
									</Link>
								</ListItem>

								<ListItem>
									<Link href={'/exchange'}>
										<Text
											cursor={'pointer'}
											color={
												router.pathname == '/exchange'
													? 'primary'
													: 'gray.100'
											}
											textDecoration={
												router.pathname == '/exchange'
													? 'underline'
													: ''
											}
											textUnderlineOffset={5}
											my="1rem"
											onClick={onClose}
											fontFamily="Roboto"
											fontWeight={'bold'}
											fontSize="sm">
											Exchange
										</Text>
									</Link>
								</ListItem>
								<ListItem my="1rem">
									<ConnectButton />
								</ListItem>
							</UnorderedList>
						</Box>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}

export default NavBar;
