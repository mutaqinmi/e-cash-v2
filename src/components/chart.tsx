import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Data {
    date: string;
    Total: number;
}

interface ChartProps {
    data: Data[];
}

export default class Chart extends PureComponent<ChartProps> {
    constructor(props: ChartProps){
        super(props);
    }

    render(){
        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={this.props.data}
                    margin={{
                        top: 5,
                        right: 5,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type={"monotone"} dataKey="Total" stroke="#2196f3" strokeWidth={2}/>
                </LineChart>
            </ResponsiveContainer>
        )
    }
}