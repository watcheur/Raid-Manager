import React from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormFeedback,
  FormSelect,
  Button,
  Card,
  CardHeader,
  CardBody,
  DatePicker,
  InputGroup,
  CardFooter
} from "shards-react";
import { toast } from 'react-toastify';
import moment from "moment";

import Api from '../../data/api';
import Encounter from "./Encounter.js";

class Encounters extends React.Component {
    state = {
        encounters: [],
        loading: true,
        error: ''
    }

    constructor(props) {
		super(props);
	}

    componentDidMount() {
        if (this.props.raid) {
            this.setState({ loading: true });
            Api.GetRaidEncounters(this.props.raid.id)
                .then(res => {
                    this.setState({ loading: false });
                    if (!res.data.err) {
                        this.setState({ encounters: res.data.data });
                    }
                })
                .catch(err => {
                    this.setState({ error: err.message, loading: false })
                });
        }
	}

	componentWillUnmount() {
		
	}
	
	render() {
		return (
			<Card small>
				<CardHeader className="border-bottom p-0 m-0">
                    <Row className="p-0 m-0">
                        <Col sm="9" lg="10"><h6 className="m-0 py-2">Encounters</h6></Col>
                        <Col sm="3" lg="2" className="py-2 text-right">
                            <Button href={`/events/${this.props.event.id}/manage`}><i className='material-icons'>edit</i> Manage</Button>
                            {this.state.loading && (<Col className="text-right"><h1 className='material-icons spin'>refresh</h1></Col>)}
                        </Col>
                    </Row>
				</CardHeader>
                {this.state.error && (
                    <CardBody
                        className="bg-danger text-white text-center p-3 "
                        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                        <i className='material-icons'>error</i> {this.state.error}
                    </CardBody>   
                )}
                <CardBody className="p-0">
                    <ListGroup className="p-0">
                        {this.state.encounters.map((value, index) => {
                            return (
                                <Encounter key={value.id} event={this.props.event} encounter={value} />
                            )
                        })}
                    </ListGroup>
                </CardBody>
                <CardFooter />
			</Card>
		);
	}
}

export default Encounters
