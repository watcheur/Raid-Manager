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
  Collapse,
  CardFooter
} from "shards-react";
import { toast } from 'react-toastify';
import moment from "moment";

import Blizzard from '../../data/blizzard';
import Api from '../../data/api';
import { Dispatcher, Constants } from "../../flux";
import CharacterCard from '../characters/CharacterCard';

class Encounter extends React.Component {
    state = {
        collapsed: false,
        characters: [],
        note: null,
        loading: false
    }

    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.COMPOSITION_CREATED:
                case Constants.COMPOSITION_UPDATED:
                case Constants.COMPOSITION_DELETE:
                    if (payload.encounter == this.props.encounter.id && payload.event == this.props.event.id)
                        this.loadEncounter();
               default:
            }
        });
        this.loadEncounter();
    }
    
    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    loadEncounter()
    {
        const { event, encounter } = this.props;

        this.setState({ loading: true });
        Api.GetCompEncounter(event.id, encounter.id)
            .then(res => {
                if (!res.data.err) {
                    this.setState({ loading: false })
                    if (res.data.data.length) {
                        this.setState({
                            characters: res.data.data[0].characters,
                            note: res.data.data[0].note
                        })
                    }
                }
            })
            .catch(err => {
                this.setState({ error: err.message, loading: false })
            })
    }

    toggle() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    render()
    {
        const { encounter } = this.props;

        if (this.state.characters.length == 0)
            return('');

        const   rangeds = this.state.characters.filter(c => c.role == Blizzard.Characters.Role.DPS && Blizzard.SpecToObj(c.spec).range),
                melees = this.state.characters.filter(c => c.role == Blizzard.Characters.Role.DPS && !Blizzard.SpecToObj(c.spec).range),
                heals = this.state.characters.filter(c => c.role == Blizzard.Characters.Role.HEAL),
                tanks = this.state.characters.filter(c => c.role == Blizzard.Characters.Role.TANK)

        return (
            <div>
                <ListGroupItem className='border-top border-bottom border-0 rounded-0'>
                    <Row>
                        <Col>
                            <h6 className="m-0" onClick={this.toggle}>{encounter.name} <i className='material-icons'>{this.state.collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i></h6>
                        </Col>
                        <Col lg="2">
                            <img src="/images/blizzard/role-TANK.png" width="15" /> {tanks.length}
                            <img src="/images/blizzard/role-HEAL.png" width="15" className="ml-2" /> {heals.length}
                            <img src="/images/blizzard/role-DPS.png" width="15" className="ml-2" /> {melees.length + rangeds.length}
                            {this.state.loading && (<h6 className='material-icons spin m-0'>refresh</h6>)}
                        </Col>
                    </Row>
                    <Collapse open={this.state.collapsed}>
                        <Row className="p-3">
                            <Col lg="2">
                                <h5>Tanks</h5>

                                {tanks.map((c, idx) => {
                                    return (
                                        <CharacterCard key={c.id} character={c} icon={false} className="text-center m-1" />
                                    )
                                })}
                            </Col>
                            <Col lg="2">
                                <h5>Heals</h5>

                                {heals.map((c, idx) => {
                                    return (
                                        <CharacterCard key={c.id} character={c} icon={false} className="text-center m-1" />
                                    )
                                })}
                            </Col>
                            <Col lg="8">
                                <h5>Dps</h5>

                                <h6 className="mb-0">Melee</h6>
                                {melees.map((c, idx) => {
                                    return (
                                        <CharacterCard key={c.id} character={c} icon={false} className="text-center d-inline-block m-1" />
                                    )
                                })}

                                <h6 className="mt-2 mb-0">Ranged</h6>
                                {rangeds.map((c, idx) => {
                                    return (
                                        <CharacterCard key={c.id} character={c} icon={false} className="text-center d-inline-block m-1" />
                                    )
                                })}
                            </Col>
                        </Row>
                    </Collapse>
                </ListGroupItem>
            </div>
        )
    }
}

export default Encounter;