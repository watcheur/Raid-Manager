import React from "react";
import PropTypes from "prop-types";
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

import Api from '../../data/api';
import Blizzard from '../../data/blizzard';

import CharacterCard from '../characters/CharacterCard';

class CreateComp extends React.Component {
    state = {
        // data
        encounters: [],
        characters: [],
        // selection
        encounter: null,
        composition: null,
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
        this.charToComp = this.charToComp.bind(this);
        this.compToChars = this.compToChars.bind(this);
    }
    
    componentDidMount() {
        if (this.props.raid) {
            this.setState({ loading: true });
            Api.GetRaidEncounters(this.props.raid.id)
                .then(res => {
                    this.setState({ loading: false });
                    if (!res.data.err) {
                        this.setState({ encounters: res.data.data });

                        this.setState({ encounter: res.data.data[0] });
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
    }
    
    loadEncounter(id) {
        let encounter = this.state.encounters.find(e => e.id == id);
        if (encounter === undefined)
            return this.setState({ encounter: null });

        this.setState({ encounter: encounter, loading: true });
        Api.GetCompEncounter(this.props.event.id, encounter.id)
            .then(res => {
                if (!res.data.err)
                    this.setState({ composition: res.data.data, loading: false })
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })
    }

    charToComp(character, role) {
        let chars = this.state.characters;
        let comp = this.state.selectedCharaters;

        let cl = Blizzard.ClassToObj(character.class).label;

        console.log("spec", character.spec);
        console.log("tanks", Blizzard.Characters.Specs.TANK);

        if (role === Blizzard.Characters.Role.TANK && Blizzard.Characters.TankClasses.indexOf(character.class) === -1)
            return alert(`You've seen a ${cl} tank ? Really ?`);

        if (role === Blizzard.Characters.Role.HEAL && Blizzard.Characters.HealClasses.indexOf(character.class) === -1)
            return alert(`You've seen a ${cl} heal ? Really ?`);

        chars.splice(chars.findIndex(c => c.id === character.id), 1);

        character.originalRole = character.role;
        character.role = (role === undefined ? character.role : role );

        comp.push(character);

        this.setState({
            characters: chars,
            selectedCharaters: comp
        });
    }

    compToChars(character) {
        let chars = this.state.characters;
        let comp = this.state.selectedCharaters;

        comp.splice(comp.findIndex(c => c.id === character.id), 1);

        if (character.originalRole != character.role)
            character.role = character.originalRole;

        comp.push(chars);

        this.setState({
            characters: chars,
            selectedCharaters: comp
        });
    }

	componentWillUnmount() {
		
	}
	
	render() {
        return (
			<Card small className="h-100">
				<CardHeader className="border-bottom pb-3">
                    <Row>
                        <Col lg="10"><h6 className="m-0">Composition manager</h6></Col>
                        <Col>
                            <FormSelect size="sm" className="text-center" selected={this.state.encounter} onChange={(event) => this.loadEncounter(event.target.value) }>
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
                    <CardBody className="pt-0 pb-0">
                        <Row className="border-bottom py-0 bg-light min-vh-50">
                            <Col lg="2" className="bg-white border-right">
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
                                        <Row key={role.type} className="border-bottom">
                                            <Col lg="12 py-2">
                                                <div className="text-center"><img src={`/images/Blizzard/role-${role.label}.png`} alt={role.label} width="25" /></div>
                                            </Col>
                                            <Col lg="12 px-0">
                                                {this.state.characters.filter(c => c.role === role.type && c.type == this.state.selectedType).map((character, index) => {
                                                    return (
                                                        <CharacterCard key={character.id} character={character} className='d-block' onClick={() => this.charToComp(character, role.type) } />
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                            <Col lg="10">
                                {this.roles.map((role, idx) => {
                                    return (
                                        <Row key={role.type}>
                                            <Col lg="12 py-2 border-bottom bg-white">
                                                <img src={`/images/Blizzard/role-${role.label}.png`} alt={role.label} width="25" />
                                            </Col>
                                            <Col lg="12 px-0 min-vh-10">
                                                {this.state.selectedCharaters.filter(c => c.role === role.type).map((character, index) => {
                                                    return (
                                                        <CharacterCard key={character.id} character={character} className="d-inline-block" onClick={() => this.compToChars(character) } />
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                        </Row>
                    </CardBody>
                )}
                <CardFooter />
			</Card>
		);
	}
}

export default CreateComp
