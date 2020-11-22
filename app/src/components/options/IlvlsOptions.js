import React from 'react';
import {
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Form,
    FormInput,
    FormGroup,
    Button
} from "shards-react";
import { toast } from 'react-toastify';

//import Context from '../../utils/context';
import Api from '../../data/api';
import { Dispatcher, Constants } from "../../flux";

/**
 * @param {Object} parameters
 */
/*
export default class IlvlsOptions extends React.Component {
    defaultState = {
        loading: false,
        error: null,
        artifact : Context.Options.artifact_ilvl || 0,
        legendary: Context.Options.legendary_ilvl ||0,
        epic: Context.Options.epic_ilvl || 0,
        rare: Context.Options.rare_ilvl || 0,
        uncommon: Context.Options.uncommon_ilvl || 0,
        common: Context.Options.common_ilvl || 0,
        poor: Context.Options.poor_ilvl || 0
    };
    state = this.defaultState;

    constructor(props) {
        super(props);

        this.dispatcherToken = null;
        this.setColorState = this.setColorState.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.OPTIONS_LOADED:
                    this.setState({ ...{
                        artifact : Context.Options.artifact_ilvl || 0,
                        legendary: Context.Options.legendary_ilvl ||0,
                        epic: Context.Options.epic_ilvl || 0,
                        rare: Context.Options.rare_ilvl || 0,
                        uncommon: Context.Options.uncommon_ilvl || 0,
                        common: Context.Options.common_ilvl || 0,
                        poor: Context.Options.poor_ilvl || 0
                    } });
                    break;
                default:
            }
        });
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    setColorState(color, value) {
        let st = {};
        st[color] = value;
        this.setState(st);
    }

    handleSubmit(ev) {
        ev.preventDefault();

        this.setState({ loading: true })
        let opts = [
            { key: "artifact_ilvl", value: this.state.artifact },
            { key: "legendary_ilvl", value: this.state.legendary },
            { key: "epic_ilvl", value: this.state.epic },
            { key: "rare_ilvl", value: this.state.rare },
            { key: "uncommon_ilvl", value: this.state.uncommon },
            { key: "common_ilvl", value: this.state.common },
            { key: "poor_ilvl", value: this.state.poor },
        ]

        Api.CreateOptions({ options: opts })
            .then(res => {
                this.setState({ loading: false });
                if (!res.data.err)
                    toast.success('Item levels colors updated')
            })
            .catch(err => {
                this.setState({ loading: false });
                toast.error(err.message);
            })
    }

    render() {
        const colors = ['artifact', 'legendary', 'epic', 'rare', 'uncommon', 'common', 'poor'];

        return (
            <Card small>
                <CardHeader className="border-bottom">
                    <Row>
                        <Col md="10">
                            <h6 className="m-0">
                                Item levels colors
                            </h6>
                        </Col>
                        <Col md="1">
                            {this.state.loading && (
                                <Col><i className='material-icons spin'>update</i></Col>
                            )}
                        </Col>
                    </Row>
                </CardHeader>

                <ListGroup flush>
                    <ListGroupItem className="p-3">
                        <Row>
                            <Col>
                                <Form onSubmit={this.handleSubmit}>
                                    {colors.map((color, index) => {
                                        return (
                                        <Row form>
                                            <Col className={`form-group ${color}`}>
                                                <label htmlFor={`fe${color.capitalize()}Color`}>{color.capitalize()}</label>
                                                <FormInput
                                                    id={`fe${color.capitalize()}Color`}
                                                    type="number"
                                                    value={this.state[color]}
                                                    onChange={(event) => { parseInt(event.target.value) && this.setColorState(color, event.target.value, ); }}
                                                    min={0}
                                                    placeholder="Item level"
                                                />
                                            </Col>
                                        </Row>
                                        )
                                    })}
                                    
                                    <Button type="submit">Save</Button>
                                </Form>
                            </Col>
                        </Row>
                    </ListGroupItem>
                </ListGroup>
            </Card>
        )
    }
}
*/