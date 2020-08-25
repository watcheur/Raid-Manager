import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, CardFooter, FormInput, Button, Form, FormSelect, InputGroup, ListGroup, ListGroupItem, ButtonGroup } from "shards-react";
import ReactQuill, {Quill} from "react-quill";
import { toast } from 'react-toastify';
import classNames from "classnames";

import _ from 'lodash';

import PageTitle from "../components/common/PageTitle";
import PlayerList from "../components/players/PlayerList.js";

import GameData from '../data/gamedata';
import Api from "../data/api";
import { Dispatcher, Constants } from "../flux";
import PlayersList from "../components/players/PlayerList.js";

class CharacterWishlist extends React.Component {
    defaultState = {
        characterId: 0,
        character : null,
        expansions : [],
        encounters: [],
        raid: '',

        loading: false
    }

    constructor(props) {
        super(props);

        const { match: { params } } = this.props;
        
        this.defaultState.characterId = params.characterId;
        this.state = {...this.defaultState};

        this.loadCharacter = this.loadCharacter.bind(this);
        this.loadExpansions = this.loadExpansions.bind(this);
        this.loadEncounters = this.loadEncounters.bind(this);
    }

    loadCharacter() {
        this.setState({ loading: true });

        Api.GetCharacter(this.state.characterId)
            .then(res => {
                this.setState({ loading: false });
                if (!res.data.err) {
                    this.setState({ character: res.data.data });
                }
            })
            .catch(err => {
                this.setState({ loading: false });
                alert('An error occured while refreshing this character');
            })
    }

    loadExpansions()
    {
        Api.GetExpansions()
            .then(res => {
                if (!res.data.err) {
					this.setState({ expansions: res.data.data });
                    this.defaultState.expansions = res.data.data;

                    if (res.data.data.length > 0 && res.data.data[0].raids.length > 0)
                    {
                        var currentxPac = _.last(res.data.data);
                        var currentRaid = _.last(currentxPac.raids);

                        this.setState({ raid: currentRaid.id }, this.loadEncounters);
                    }
				}
            })
            .catch(err => alert(err))
    }

    loadEncounters()
    {
        if (this.state.raid)
        {
            Api.GetRaidEncounters(this.state.raid)
                .then(res => {
                    if (!res.data.err)
                        this.setState({ encounters: res.data.data });
                })
                .catch(err => alert(err))
        }
    }

    componentDidMount() {
        this.loadCharacter();
        this.loadExpansions();
    }

    render() {
        const { character } = this.state;

        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title={this.state.character?.name} subtitle="Wishlist" className="text-sm-left mb-3" />
                </Row>

                {character ? (
                    <Container fluid className="main-content-container">
                        <Row className="mt-5 mb-5">
                            <Col lg="12" md="12">
                                <Card small className="card-post mb-4">
                                    <CardHeader className="border-bottom text-center py-0">
                                        <Row>
                                            <Col className='py-0'>
                                                <h6 className="m-0 py-2">Wishlist</h6>
                                            </Col>
                                            <Col md="3" className="border-left form-group py-2 mb-0">
                                                <FormSelect
                                                    id="feRaid"
                                                    size="sm"
                                                    value={this.state.raid}
                                                    required
                                                    onChange={(event) => { this.setState({ raid: event.target.value }, () => { this.loadEncounters(); }); }}>
                                                    <option value=''>Raid...</option>
                                                    {this.state.expansions.length > 0 ? this.state.expansions.sort((a, b) => { return (a.id < b.id) }).map((exp, index) => {
                                                        return (
                                                            <optgroup key={exp.id} label={exp.name}>
                                                                {exp.raids.sort((a, b) => { return a.id < b.id }).map((raid, index) => {
                                                                    return (<option key={raid.id} value={raid.id}>{raid.name}</option>)
                                                                })}
                                                            </optgroup>
                                                        );
                                                    }) : ''}
                                                </FormSelect>
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    {this.state.encounters.length > 0 ? (
                                        <CardBody>
                                            <ListGroup className="p-0">
                                                {this.state.encounters.map((encounter, idx) => (
                                                    <ListGroupItem className="border-0" key={idx}>
                                                        <Row>
                                                            <Col sm="7" md="7">
                                                                <h5 className="m-0" onClick={this.toggle}>{encounter.name}</h5>
                                                            </Col>
                                                            <Col sm="5" md="5" className='text-right'>
                                                                XX
                                                            </Col>
                                                        </Row>
                                                        <Row className="my-3">
                                                            <Col className="">
                                                                <Row className="mb-3">
                                                                    {encounter.drops.map((drop, idx) => 
                                                                        <Col lg="3" sm="3" md="3" className="mb-3">
                                                                            <Card className='text-center'>
                                                                                <CardHeader>
                                                                                    {drop.media ? <img src={GameData.RenderMedia(drop.media)} className="rounded border shadow GameIcon-small mr-2" /> : ''}
                                                                                    <a href="#" className={classNames(drop.quality.toLowerCase())} data-wowhead={GameData.ItemToWowHead(drop, '&iconSize=true')}>{drop.name}</a>
                                                                                </CardHeader>
                                                                                <CardFooter>
                                                                                    <ButtonGroup className="align-center">
                                                                                        <Button className="btn-outline-primary">LFR</Button>
                                                                                        <Button className="btn-outline-primary">NM</Button>
                                                                                        <Button className="btn-outline-primary">HM</Button>
                                                                                        <Button className="btn-outline-primary">MM</Button>
                                                                                    </ButtonGroup>
                                                                                </CardFooter>
                                                                            </Card>
                                                                        </Col>
                                                                    )}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </ListGroupItem>
                                                ))}
                                            </ListGroup>
                                        </CardBody>
                                    ) : ''}
                                    <CardFooter>

                                    </CardFooter>
                                </Card>
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

export default CharacterWishlist;