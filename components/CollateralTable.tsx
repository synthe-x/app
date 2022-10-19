import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption, Button, useDisclosure,
  TableContainer, Box, Text, Flex,useColorMode
} from '@chakra-ui/react'

import DepositModal from './modals/DepositModal';
import WithdrawModal from './modals/WithdrawModal';

import { FiMinusCircle } from 'react-icons/fi';
import Image from 'next/image';
import { getContract } from '../src/utils';
import {useState} from 'react';


const CollateralTable = ({collaterals, cRatio}: any) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [claimLoading, setClaimLoading] = useState(false);

  const claim = async () => {
    setClaimLoading(true)
    let wtrx = await getContract("WTRX");
    wtrx.deposit().send({}, (err: any, hash: string) => {
      if (err) {
        console.log(err);
        setClaimLoading(false)
      } 
      if(hash) {
        console.log(hash);
        setClaimLoading(false)
      }
    })
  }
  return (
    <div>
      <Table variant='simple' style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
        <Thead>
          <Tr  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
            <Th color={colorMode == "dark" ?"#858585" : "#171717"} fontSize={"xs"} fontFamily="Poppins" id='borrow_table_HeadingLeftBorderRadius' className='borrow_table_Head'>Collateral Assets</Th>
            <Th color={colorMode == "dark" ?"#858585" : "#171717"} fontSize={"xs"} fontFamily="Poppins" className='borrow_table_Head'>Protocol Balance</Th>
            <Th color={colorMode == "dark" ?"#858585" : "#171717"} fontSize={"xs"} fontFamily="Poppins" id='borrow_table_HeadingRightBorderRadius' className='borrow_table_Head'></Th>
          </Tr>
        </Thead>
        <Tbody>
          {collaterals.map((collateral: any) => {
          return <Tr key={collateral['symbol']}  bg={colorMode == "dark" ?"#171717" : "#ededed"}>
            <Td >
              <Box display="flex" alignItems="center" >
                <Image src={`/${collateral.symbol}.png`} 
                width={35} height={35} 
                // layout="fill"
                // style={tknholdingImg} 
                alt="logo" />
                <Box ml={2}>
                  <Text color={colorMode == "dark" ?"#FFFFF" : "#171717"} fontSize='sm' fontWeight="bold" textAlign={"left"}>{collateral['name']}</Text>
                  <Text color={colorMode == "dark" ?"#FFFFF" : "#171717"} fontSize='xs' fontWeight="light" textAlign={"left"}>{collateral['symbol']}</Text>

                </Box>
              </Box>
            </Td>
            <Td>
              <Box>
                  <Text fontSize='sm' fontWeight="bold" textAlign={"left"}>{(collateral['amount']/10**collateral['decimal']).toFixed(3)} {collateral['symbol']}</Text>
                  {collateral['symbol'] == "WTRX" ? 
                    <Button mt={2} isLoading={claimLoading} size={"xs"} rounded="100" colorScheme="whatsapp" onClick={claim}>Get WTRX Tokens</Button> 
                  : <></>}
                  {/* <Text fontSize='xs' fontWeight="light" textAlign={"left"}>{(collateral['walletBalance']/10**collateral['asset']['decimals']).toFixed(4)} {collateral['asset']['symbol']}</Text> */}
                </Box>
              </Td>

            <Td>
              <Flex alignItems={"center"}>
                <DepositModal asset={collateral} balance={(collateral['walletBalance']/10**collateral['decimal'])} />
                <WithdrawModal asset={collateral} balance={(collateral['amount']/10**collateral['decimal'])} />
              </Flex>
            </Td>
          </Tr>
          })
          }

        </Tbody>
      </Table>
    </div>
  )
}

export default CollateralTable