import React from 'react';
import { Row, Col, Card, CardHeader, CardBody } from "shards-react";
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from 'recharts';

import Api from '../../data/api';
import { Dispatcher, Constants } from "../../flux";
import GameData from '../../data/gamedata';

/**
 * @param {Object} parameters
 */
export default class Stats extends React.Component {
    state = {
        data: [],
        error: '',
        loading: false
    }

    constructor(props) {
        super(props);

        this.dispatcherToken = null;
        this.loadStats = this.loadStats.bind(this);
        this.renderCustomizedLabel = this.renderCustomizedLabel.bind(this);
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index
        })
    }

    loadStats() {
        this.setState({ loading: true });

        Api.GetClassesStats(this.props.type, this.props.role)
            .then(res => {
                this.setState({ loading: false })
                if (!res.data.err) {
                    this.setState({ data: res.data.data.map(d => {
                            return {
                                name: GameData.ClassToObj(d.class).label,
                                color: GameData.ClassToColor(d.class).replace('#FFFFFF', '#bfbeba'),
                                value: d.total,
                                class: d.class
                            }
                        }
                    )});
                }
            })
            .catch(err => this.setState({ loading: false, error: err.message }));
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.CHAR_CREATED:
                case Constants.CHAR_UPDATE:
                case Constants.CHAR_DELETED:
                    this.loadStats();
                    break;
                default:
            }
        });
        this.loadStats();
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    renderCustomizedLabel({ name, value, percent }) {
        return `${name} - ${value} (${(percent * 100).toFixed(0)}%)`;
    }

    render() {
        const { title } = this.props;

        return (
            <Card>
                {title ? (
                    <CardHeader>
                        <h5 className='text-center'>{title}</h5>
                    </CardHeader>
                ) : ''}

                {this.state.error && (
                    <Col md="12" className="bg-warning text-white text-center"
                        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                        <i className="material-icons">warning</i> {this.state.error}
                    </Col>
                )}

                {this.state.loading && (<h5 className='text-center material-icons spin'>refresh</h5>)}

                {!this.state.loading && this.state.data.length == 0 && (<i className='text-center'>No data</i>)}

                {!this.state.loading && this.state.data && (
                    <ResponsiveContainer aspect={2}>
                        <PieChart>
                            <Pie
                                data={this.state.data}
                                labelLine={true}
                                label={this.renderCustomizedLabel}
                                outerRadius={80}
                                dataKey="class"
                            >
                                {
                                    this.state.data.map((entry, index) => <Cell fill={entry.color} />)
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>)}
            </Card>
        )
    }
}