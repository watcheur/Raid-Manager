import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Card, CardBody } from "shards-react";
import moment from "moment";

import { Dispatcher, Constants } from "../../flux";
import Blizzard from "../../data/blizzard";
import Api from "../../data/api";

class NextEventTile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			event: null
		}
	}

	loadEvent() {
		Api.GetNextEvent()
			.then(res => {
				if (!res.data.err)
					this.setState({ event: res.data.data })
			})
			.catch(err => {
				
			})
	}

	componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.EVENT_CREATED:
                case Constants.EVENT_DELETED:
                case Constants.EVENT_UPDATED:
                    this.loadEvent();
                    break;
                default:
            }
        });
        this.loadEvent();
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

	render() {
		const cardClasses = classNames("stats-small", "stats-small--1", "next-raid");
		const cardBodyClasses = classNames("p-0 d-flex", (this.state.event && 'bg difficulty'), (this.state.event && this.state.event.raid.name.slugify()), (this.state.event && Blizzard.DifficultyToClass(this.state.event.difficulty)));
		const innerWrapperClasses = classNames("d-flex", "flex-column m-auto");
		const dataFieldClasses = classNames("stats-small__data", "text-center");
		const labelClasses = classNames("stats-small__label", "text-uppercase");
		const valueClasses = classNames("stats-small__value", "count", "my-3");
		const innerDataFieldClasses = classNames("stats-small__data");
		const percentageClasses = classNames("stats-small__percentage");

		return (
			<Card small className={cardClasses}>
				<CardBody className={cardBodyClasses}>
					<div className={innerWrapperClasses}>
						<div className={dataFieldClasses}>
							<span className={labelClasses}>Next scheduled raid</span>
							{this.state.event && (
								<a href={`/events/${this.state.event.id}`}>
									<h6 className={valueClasses}>{this.state.event.title}</h6>
									{moment(this.state.event.schedule).format("DD/MM/YYYY HH:mm")}
								</a>
							)}
							{!this.state.event && (<h6>None !</h6>)}
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}
}

export default NextEventTile;