import React from 'react'
// import dynamic from 'next/dynamic';
// import SymbolOverview from 'react-tradingview-embed/dist/components/SymbolOverview';

import dynamic from "next/dynamic";
import { Box, Text } from '@chakra-ui/react';

const Graph = dynamic(() => import("./Graph"), {
  ssr: false
});

export default function TradingChart({input, output}: any) {
    return (
        <>
        <Box mb={10}>
            {/* <SymbolOverview chartOnly={true}/> */}
            <Graph/>
        </Box>
        </>
    )
}
