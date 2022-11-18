import { Box, Button, Divider, Flex, Text, Image } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { getContract } from '../../src/contract';
import { AppDataContext } from '../AppDataProvider';
import DepositModal from '../modals/DepositModal2';
import WithdrawModal from '../modals/WithdrawModal';
import { WalletContext } from '../WalletContextProvider';

export default function Collateral({ handleChange }: any) {
	const [nullValue, setNullValue] = useState(false);

	const {
		totalCollateral,
		collaterals,
		dollarFormatter,
		updateCollateralWalletBalance,
		updateCollateralAmount,
		tokenFormatter,
	} = useContext(AppDataContext);

	const { isConnected, tronWeb } = useContext(WalletContext);

	
	const handleWithdraw = (collateral: string, value: string) => {
		updateCollateralWalletBalance(collateral, value, false);
		updateCollateralAmount(collateral, value, true);
		setNullValue(!nullValue);
		handleChange();
	};

	const handleDeposit = (collateral: string, value: string) => {
		updateCollateralWalletBalance(collateral, value, true)
		updateCollateralAmount(collateral, value, false)
		console.log(1, collaterals)
		setNullValue(!nullValue);
		console.log(2, collaterals)
		handleChange()
		console.log(3, collaterals)
	}

	const {address: evmAddress, isConnected: isEvmConnected, isConnecting: isEvmConnecting} = useAccount();
	
	return (
		<Box bgColor="#171717" pb={4} rounded={15} height='100%'>
			<Flex
				flexDir={'column'}
				justify="space-between"
				height={'200px'}
				bgColor="#fff"
				width={'100%'}
				color="black"
				p={'12px'}
				rounded={10}>
				<Box>
					<Text fontSize={'lg'} >
						My Balance
					</Text>
					<Text fontSize={'2xl'} fontWeight="bold">
						{dollarFormatter?.format(totalCollateral)}
					</Text>
				</Box>
				<Box>
					<DepositModal handleDeposit={handleDeposit}/>
				</Box>
			</Flex>
			{collaterals.map((collateral, index) => (
				<>
				<Flex
					key={collateral.symbol}
					justify="space-between"
					p={'12px'}
					mt="12px"
					>
					<Flex>
						<Image
							src={`/${collateral?.symbol}.png`}
							width={35}
							height={35}
							alt="logo"
						/>
						<Box ml={2}>
							<Text
								fontSize="sm"
								fontWeight="bold"
								textAlign={'left'}>
								{collateral['name']}
							</Text>
							<Text
								fontSize="xs"
								fontWeight="light"
								textAlign={'left'} color='primary'>
								{(isConnected || isEvmConnected)
									? tokenFormatter.format(
											collateral.amount /
												10 ** collateral.decimal
									  )
									: '-'}{' '}
								{collateral['symbol']}
							</Text>
							
						</Box>
					</Flex>

					<WithdrawModal
						asset={collateral}
						handleWithdraw={handleWithdraw}
					/>
				</Flex>
				{(index != (collaterals.length - 1)) && <Divider width={'90%'} mx='auto' borderColor={'#3C3C3C'} />}
				</>
			))}
		</Box>
	);
}
