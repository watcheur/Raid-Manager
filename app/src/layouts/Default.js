import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import ReactTooltip from "react-tooltip";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

const DefaultLayout = ({ children, noNavbar, noFooter }) => (
  <Container fluid>
    <ToastContainer />
    <Row>
      <MainSidebar />
      <Col
        className="main-content p-0"
        lg={{ size: 10, offset: 2 }}
        md={{ size: 9, offset: 3 }}
        sm="12"
        tag="main"
      >
        <MainNavbar />
        {children}
        {!noFooter && <MainFooter />}
      </Col>
    </Row>
    <ReactTooltip />
    <ReactTooltip id="missing" type='error' effect='solid' backgroundColor='#c4183c' textColor='#FFF' className="text-center missing-tooltip" html={true} />
  </Container>
);

DefaultLayout.propTypes = {
  /**
   * Whether to display the navbar, or not.
   */
  noNavbar: PropTypes.bool,
  /**
   * Whether to display the footer, or not.
   */
  noFooter: PropTypes.bool
};

DefaultLayout.defaultProps = {
  noNavbar: true,
  noFooter: true
};

export default DefaultLayout;
