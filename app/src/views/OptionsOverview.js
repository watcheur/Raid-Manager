import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import IlvlsOpt from "../components/options/IlvlsOptions";

const OptionsOverview = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="Options" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

    <Row>
        <Col md="3">
          <IlvlsOpt />
        </Col>
    </Row>
  </Container>
);

export default OptionsOverview;