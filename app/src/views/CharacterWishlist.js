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
        wishlist: [],
        raid: '',

        loading: false,
        error: ''
    }

    constructor(props) {
        super(props);

        const { match: { params } } = this.props;
        
        this.defaultState.characterId = params.characterId;
        this.state = {...this.defaultState};

        this.loadCharacter = this.loadCharacter.bind(this);
        this.loadExpansions = this.loadExpansions.bind(this);
        this.loadEncounters = this.loadEncounters.bind(this);
        this.dropToBtn = this.dropToBtn.bind(this);
        this.toggleDrop = this.toggleDrop.bind(this);
    }

    loadCharacter() {
        this.setState({ loading: true });

        Api.GetCharacter(this.state.characterId)
            .then(res => {
                this.setState({ loading: false });
                if (!res.data.err) {
                    this.setState({ error: '', character: res.data.data });
                }
            })
            .catch(err => this.setState({ loading: false, error: 'An error occured while fetching the character' }));
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

                        this.setState({ error: '', raid: currentRaid.id }, this.loadEncounters);
                    }
				}
            })
            .catch(err => this.setState({ error: err.message }));
    }

    loadEncounters()
    {
        if (this.state.raid)
        {
            Api.GetRaidEncounters(this.state.raid)
                .then(res => {
                    if (!res.data.err)
                        this.setState({ error: '', encounters: res.data.data });
                })
                .catch(err => this.setState({ error: err.message }));
        }
    }

    toggleDrop(drop, difficulty)
    {
        if (this.state.character && drop)
        {
            Api.ToggleNeed(this.state.character.id, drop.id, difficulty)
                .then(res => {
                    if (!res.data.err) {
                        var ws = this.state.wishlist;
                        var f = ws.findIndex(w => w.item == drop.id && w.difficulty == difficulty);
                        if (f > 0)
                            ws.splice(f, 1);
                        else
                            ws.push({ item: drop.id, difficulty: difficulty });

                        this.setState({ error: '', wishlist: ws });
                    }
                })
                .catch(err => this.setState({ error: err.message }));
        }
    }

    dropToBtn(drop, difficulty)
    {
        var f = this.state.wishlist.findIndex(w => w.item == drop.id && w.difficulty == difficulty);
        if (f >= 0)
            return 'btn-secondary';
        return 'btn-outline-secondary';
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
                        <Row>
                            <FormSelect
                                id="feRaid"
                                size="md"
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
                        </Row>

                        {this.state.error && (
                            <Row className="rounded my-2 p-0 py-1 bg-danger text-white text-center" style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                <Col>
                                    <i className="material-icons">warning</i> {this.state.error}
                                </Col>
                            </Row>
                        )}

                        <Row className="mb-3 mt-3">
                            {this.state.encounters.length > 0 ? this.state.encounters.map((encounter, idx) => (
                                <Col key={encounter.id} md="4" className="mb-5">
                                    <Card>
                                        <CardHeader>
                                            <h5 className="m-0 text-center">{encounter.name}</h5>
                                        </CardHeader>
                                        <CardBody className="px-0 py-0">
                                            <table className="table table-striped table-sm">
                                                <tbody>
                                                    {encounter.drops.map((drop, idx) => 
                                                        <tr key={drop.id}>
                                                            <td>
                                                                <strong>
                                                                    <a href="#" className={classNames(drop.quality.toLowerCase())} data-wowhead={GameData.ItemToWowHead(drop, '&iconSize=true')}>
                                                                        {drop.media ? <img src={GameData.RenderMedia(drop.media)} className="rounded border shadow GameIcon-small mr-2" /> : ''}
                                                                        {drop.name}
                                                                    </a>
                                                                </strong>
                                                            </td>
                                                            <td>
                                                                <ButtonGroup className="btn-group-sm float-right">
                                                                    <Button onClick={ev => this.toggleDrop(drop, GameData.Raids.Difficulties.LFR)} className={classNames(this.dropToBtn(drop, GameData.Raids.Difficulties.LFR))}>LFR</Button>
                                                                    <Button onClick={ev => this.toggleDrop(drop, GameData.Raids.Difficulties.Normal)} className={classNames(this.dropToBtn(drop, GameData.Raids.Difficulties.Normal))}>NM</Button>
                                                                    <Button onClick={ev => this.toggleDrop(drop, GameData.Raids.Difficulties.Heroic)} className={classNames(this.dropToBtn(drop, GameData.Raids.Difficulties.Heroic))}>{/*<img src="/images/blizzard/heroic.png" />*/}HM</Button>
                                                                    <Button onClick={ev => this.toggleDrop(drop, GameData.Raids.Difficulties.Mythic)} className={classNames(this.dropToBtn(drop, GameData.Raids.Difficulties.Mythic))}>MM</Button>
                                                                </ButtonGroup>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )) : ''}
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