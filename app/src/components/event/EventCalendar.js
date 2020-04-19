import React from "react";
import PropTypes from "prop-types";
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'

import Api from '../../data/api'

moment.locale('fr', {
    week: {
        dow: 1,
        doy: 1
    }
});
const localizer = momentLocalizer(moment)

const Event = (ev) => {
    console.log(ev);
    let difficulty =  '';
    switch (ev.event.resource.difficulty) {
        case 0: difficulty = 'lfr'; break;
        case 1: difficulty = 'normal'; break;
        case 2: difficulty = 'heroic'; break;
        case 3: difficulty = 'mythic'; break;
    }

    return(
        <div className={`rbc-event-main ${ev.event.resource.raid.name.slugify()} ${difficulty}`}>
            <span className="time">{moment(ev.event.start).format('HH:mm')}</span>
            <span className="title" title={ev.event.title}>{ev.event.title}</span>
        </div>
    )
}

class EventCalendar extends React.Component {
	defaultState = {
        events: []
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState, ...props}
        this.defaultState = {...this.state}
        this.eventPropGetter = this.eventPropGetter.bind(this);
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

    componentDidMount() {
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
	
	render() {
		return (
            <Calendar
                localizer={localizer}
                events={this.state.events}
                startAccessor="start"
                endAccessor="end"
                popup={true}
                views={['month']}
                components={ { event: Event } }
                style={{ height: 1000 }}
            />
		);
	}
}

EventCalendar.propTypes = {
    events: PropTypes.array
};

EventCalendar.defaultProps = {

};

export default EventCalendar
