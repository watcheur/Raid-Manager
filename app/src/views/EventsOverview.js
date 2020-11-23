import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import EventAdd from "../components/event/EventAdd";
import EventCalendar from "../components/event/EventCalendar";
import { useAuthState } from "../context";

const EventsOverview = () => {

    const { user, team } = useAuthState();
	
	return (
		<Container fluid className="main-content-container px-4">
			{/* Page Header */}
			<Row noGutters className="page-header py-4">
				<PageTitle title="Events" subtitle="Dashboard" className="text-sm-left mb-3" />
			</Row>
			
			{ user && (
			<Row className="justify-content-md-center mb-4">
				<Col md="8">
					<EventAdd raid={1190} difficulty={'MYTHIC'} user={user} team={team} />
				</Col>
			</Row>)}
			
			<EventCalendar team={team} user={user} />
		</Container>
	)
};

export default EventsOverview;
