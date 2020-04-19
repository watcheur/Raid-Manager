import React from 'react';
import { Row, Col } from "shards-react";

import SmallStatsLike from "../common/SmallStatsLite";
import Api from '../../data/api';
import { Dispatcher, Constants } from "../../flux";
import Blizzard from '../../data/blizzard';

/**
 * @param {Object} parameters
 */
export default class Stats extends React.Component {
    defaultState = {
        ilvl: {
            mains: null,
            alts: null,
            altsfun: null
        },
        azerite: {
            mains: null,
            alts: null,
            altsfun: null
        },
        weekly: {
            mains: null,
            alts: null,
            altsfun: null
        }
    }

    state = this.defaultState;

    constructor(props) {
        super(props);

        this.dispatcherToken = null;
    }

    loadStats() {
        Api.GetAverageIlvl()
            .then(res => {
                if (!res.data.res)
                    this.setState({ ilvl: res.data.data });
            })
            .catch()
        
        Api.GetAverageAzerite()
            .then(res => {
                if (!res.data.res)
                    this.setState({ azerite: res.data.data });
            })
            .catch()
        
        Api.GetWeeklyRuns()
            .then(res => {
                if (!res.data.res)
                    this.setState({ weekly: res.data.data });
            })
            .catch()
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.NEW_CHAR:
                case Constants.CHAR_UPDATE:
                case Constants.CHAR_DELETED:
                    this.loadStats();
                    break;
                case Constants.OPTIONS_LOADED:
                    this.setState({ ...this.state });
                    break;
                default:
            }
        });
        this.loadStats();
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    render() {
        return (
            <Row className="justify-content-md-center">
                { this.state.ilvl ? (
                    <Col className="col-lg-2 mb-4">
                        <SmallStatsLike label="Average mains ilvl" variation="1" value={this.state.ilvl.mains} value-classes={Blizzard.IlvlToClass(this.state.ilvl.mains)} increase={true} />
                    </Col>
                ) : ''}
                { this.state.azerite ? (
                    <Col className="col-lg-2 mb-4">
                        <SmallStatsLike label="Average neck level" variation="1" value={this.state.azerite.mains} value-classes={Blizzard.AzeriteToClass(this.state.azerite.mains)} increase={true} />
                    </Col>
                ) : ''}
                { this.state.weekly.mains ? (
                    <Col className="col-lg-2 mb-4">
                        <SmallStatsLike label="Weekly runs"
                            variation="1"
                            value={`${this.state.weekly.mains.runs} / ${this.state.weekly.mains.roster}`}
                            percentage={this.state.weekly.mains.percent}
                        />
                    </Col>
                ) : ''}
            </Row>
        )
    }
}