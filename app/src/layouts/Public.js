import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import ReactTooltip from "react-tooltip";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PublicLayout = ({ children }) => (
  <Container fluid>
    <Row>
      <Col
        className="main-content p-0"
        lg={{ size: 12 }}
        md={{ size: 12 }}
        sm="12"
        tag="main"
      >
        {children}
      </Col>
    </Row>
    <ReactTooltip />
    <ReactTooltip id="missing" type='error' effect='solid' backgroundColor='#c4183c' textColor='#FFF' className="text-center missing-tooltip" html={true} />
  </Container>
);

export default PublicLayout;
