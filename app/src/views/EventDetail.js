import React from "react";
import PropTypes from "prop-types";
import moment from 'moment'

import { Dispatcher, Constants } from "../flux";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    Button,
    ListGroup,
    ListGroupItem,
    Collapse,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    CardFooter
} from "shards-react";

import Error from "./Errors";
import PageTitle from "../components/common/PageTitle";
import Encounters from "../components/encounter/Encounters";
import CreateComp from "../components/composition/CreateComp";

import Blizzard from "../data/blizzard";
import Api from '../data/api'

class EventDetail extends React.Component {
    defaultState = {
        eventId: 0,
        encounter : null,
        event: null,
        eventDeleted: false,
        eventNotFound: false,
        modalOpened: false
    }

    constructor(props) {
        super(props);

        const { match: { params } } = this.props;
        
        this.defaultState.eventId = params.eventId;
        this.state = {...this.defaultState}

        this.loadEvent = this.loadEvent.bind(this);
        this.delete = this.deleteEvent.bind(this);
    }
    
    deleteEvent() {
        this.setState({ deletion: true })
        Api.DeleteEvent(this.state.eventId)
            .then((res) => {

            })
            .catch((err) => {
                alert(err)
            });
    }
    
    loadEvent() {
        if (this.state.eventId == 0)
            return;
        
        Api.GetEvent(this.state.eventId)
            .then(res => {
                if (!res.data.err) {
                    this.setState({ event: res.data.data })
                    this.defaultState.event = res.data.data;
				}
            })
            .catch(err => {
                if (err.response.status == 404)
                    this.setState({ eventNotFound: true });
                else
                    alert(err);
            });
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.EVENT_DELETED:
                    if (this.state.event && this.state.event.id == payload.event)
                        this.setState({ eventDeleted: true });
                    break;
                case Constants.EVENT_UPDATED:
                case Constants.COMPOSITION_CREATED:
                case Constants.COMPOSITION_UPDATED:
                case Constants.COMPOSITION_DELETE:
                    this.loadEvent();
                    break;
                default:
            }
        });
        this.loadEvent();
    }
    
    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    render() {
        if (this.state.eventNotFound)
            return (<Error error={404} title="Event not found" message="This event wasn't found, maybe it has been deleted recently" back="/events" />);

        if (this.state.eventDeleted)
            return (
                <Container fluid className="main-content-container px-4">
                    <Row noGutters className="page-header p-0 mt-3">
                        <Col className="py-2">
                            <Button href={`/events`} pill className="m-0">&larr; Go Back</Button>
                        </Col>
                        <Col lg="11">
                        <PageTitle title={`Events`} subtitle="Dashboard" className="text-sm-left mb-3" />
                        </Col>
                    </Row>

                    <Row className="mt-5">
                        <Col className="mb-4">
                            <div
                                className="bg-danger text-white text-center rounded p-3 "
                                style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                <i className='material-icons'>error</i> This event was just deleted
                            </div>
                        </Col>
                    </Row>
                    
                </Container>
            );

        const { event } = this.state;
        return (
            <Container fluid className="main-content-container px-4">

                <Modal open={this.state.modalOpened}>
                    <ModalHeader>Confirm deletion</ModalHeader>
                    <Row className="border-top py-2 px-2 m-0">
                        <Col md="6">
                            <Button onClick={() => this.setState({ modalOpened: false })} className="btn-block" theme="light"><i className="material-icons">close</i> Close</Button>
                        </Col>
                        <Col md="6">
                            <Button onClick={() => this.deleteEvent() } className="btn-block" theme="danger"><i className="material-icons">delete</i> Confirm</Button>
                        </Col>
                    </Row>
                </Modal>

                <Row noGutters className="page-header p-0 mt-3">
                    <Col className="py-2">
                        <Button href={`/events`} pill className="m-0">&larr; Go Back</Button>
                    </Col>
                    <Col lg="11">
                        <PageTitle title={`Event ${event ? `- ${event.title}` : ''}`} subtitle="Dashboard" className="text-sm-left mb-3" />
                    </Col>
                </Row>
                
                {event ? (
                    <Container fluid className="main-content-container">
                        <Row className="mt-5 mb-5">
                            <Col lg="3">
                                <Card small className="card-post mb-4">
                                    <div className={`card-post__image bg ${event.raid.name.slugify()} difficulty ${Blizzard.DifficultyToClass(event.difficulty)}`}></div>
                                    <CardHeader className="border-bottom text-center">
                                        <h4 className="mb-0">{event.title}</h4>
                                        <span className="text-muted d-block mb-2">{Blizzard.DifficultyToClass(event.difficulty).capitalize()} {event.raid.name}</span>
                                    </CardHeader>
                                    <ListGroup flush className="p-4">
                                        <ListGroupItem className="p-1 m-0 border-0">
                                            <span className="d-flex mb-2">
                                                <Col>
                                                    <i className="material-icons mr-1">calendar_today</i>
                                                    <strong className="mr-1">Schedule</strong>
                                                </Col>
                                                <Col className="text-right">
                                                    {moment(event.schedule).format('DD/MM/YYYY HH:mm')}
                                                </Col>
                                            </span>
                                        </ListGroupItem>
                                        <ListGroupItem className="p-1 m-0 border-0">
                                            <span className="d-flex mb-2">
                                                <Col>
                                                    <i className="material-icons mr-1">people</i>
                                                    <strong className="mr-1">Encounters</strong>
                                                </Col>
                                                <Col className="text-right">
                                                    {event.compositions.filter(c => c.length > 0).length}
                                                </Col>
                                            </span>
                                        </ListGroupItem>
                                    </ListGroup>
                                    <CardFooter className="border-top">
                                        <Row>
                                            <Col lg="12">
                                                <Button onClick={() => this.setState({ modalOpened: true })} className="btn-block" theme="danger"><i className="material-icons">delete</i> Delete</Button>
                                            </Col>
                                        </Row>

                                    </CardFooter>
                                </Card>
                            </Col>
                            <Col>
                                <Encounters event={event} raid={event.raid} encounter={this.state.encounter} />
                            </Col>
                        </Row>
                    </Container>
                ) :
                (
                    <h1 className='material-icons spin'>refresh</h1>
                )}
            </Container>
        )
    }
}

export default EventDetail;
