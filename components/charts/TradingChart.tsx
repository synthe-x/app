import React from 'react'
// import dynamic from 'next/dynamic';
// import SymbolOverview from 'react-tradingview-embed/dist/components/SymbolOverview';

import dynamic from "next/dynamic";
import { Box, Text } from '@chakra-ui/react';
const SymbolOverview = dynamic(
  () => import("react-tradingview-embed").then((mod) => mod.SymbolOverview),
  { ssr: false }
);

export default function TradingChart({input, output}: any) {
    return (
        <>
        <Box mb={10} height="350px" bgColor={"gray.800"} display="flex" justifyContent={"center"} alignItems="center" rounded={20}>
            {/* <SymbolOverview chartOnly={true}/> */}
            <Text mx={"center"} zIndex='2'>Chart Not Found</Text>
        </Box>
        </>
    )
}
