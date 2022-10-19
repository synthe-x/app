import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import {useEffect} from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PoolDailyVolume = ({data, poolSynths}: any) => {
    return (
      <>{(poolSynths && data && data.length > 0) ? (
<ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayId" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="dayId" height={30} stroke="#8884d8" fill='#000' />
          {poolSynths.map((synth: any, index: number) => {
            return <Bar key={index} dataKey={synth.symbol} stackId="a" fill={COLORS[index%poolSynths.length]} maxBarSize={20} />
          })}
        </BarChart>
      </ResponsiveContainer>
      ): <>Loading</>}
      
    </>
    );
}

export default PoolDailyVolume;