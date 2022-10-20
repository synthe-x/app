import {
  Flex, Text, Box, useColorMode, Button, UnorderedList, ListItem, Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton, useDisclosure, Switch
} from '@chakra-ui/react'

import ConnectButton from "./ConnectButton"
import { FaBars } from 'react-icons/fa';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import React, { useState } from 'react'
import Image from 'next/image';
import { useRouter } from "next/router";
import Link from "next/link";
import '../styles/Home.module.css'
import darklogo from '../public/dark_logo.svg'
import lightlogo from '../public/light_logo.svg'


function NavBar() {
  const [ address, setAddress ] = useState(null);
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Flex justify={"space-between"} alignItems={"center"}>
        <Box mb={3}>
          <Image onClick={()=>{
            router.push("/")
          }} src={
            // colorMode == "dark" ? 
            darklogo
            //  : lightlogo
            } alt="" width="100px" height="70px" />
        </Box>


        <Box display={{ sm: "none", md: "block" }}>
          <UnorderedList display={"flex"} alignItems="center" justifyContent={"space-around"} minWidth="20rem" listStyleType="none">

            <ListItem mx="1rem">
              <Link href="/">
                <Text my="1rem" 
                color={router.pathname == "/" ? "green" : "white"} 
                textDecoration={router.pathname == "/" ? "underline": ""} 
                textUnderlineOffset={5} 
                cursor={"pointer"} onClick={onClose} fontFamily="Roboto" fontWeight={"bold"} fontSize="sm">
                  App
                </Text>
              </Link>
            </ListItem>

            <ListItem mx="1rem">
              <Link href="/pools">
                <Text my="1rem" 
                color={router.pathname.includes("pool") ? "green" : "gray.100"} 
                textDecoration={router.pathname.includes("pool") ? "underline": ""} 
                textUnderlineOffset={5} 
                cursor={"pointer"} onClick={onClose} fontFamily="Roboto" fontWeight={"bold"} fontSize="sm">
                  Pools
                </Text>
              </Link>
            </ListItem>

            <ListItem mx="1rem">
              <Link href={"/exchange"}  >
                <Text cursor={"pointer"} 
                color={router.pathname == "/exchange" ? "green" : "gray.100"} 
                textDecoration={router.pathname == "/exchange" ? "underline": ""} 
                textUnderlineOffset={5} 
                my="1rem" onClick={onClose} fontFamily="Roboto" fontWeight={"bold"} fontSize="sm">
                  Exchange
                </Text>
              </Link>
            </ListItem>
            {/* <ListItem mx="1rem">
              <Link href={"/portfolio"}  >
                <Text cursor={"pointer"} my="1rem" onClick={onClose} fontFamily="Roboto" fontWeight={"bold"} fontSize="sm">
                  Portfolio
                </Text>
              </Link>
            </ListItem> */}
            {/* <ListItem ml="1rem">
              <Button width={"3rem"} onClick={toggleColorMode} mr={5}> {colorMode == "dark" ? <BsMoonFill size={25} /> : <BsSunFill size={25} />}</Button>
            </ListItem> */}
            <ListItem mx="1rem">
              <ConnectButton />
            </ListItem>
          </UnorderedList>
        </Box>


        {/* <Box display={{ sm: "block", md: "none", lg: "none" }}>
          <FaBars size={35} onClick={onOpen} />
        </Box> */}


      </Flex>
      {/* <Drawer placement={"right"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent alignItems={"center"}>
          <DrawerHeader borderBottomWidth='1px'>
            <Flex alignItems={"center"}>
              <Image src={colorMode == "dark" ? darklogo : lightlogo} alt="" width="100px" height="100px" />
            </Flex>

            <Box mt="1rem" minWidth={"100%"}>
            </Box>
          </DrawerHeader>
          <DrawerBody>

            <nav >
              <UnorderedList display={"flex"} flexDirection="column" alignItems="center" justifyContent={"center"} listStyleType="none">
                <ListItem>
                  <Link href="/dashboard">
                    <Text cursor={"pointer"} my="1rem" onClick={onClose} fontFamily="Roboto" fontSize={"2xl"} fontWeight={"bold"}>
                      Dashboard
                    </Text>
                  </Link>
                </ListItem>
                <ListItem>
                  <Link href="/portfolio"   >
                    <Text cursor={"pointer"} onClick={onClose} my="1rem" fontFamily="Roboto" fontSize={"2xl"} fontWeight={"bold"}>
                      Portfolio
                    </Text>
                  </Link>
                </ListItem>
                <ListItem>
                  <Button variant={"outline"} width={"11rem"} onClick={toggleColorMode} > {colorMode == "dark" ? <BsMoonFill size={25} /> : <BsSunFill size={25} />} <Text ml="1rem">{colorMode == "light" ? "light" : "dark"} mode</Text></Button>
                </ListItem>
                <ListItem my="1rem">
                  <ConnectButton/>
                </ListItem>
              </UnorderedList>
            </nav>

          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
    </>
  )
}

export default NavBar 