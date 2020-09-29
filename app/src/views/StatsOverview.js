import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormInput, Button, Form, FormSelect, InputGroup } from "shards-react";
import ReactQuill, {Quill} from "react-quill";
import { toast } from 'react-toastify';
import classNames from "classnames";

import PageTitle from "../components/common/PageTitle";
import ClassesStats from "../components/charts/Classes";

import GameData from '../data/gamedata';
import Api from "../data/api";
import { Dispatcher, Constants } from "../flux";

class StatsOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: ''
        }
    }

    componentDidMount() {
    }

    render() {
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title="Stats" subtitle="Dashboard" className="text-sm-left mb-3" />
                </Row>

                <Row className="justify-content">
                    <Col md="4">
                        <ClassesStats title='All' />
                    </Col>
                    <Col md="4">
                        <ClassesStats title='Mains' type={GameData.Characters.Type.MAIN} />
                    </Col>
                    <Col md="4">
                        <ClassesStats title='Alts' type={GameData.Characters.Type.ALT} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default StatsOverview;
