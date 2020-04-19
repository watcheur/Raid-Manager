import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import EventAdd from "../components/event/EventAdd";
import EventCalendar from "../components/event/EventCalendar";

const EventsOverview = () => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Events" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

    <Row className="justify-content-md-center mb-4">
        <Col md="8">
          <EventAdd raid={1180} difficulty={3} title="Test" />
        </Col>
    </Row>

    <Row className="mb-4">
      <Col>
        <EventCalendar />
      </Col>
    </Row>
  </Container>
);

export default EventsOverview;
