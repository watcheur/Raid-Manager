import React from "react";
import PropTypes from "prop-types";
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { Dispatcher, Constants } from "../../flux";
import { Container, Row, Col } from "shards-react";
import GameData from "../../data/gamedata";

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
            <div className={`rbc-event-main bg ${ev.event.resource.raid.name.slugify()} difficulty ${ev.event.resource.difficulty.slugify()}`}>
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
            className: `${event.resource.raid.name.slugify()} ${event.resource.difficilty.slugify()}`
        }
    }

    async loadEvents() {
        try
        {
            if (!this.props.team)
                return;
            
            this.setState({ loading: true })

            const res = await Api.GetEvents({ team: this.props.team.id })

            if (res.data.data)
            {
                let events = res.data.data.map(ev => {
                    return {
                        title: ev.name,
                        start: ev.schedule,
                        end: ev.schedule,
                        allDay: false,
                        resource: ev
                    }
                });

                this.setState({ events: events })
                this.defaultState.events = events;
            }
        }
        catch (error)
        {
            // Api send a response who isn't a 2XX
            if (error.response)
                this.setState({ loading: false, error: error.response.data.message });
            else
                this.setState({ loading: false, error: error.message });
        }
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            if (payload.channel == Constants.CHANNEL_EVENT)
            {
                let { id, name, raid, schedule, difficulty } = payload;
                let { events } = this.state;
                switch (payload.actionType) {
                    case Constants.CREATED:
                    case Constants.UPDATED:
                        events.push({
                            title: payload.name,
                            start: payload.schedule,
                            end: payload.schedule,
                            allDay: false,
                            resource: payload
                        })
                        this.setState({ events: events });
                        break;
                    case Constants.DELETED:
                        let index = events.findIndex(ev => ev.resource.id === payload.event);
                        if (index >= 0) {
                            events.splice(index, 1);
                            this.setState({events: events});
                        }
                        break;
                }
            }
        });
        this.loadEvents();
    }
    
    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }
	
	render() {
        const { user, team } = this.props;
        if (!team)
            return <div className="text-danger"><i className='material-icons'>error</i> EventCalendar: Missing [team] property</div>;
            
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
