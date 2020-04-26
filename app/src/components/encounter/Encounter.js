import React, { useRef } from "react";
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

import Utils from '../../utils/utils';

class Encounter extends React.Component {
    state = {
        collapsed: false,
        characters: [],
        note: null,
        noteFormatted: '',
        noteRaw: '',
        copy: 'Copy',
        loading: false
    }

    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);

        this.copyRef = React.createRef();
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
                        let note = res.data.data[0].note;

                        let text = '';

                        if (note) {
                            console.log(note.text); 
                            let parsed = JSON.parse(note.text);
                            if (parsed.ops) {
                                parsed.ops.forEach((opt, idx) => {
                                    let txt = '';
                                    if (typeof opt.insert === 'object' && opt.insert.wowchar)
                                        txt = opt.insert.wowchar.note;
                                    else
                                        txt = opt.insert;

                                    text += txt;
                                });
                            }
                        }

                        this.setState({
                            characters: res.data.data[0].characters,
                            note: note,
                            noteFormatted: text.split('\n').map((item, i) => {
                                return `<p>${item}</p>`;
                            }).join(' '),
                            noteRaw: text
                        })
                    }
                }
            })
            .catch(err => {
                console.log("err", err);
                this.setState({ error: err.message, loading: false })
            })
    }

    copyToClipboard() {
        this.copyRef.current.select();
        document.execCommand('copy');
        this.setState({ copy: 'Copied' });
        setTimeout(() => this.setState({ copy: 'Copy' }), 1000);
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
                        <Col md="3" className='text-right'>
                            <img src="/images/blizzard/role-TANK.png" width="15" /> {tanks.length}
                            <img src="/images/blizzard/role-HEAL.png" width="15" className="ml-2" /> {heals.length}
                            <img src="/images/blizzard/role-DPS.png" width="15" className="ml-2" /> {melees.length + rangeds.length}
                            <span className="mx-2">({this.state.characters.length})</span>
                            {this.state.loading && (<h6 className='material-icons spin m-0'>refresh</h6>)}
                        </Col>
                    </Row>
                    <Collapse open={this.state.collapsed}>
                        <Row className="p-3">
                            <Col md="2">
                                <h5>Tanks</h5>

                                {tanks.map((c, idx) => {
                                    return (
                                        <CharacterCard key={c.id} character={c} icon={false} className="text-center m-1" />
                                    )
                                })}
                            </Col>
                            <Col md="2">
                                <h5>Heals</h5>

                                {heals.map((c, idx) => {
                                    return (
                                        <CharacterCard key={c.id} character={c} icon={false} className="text-center m-1" />
                                    )
                                })}
                            </Col>
                            <Col md="8">
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
                            {this.state.note && (
                            <Col md="12">
                                <h5>
                                    Note 
                                    {document.queryCommandSupported('copy') && <div className='d-inline px-4'><Button size="sm" spill theme="dark" onClick={this.copyToClipboard}><i className='material-icons'>save</i> {this.state.copy}</Button></div>}
                                </h5>
                                <Col className="p-3" dangerouslySetInnerHTML={{__html: this.state.noteFormatted.replace(Utils.colorRegex, Utils.colorReplace).replace(/(\#ffffff)/i, '#000000')}}>
                                </Col>
                                <textarea ref={this.copyRef} style={{width: '0px', height:'0px', opacity: '.01', height: '0', position: 'absolute', zIndex: -1}}>{this.state.noteRaw}</textarea>
                            </Col>)}
                        </Row>
                    </Collapse>
                </ListGroupItem>
            </div>
        )
    }
}

export default Encounter;