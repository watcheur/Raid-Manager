import React from "react";
import PropTypes from "prop-types";
import { useDrop } from 'react-dnd'
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  InputGroupAddon,
  InputGroupText,
  FormFeedback,
  FormSelect,
  Button,
  Card,
  CardHeader,
  CardBody,
  ButtonGroup,
  DatePicker,
  InputGroup,
  CardFooter
} from "shards-react";
import { toast } from 'react-toastify';
import moment from "moment";
import _ from 'lodash';
import classNames from "classnames";

import Api from '../../data/api';
import Blizzard from '../../data/blizzard';

import CharacterCard from '../characters/CharacterCard';
import RoleZone from './RoleZone';

class CreateNote extends React.Component {
    state = {
        // data
        encounters: [],
        characters: [],
        notes: [],
        // selection
        encounter: null,
        selectedType: 0,
        selectedCharaters: [],
        // other
        loading: true,
        error: ''
    }

    roles = [
        { type: Blizzard.Characters.Role.TANK, label: 'TANK' },
        { type: Blizzard.Characters.Role.HEAL, label: 'HEAL' },
        { type: Blizzard.Characters.Role.DPS, label: 'DPS' }
    ];

    types = [
        { type: Blizzard.Characters.Type.MAIN, label: 'Mains' },
        { type: Blizzard.Characters.Type.ALT, label: 'Alts' },
        { type: Blizzard.Characters.Type.ALT_FUN, label: 'Alts fun' }
    ];

    constructor(props) {
        super(props);
        
        this.loadEncounter = this.loadEncounter.bind(this);
        this.copyFrom = this.copyFrom.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        if (this.props.raid) {
            this.setState({ loading: true });
            Api.GetRaidEncounters(this.props.raid.id)
                .then(res => {
                    this.setState({ loading: false });
                    if (!res.data.err) {
                        this.setState({ encounters: res.data.data });

                        if (res.data.data.length > 0) {
                            this.loadEncounter(res.data.data[0].id);
                        }
                    }
                })
                .catch(err => {
                    this.setState({ error: err.message, loading: false })
                });
        }

        Api.GetCharacters()
            .then(res => {
                if (!res.data.err)
                    this.setState({ characters: res.data.data })
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })

        Api.GetFavoritesNotes()
            .then(res => {
                if (!res.data.err)
                    this.setState({ notes: res.data.data })
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })
    }

    copyFrom(id) {
        this.setState({ loading: true });
    }
    
    loadEncounter(id) {
        let encounter = this.state.encounters.find(e => e.id == id);
        if (encounter === undefined)
            return this.setState({ encounter: null });

        this.setState({ encounter: encounter });
    }

    save() {

    }
	
	render() {

        const { event } = this.props;

        return (
			<Card small className="h-100">
				<CardHeader className="border-bottom py-0">
                    <Row>
                        <Col className='py-0'><h6 className="m-0 py-2">Note manager</h6></Col>
                        <Col lg="2" className='border-left py-2'>
                            <FormSelect size="sm" className="text-center" value={this.state.encounter ? this.state.encounter.id : ''} onChange={(event) => this.loadEncounter(event.target.value) }>
                                <option value=''>Encounter...</option>
                                {this.state.encounters.map((value, index) => {
                                    return (
                                        <option key={value.id} value={value.id}>{value.name}</option>
                                    )
                                })}
                            </FormSelect>
                        </Col>
                        {this.state.loading && (<h1 className='material-icons spin'>refresh</h1>)}
                    </Row>
				</CardHeader>
                {this.state.error && (
                    <CardBody
                        className="bg-danger text-white text-center p-3 "
                        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                        <i className='material-icons'>error</i> {this.state.error}
                    </CardBody>   
                )}
                {this.state.encounter && (
                    <CardBody className="pt-0 pb-0 h-100 bg-light border-bottom">
                        <Row className="py-0 h-100">
                            <Col lg="2" className="bg-light border-right overflow-auto vh-70">
                                <Row>
                                    <Col className='border-bottom py-2'>
                                        <FormSelect size="sm" className="text-center" onChange={(event) => { this.copyFrom(event.target.value); event.target.value = ''; } }>
                                            <option value=''>Copy from...</option>
                                            {this.state.notes.map((value, index) => {
                                                return (
                                                    <option key={value.id} value={value.id}>{value.title}</option>
                                                )
                                            })}
                                        </FormSelect>
                                    </Col>
                                </Row>

                                <Row>
                                    <ButtonGroup className="mb-0 d-flex w-100">
                                        {this.types.map((v, i) => {
                                            return (
                                                <Button squared
                                                    key={v.type}
                                                    onClick={(ev) => this.setState({ selectedType: v.type })} 
                                                    theme={this.state.selectedType == v.type ? 'primary' : 'white'}
                                                    className="w-100 border-bottom border-0"
                                                >
                                                    {v.label}
                                                </Button>
                                            )
                                        })}
                                    </ButtonGroup>
                                </Row>

                                {this.roles.map((role, idx) => {
                                    return (
                                        <Row key={role.type} className="mb-2">
                                            <Col lg="12 py-1 bg-white mb-2 border-bottom border-top">
                                                <div className="text-center"><img src={`/images/Blizzard/role-${role.label}.png`} alt={role.label} width="20" /></div>
                                            </Col>
                                            <Col lg="12 px-0">
                                                {this.state.characters.filter(c => c.role === role.type && c.type == this.state.selectedType).sort((a, b) => a.class < b.class).map((character, index) => {
                                                    return (
                                                        <CharacterCard key={character.id} character={character} icon={false} className='border-right-0 border-left-0 my-1 d-block' onClick={() => alert(character.name) } />
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                            <Col lg="10">
                                <Row className='border-bottom'>
                                    <Col className="text-center">
                                        <h5 className="m-0 py-2">{this.state.encounter.name}</h5>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                )}
                
                <CardFooter>
                    {this.state.encounter && (<Button onClick={() => this.save() }><i className='material-icons'>save</i> Save</Button>)}
                </CardFooter>
			</Card>
		);
	}
}

export default CreateNote
