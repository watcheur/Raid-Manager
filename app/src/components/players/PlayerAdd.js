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
  InputGroup,
  CardBody
} from "shards-react";
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import Api from '../../data/api';
import GameData from '../../data/gamedata';

class PlayerAdd extends React.Component {
	defaultState = {
        loading: false,
        error: '',

        rank: 0,
        name: ''
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState}
		this.defaultState.realm = props.realm;
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(ev) {
        ev.preventDefault();

        this.setState({ loading: true, error: '' })

        try {
            const { name, rank } = this.state;

            const res = await Api.CreatePlayer({ name: name, rank: rank, team: this.props.team.id });
            this.setState({ loading: false, error: res.data.error, error: res.data.message, name: '', rank: 0 })
            if (!res.data.error)
                toast.success(`Player ${name.capitalize()} added`)
        }
        catch (error)
        {
            // Api send a response who isn't a 2XX
            if (error.response)
                this.setState({ loading: false, error: error.response.data.message });
            else
                this.setState({ loading: false, error: error.message });
        }
    }
	
	render() {
		const { team } = this.props;

		if (!team)
			return (<div className="bg-warning text-white text-center" style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}> <i className="material-icons">warning</i> No team</div>)

		return (
			<Card small className="mb-4 overflow-hidden">
                <CardHeader className="py-0">
                    {this.state.loading && (
                        <h1 className="float-left py-3 m-0 material-icons spin ">refresh</h1>
                    )}
                    <h5 className="m-0 py-3">Add player</h5>
                </CardHeader>
                <CardBody className="p-0 pb-3">
                    <table className="table mb-0">
                        <tbody>
                            <tr>
                                <td colspan="3" className="py-2">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Row form>
                                            <Col sm="1" md="1" lg="1" className="form-group mb-0">
                                                <InputGroup>
                                                    <FormSelect
                                                        id="feRank"
                                                        value={this.state.rank}
                                                        required
                                                        onChange={(event) => { this.setState({ rank: event.target.value }) }}
                                                    >
                                                        <option>Rank</option>
                                                        <option value={GameData.Players.Ranks.Raider}>Raider</option>
                                                        <option value={GameData.Players.Ranks.Apply}>Apply</option>
                                                        <option value={GameData.Players.Ranks.TBD}>TBD</option>
                                                        <option value={GameData.Players.Ranks.Out}>Out</option>
                                                    </FormSelect>
                                                </InputGroup>
                                            </Col>
                                            <Col className="form-group mb-0">
                                                <InputGroup>
                                                    <FormInput
                                                        id="feName"
                                                        type="text"
                                                        placeholder="Name"
                                                        invalid={this.state.error}
                                                        value={this.state.name}
                                                        required
                                                        onChange={(event) => { this.setState({ name: event.target.value }); }}
                                                    />
                                                    <div className="input-group-append">
                                                        <Button type="submit">
                                                            <i className={`material-icons ${this.state.loading ? 'spin': ''}`}>{this.state.loading ? 'refresh' : 'save'}</i> Add
                                                        </Button>
                                                    </div>
                                                    <FormFeedback valid={false}>{this.state.error}</FormFeedback>
                                                </InputGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardBody>
            </Card>
		);
	}
}

PlayerAdd.propTypes = {
	user: PropTypes.object,
	team: PropTypes.object
};

export default PlayerAdd
