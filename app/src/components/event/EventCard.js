import React from "react";
import PropTypes from "prop-types";
import moment from 'moment'
import { Card, CardBody, CardHeader, CardFooter, Button, ListGroup, ListGroupItem } from "shards-react";

import { Dispatcher, Constants } from "../../flux";
import Api from "../../data/api";
import Blizzard from "../../data/gamedata";

class EventDetail extends React.Component {
	defaultState = {
        event: null,
        error: false,
        message: ''
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState, ...props}
        this.defaultState = {...this.state}
        this.loadEvent = this.loadEvent.bind(this);
    }

    loadEvent() {
        if (this.props.event.id) {
            Api.GetEvent(this.props.event.id)
                .then(res => {
                    if (!res.data.err)
                        this.setState({ event: res.data.data })
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        message: err.response.data.message
                    });
                })
        }
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.EVENT_UPDATED:
                case Constants.EVENT_DELETED:

                    break;
                default:
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.event !== prevProps.event) {
            console.log("event", this.props.event);
            this.setState({ event: this.props.event })
            this.loadEvent()
        }
    }
    
    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }
	
	render() {
        if (!this.state.event || !this.state.event.raid)
            return '';

        const { event } = this.state;
		return (
            <Card small className="card-post mt-5">
                <div className={`card-post__image bg ${event.raid.name.slugify()}`}>
                </div>
                <CardBody className={`difficulty ${Blizzard.DifficultyToClass(event.difficulty)} p-3`}>
                    <h5 className="card-title">
                        <a className="text-fiord-blue" href="#">
                            {event.title}
                        </a>
                    </h5>
                    <ListGroup flush>
                        <ListGroupItem className="p-0">
                            <span className="d-flex mb-2">
                                <i className="material-icons mr-1">flag</i>
                                <strong className="mr-1">Status:</strong> Draft
                            </span>
                            <span className="d-flex mb-2">
                                <i className="material-icons mr-1">visibility</i>
                                <strong className="mr-1">Visibility:</strong>
                                <strong className="text-success">Public</strong>
                            </span>
                            <span className="d-flex mb-2">
                                <i className="material-icons mr-1">calendar_today</i>
                                <strong className="mr-1">Schedule:</strong> {moment(event.schedule).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <span className="d-flex">
                                <i className="material-icons mr-1">score</i>
                                <strong className="mr-1">Readability:</strong>
                                <strong className="text-warning">Ok</strong>
                            </span>
                        </ListGroupItem>
                    </ListGroup>
                </CardBody>
                <CardFooter className="text-muted border-top py-3">
                  <Button href={`/events/${event.id}`} type="button" className="btn-block">Details</Button>
                </CardFooter>
              </Card>
		);
	}
}

EventDetail.propTypes = {
    event: PropTypes.object
};

EventDetail.defaultProps = {

};

export default EventDetail
