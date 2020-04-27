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
import GameData from '../../data/gamedata';

import CharacterCard from '../characters/CharacterCard';
import RoleZone from '../composition/RoleZone';

class CreateComp extends React.Component {
    characters = []

    state = {
        // data
        encounters: [],
        characters: [],
        // selection
        encounter: null,
        selectedType: 0,
        selectedCharaters: [],
        utilities: [],
        // other
        loading: true,
        error: ''
    }

    roles = [
        { type: GameData.Characters.Role.TANK, label: 'TANK' },
        { type: GameData.Characters.Role.HEAL, label: 'HEAL' },
        { type: GameData.Characters.Role.DPS, label: 'DPS' }
    ];

    types = [
        { type: GameData.Characters.Type.MAIN, label: 'Mains' },
        { type: GameData.Characters.Type.ALT, label: 'Alts' },
        { type: GameData.Characters.Type.ALT_FUN, label: 'Alts fun' }
    ];

    constructor(props) {
        super(props);
        
        this.loadEncounter = this.loadEncounter.bind(this);
        this.copyFrom = this.copyFrom.bind(this);
        this.charToComp = this.charToComp.bind(this);
        this.compToChars = this.compToChars.bind(this);
        this.loadUtilities = this.loadUtilities.bind(this);
        this.loadUtilitiesThrottled = _.throttle(this.loadUtilities, 1000);
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
                if (!res.data.err) {
                    this.setState({ characters: _.cloneDeep(res.data.data) })
                    this.characters = _.cloneDeep(res.data.data);
                }
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })
            
        this.loadUtilitiesThrottled();
    }

    copyFrom(id) {
        this.setState({ loading: true });
        Api.GetCompEncounter(this.props.event.id, id)
            .then(res => {
                if (!res.data.err) {
                    const { chars, comp } = this.compFromEncounterData(res.data.data);

                    this.setState({
                        characters: chars,
                        selectedCharaters: comp,
                        loading: false
                    })
                }
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })
    }

    compFromEncounterData(data) {
        let comp = [];
        let chars = [];

        if (data[0] && data[0].characters.length > 0) {
            this.characters.forEach(char => {
                let c = data[0].characters.find(c => c.id == char.id);
                if (c !== undefined) {
                    char.originalRole = char.role;
                    char.role = c.role;
                    comp.push(char);
                }
                else
                    chars.push(char);
            });
        }
        else
            chars = this.characters;

        return { chars, comp };
    }
    
    loadEncounter(id) {
        let encounter = this.state.encounters.find(e => e.id == id);
        if (encounter === undefined)
            return this.setState({ encounter: null });

        this.setState({ encounter: encounter, loading: true });
        Api.GetCompEncounter(this.props.event.id, encounter.id)
            .then(res => {
                if (!res.data.err) {
                    const { chars, comp } = this.compFromEncounterData(res.data.data);

                    this.setState({
                        characters: chars,
                        selectedCharaters: comp,
                        loading: false
                    })

                    this.loadUtilities();
                }
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })
    }

    charToComp(character, role) {
        let chars = this.state.characters;
        let comp = this.state.selectedCharaters;

        let newChars = [];

        if (comp.length >= (this.props.event.difficulty == GameData.Raids.Difficulties.Mythic ? 20 :30))
            return alert("You can't put more player for this difficulty")

        let cl = GameData.ClassToObj(character.class).label;

        if (role === GameData.Characters.Role.TANK && GameData.Characters.TankClasses.indexOf(character.class) === -1)
            return alert(`You've seen a ${cl} tank ? Really ?`);

        if (role === GameData.Characters.Role.HEAL && GameData.Characters.HealClasses.indexOf(character.class) === -1)
            return alert(`You've seen a ${cl} heal ? Really ?`);

        chars.forEach(c => { if (c.id !== character.id) newChars.push(c) })

        character.originalRole = character.role;
        character.role = (role === undefined ? character.role : role );

        comp.push(character);

        this.setState({
            characters: newChars,
            selectedCharaters: comp
        });

        this.loadUtilitiesThrottled();
    }

    compToChars(character) {
        let chars = this.state.characters;
        let comp = this.state.selectedCharaters;
        let newComp = [];

        comp.forEach(c => { if (c.id !== character.id) newComp.push(c) })

        if (character.originalRole != character.role)
            character.role = character.originalRole;

        chars.push(character);

        this.setState({
            characters: chars,
            selectedCharaters: newComp,
            selectedType: (character.type !== this.state.selectedType ? character.type : this.state.selectedType)
        });

        this.loadUtilitiesThrottled();
    }

    charDropped(id, role) {
        let character = this.state.characters.find(c => c.id === id);
        if (character)
            return this.charToComp(character, role);

        let chars = this.state.selectedCharaters;
        let idx = chars.findIndex(c => c.id === id);
        chars[idx].role = role;

        this.setState({
            selectedCharaters: chars
        })

        this.loadUtilitiesThrottled();
    }

    loadUtilities() {
        let utilities = GameData.GetUtilities().map(ut => {
            if (this.state.selectedCharaters.length)
                ut.data = ut.data.map(d => {
                    d.spells = d.spells.map(s => {
                        s.actives = s.count(this.state.selectedCharaters);
                        return s;
                    })
                    return d;
                });
            return ut;
        });

        this.setState({ utilities: utilities });
    }

    save() {
        const chars = this.state.selectedCharaters.map(c => {
            return {
                character: c.id,
                role: c.role
            }
        })

        this.setState({ error: '', loading: true })
        Api.CreateComp({
            event: this.props.event.id,
            encounter: this.state.encounter.id,
            characters: chars
        })
        .then(res => {
            if (!res.data.err)
                toast.success(`Composition for ${this.state.encounter.name} saved`);

            this.setState({ error: '', loading: false });
        })
        .catch(err => {
            this.setState({ error: err.message, loading: false })
        })
    }
	
	render() {

        const { event } = this.props;

        return (
			<Card small className="h-100">
				<CardHeader className="border-bottom py-0">
                    <Row>
                        <Col className='py-0'><h6 className="m-0 py-2">Composition manager</h6></Col>
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
                                            {this.state.encounters.map((value, index) => {
                                                return (
                                                    <option key={value.id} value={value.id}>{value.name}</option>
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
                                                <div className="text-center"><img src={`/images/GameData/role-${role.label}.png`} alt={role.label} width="20" /></div>
                                            </Col>
                                            <Col lg="12 px-0">
                                                {this.state.characters.filter(c => c.role === role.type && c.type == this.state.selectedType).sort((a, b) => a.class < b.class).map((character, index) => {
                                                    return (
                                                        <CharacterCard key={character.id} character={character} icon={false} className='border-right-0 border-left-0 my-1 d-block' onClick={() => this.charToComp(character, role.type) } />
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                            <Col lg="8">
                                <Row className={classNames(this.state.selectedCharaters.length >= (event.difficulty === GameData.Raids.Difficulties.Mythic ? 20: 30) ? 'bg-success' : 'bg-warning', 'px-3')}>
                                    <Col></Col>
                                    <Col lg="9" className="text-center">
                                        <h5 className="m-0 py-2">{this.state.encounter.name}</h5>
                                    </Col>
                                    <Col className={classNames('players-count', 'p-0', 'text-right')}>
                                        <h5 className='m-0 py-2'>{this.state.selectedCharaters.length} / {event.difficulty === GameData.Raids.Difficulties.Mythic ? '20': '30'}</h5>
                                    </Col>
                                </Row>
                                {this.roles.map((role, idx) => {
                                    return (
                                        <Row key={role.type}>
                                            <Col lg="12" className="py-2 border-bottom border-top bg-white text-center">
                                                <img src={`/images/GameData/role-${role.label}.png`} alt={role.label} width="25" />
                                            </Col>
                                            <Col lg="12" className='px-0'>
                                                <RoleZone className={ (role.type == GameData.Characters.Role.DPS ? 'min-vh-30' : 'vh-6') }
                                                    onCharacterClick={(character) => this.compToChars(character)}
                                                    onCharacterDrop={(id) => this.charDropped(id, role.type)}
                                                    role={role.type}
                                                    characters={this.state.selectedCharaters.filter(c => c.role === role.type)}
                                                />
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Col>
                            <Col lg="2" className="bg-light border-left overflow-auto vh-70 utilities">
                                {this.state.utilities.map((ut, idx) => {
                                    return (
                                        <Row key={idx}>
                                            {/* Group (buff, debuff, ext cd) */}
                                            <Col lg="12" className="p-0 border-top bg-white text-center">
                                                <h5 className='my-1'>{ut.label}</h5>
                                            </Col>
                                            <Col lg="12" className="px-0">
                                                {ut.data.map((group, gId) => {
                                                    return (
                                                        <Row key={gId} className='px-2'>
                                                            <Col lg="12" className='p-0 border-bottom border-top bg-white text-center'>
                                                                <h6 className='my-1'>{group.label}</h6>
                                                            </Col>
                                                            <Col lg="12" className='px-4 py-1'>
                                                                <table className='w-100 spells-list'>
                                                                    <tbody>
                                                                        {group.spells.map((sp, sId) => {
                                                                            return(
                                                                                <tr key={sId} className={sp.classNames}>
                                                                                    <td>
                                                                                        {sp.label}
                                                                                    </td>
                                                                                    <td className='text-right'>{sp.actives || 0}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </Col>
                                                        </Row>
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
                
                <CardFooter>
                    {this.state.encounter && (<Button onClick={() => this.save() }><i className='material-icons'>save</i> Save</Button>)}
                </CardFooter>
			</Card>
		);
	}
}

export default CreateComp
