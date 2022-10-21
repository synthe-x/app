import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

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

const dollarFormatter = new Intl.NumberFormat('en-US', {currency:"USD", style: "currency"});
const renderActiveShape = (props: any) => {
	const RADIAN = Math.PI / 180;
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		// fill,
		payload,
		percent,
		value,
	} = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	// random color
	const fill = "#5CB450"

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{fontSize: "20px", fontWeight: "bolder"}}>
				{payload.name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill="none"
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill='#fff'>{`${dollarFormatter.format(value)}`}</text>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill='#999'
                style={{"fontSize": "12px"}}>
				{`${(percent * 100).toFixed(2)}%`}
			</text>
		</g>
	);
};

const PoolPie = ({data}: any) => {
	const [activeIndex, setActiveIndex] = React.useState(0);

	const onPieEnter = (_: any, index: number) => {
		setActiveIndex(index);
	};

	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart width={100} height={400}>
				<Pie
					activeIndex={activeIndex}
					activeShape={renderActiveShape}
                    // startAngle={90}
                    // endAngle={90 + 360}
					data={data}
					cx="50%"
					cy="50%"
					innerRadius={130}
					outerRadius={180}
					fill="#053300"
					dataKey="value"
					onMouseEnter={onPieEnter}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
};

export default PoolPie;