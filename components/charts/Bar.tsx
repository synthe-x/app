import React, { PureComponent } from 'react';
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
	Brush,
} from 'recharts';
import { useEffect } from 'react';

const COLORS = [
	'#CDE7CA',
	'#5CB450',
	'#228B22',
	'#50C878',
	'#454B1B',
	'#7FFFD4',
	'#00A36C',
	'#E4D00A',
];

const data = [
	{
	  name: 'Page A',
	  uv: 4000,
	  pv: 2400,
	  amt: 2400,
	},
	{
	  name: 'Page B',
	  uv: 3000,
	  pv: 1398,
	  amt: 2210,
	},
	{
	  name: 'Page C',
	  uv: 2000,
	  pv: 9800,
	  amt: 2290,
	},
	{
	  name: 'Page D',
	  uv: 2780,
	  pv: 3908,
	  amt: 2000,
	},
	{
	  name: 'Page E',
	  uv: 1890,
	  pv: 4800,
	  amt: 2181,
	},
	{
	  name: 'Page F',
	  uv: 2390,
	  pv: 3800,
	  amt: 2500,
	},
	{
	  name: 'Page G',
	  uv: 3490,
	  pv: 4300,
	  amt: 2100,
	},
  ];
const PoolDailyVolume = ({ 
	data, 
	poolSynths }: any) => {
	if(poolSynths && data.length > 0)  console.log([data, poolSynths], 'poolSynths');
	return (
		<>
			{poolSynths && data.length > 0 ? (
				<>
					<ResponsiveContainer width="100%" height="90%">
						<BarChart
							data={data}
							margin={{
								top: 5,
								right: 0,
								left: 0,
								bottom: 5,
							}}
							barSize={20}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis
								dataKey="dayId"
								padding={{ left: 10, right: 10 }}
							/>
							<YAxis />
							<Tooltip />
							<Legend
								verticalAlign="top"
								wrapperStyle={{ lineHeight: '40px' }}
							/>
							<ReferenceLine y={0} stroke="#000" />
							<Brush
								dataKey="dayId"
								height={30}
								stroke="#50C878"
								fill="#fff"
							/>
							{poolSynths.map((synth: any, index: number) => {
								return (
									<Bar
										key={index}
										dataKey={synth.symbol}
										stackId="a"
										// fill={'#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}
										// fill="#8884d8"
										fill={COLORS[index % COLORS.length]}
										maxBarSize={20}
									/>
								);
							})}
						</BarChart>
					</ResponsiveContainer>					
				</>
			) : (
				<>Loading</>
			)}
		</>
	);
};

export default PoolDailyVolume;
