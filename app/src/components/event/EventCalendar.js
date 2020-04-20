import React from "react";
import PropTypes from "prop-types";
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { Dispatcher, Constants } from "../../flux";
import { Container, Row, Col } from "shards-react";
import Blizzard from "../../data/blizzard";

import Api from '../../data/api'

moment.locale('fr', {
    week: {
        dow: 1,
        doy: 1
    }
});
const localizer = momentLocalizer(moment);

const Event = (ev) => {
    return(
        <a href={`/events/${ev.event.resource.id}`}>
            <div className={`rbc-event-main bg ${ev.event.resource.raid.name.slugify()} difficulty ${Blizzard.DifficultyToClass(ev.event.resource.difficulty)}`}>
                <span className="time">{moment(ev.event.start).format('HH:mm')}</span>
                <span className="title" title={ev.event.title}>{ev.event.title}</span>
            </div>
        </a>
    )
}

class EventCalendar extends React.Component {
	defaultState = {
        events: [],
        event: null
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState, ...props}
        this.defaultState = {...this.state}
        this.eventPropGetter = this.eventPropGetter.bind(this);
        this.loadEvents = this.loadEvents.bind(this);
    }
    
    eventPropGetter(event, start, end, selected) {
        let difficulty =  '';
        switch (event.resource.difficulty) {
            case 0: difficulty = 'lfr'; break;
            case 1: difficulty = 'normal'; break;
            case 2: difficulty = 'heroic'; break;
            case 3: difficulty = 'mythic'; break;
        }

        return {
            className: `${event.resource.raid.name.slugify()} ${difficulty}`
        }
    }

    loadEvents() {
        Api.GetEvents()
            .then(res => {
                if (!res.data.err) {
                    let events = res.data.data.map(ev => {
                        return {
                            title: ev.title,
                            start: ev.schedule,
                            end: ev.schedule,
                            allDay: false,
                            resource: ev
                        }
                    });

                    this.setState({ events: events })
                    this.defaultState.events = events;
				}
            })
            .catch(err => alert(err))
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.EVENT_DELETED:
                    if (this.state.event && this.state.event.id == payload.event.id)
                        this.setState({ event: null });
                case Constants.EVENT_CREATED:
                case Constants.EVENT_UPDATED:
                        this.loadEvents();
                    break;
                default:
            }
        });
        this.loadEvents();
    }
    
    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }
	
	render() {
		return (
            <Row className="mb-4">
                <Col>
                    <Calendar
                        localizer={localizer}
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        popup={true}
                        views={['month']}
                        onSelectEvent={(event) => { this.setState({ event: event.resource }) }}
                        components={ { event: Event } }
                        style={{ height: 1000 }}
                    />
                </Col>
                {/*
                <Col md="2">
                    <EventDetails event={this.state.event} />
                </Col>*/}
            </Row>
		);
	}
}

EventCalendar.propTypes = {
    events: PropTypes.array
};

EventCalendar.defaultProps = {

};

export default EventCalendar
