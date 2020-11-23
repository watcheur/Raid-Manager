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
  InputGroup
} from "shards-react";
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import Api from '../../data/api';
import GameData from '../../data/gamedata';

class CharacterAdd extends React.Component {
	defaultState = {
		realms: [],
		players: [],
		player: null,
		realm: '',
		name: '',
		type: 0,
		errorName: '',
		invalidRealm: false,
		loading: false,
		error: ''
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState,...props}
		this.defaultState.realm = props.realm;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.selectPlayer = this.selectPlayer.bind(this);

		this.playerRef = React.createRef();
	}

	async selectPlayer(arr) {
		let value = (arr ? arr[0] : null);
		if (value) {
			if (value.customOption) {
				try
				{
					const res = await Api.CreatePlayer({ name: value.name, rank: GameData.Players.Ranks.TBD, team: this.props.team.id });
					if (res.data.data)
						this.setState({ player: res.data.data });
				}
				catch (error)
				{
					if (error.response)
						this.setState({ error: error.response.data.message })
					else
						this.setState({ error: error.message })
				}
			}
			else
				this.setState({ player: value })
		}
	}
	
	async handleSubmit(event) {
		event.preventDefault();

		this.setState({
			invalidName: this.state.name.length === 0,
			invalidRealm: this.state.realm.length === 0
		})

		if (this.state.name.length === 0)
			return this.setState({ errorName: 'You must specify a character name' })

		this.setState({ loading: true });
		const { name, realm, type, player } = this.state;

		if (name && realm) {

			try
			{
				const res = await Api.CreateCharacter({ name: name, realm, realm, type: type ?? 0, player: (player ? player.id : null)}, { team: this.props.team.id })
				if (!res.data.error)
				{
					this.defaultState.players.push(res.data.data);
					this.setState({ ...this.defaultState });
					toast.success(`Character ${name.capitalize()} added`);
				}

				if (this.playerRef && this.playerRef.current)
					this.playerRef.current.clear();
			}
			catch (error)
			{
				if (error.response)
					this.setState({ errorName: error.response.data.message, loading: false })
				else
					this.setState({ errorName: error.message, loading: false })
			}
		}
	}

    componentDidMount() {
		const { team, parameters } = this.props;

        Api.GetRealms({...parameters})
            .then(res => {
                if (!res.data.err) {
					this.setState({ realms: res.data.data })
					this.defaultState.realms = res.data.data;
				}
            })
			.catch(err => {
				if (err.response)
					this.setState({ error: 'GetRealms: ' + err.response.data.message })
				else
					this.setState({ error: 'GetRealms: ' + err.message })
			});

		Api.GetPlayers({ team: team.id })
			.then(res => {
                if (!res.data.err) {
					this.setState({ players: res.data.data })
					this.defaultState.players = res.data.data;
				}
			})
			.catch(err => {
				if (err.response)
					this.setState({ error: 'GetPlayers: ' + err.response.data.message })
				else
					this.setState({ error: 'GetPlayers: ' + err.message })
			});
	}

	componentWillUnmount() {
		
	}
	
	render() {
		const { team } = this.props;

		if (!team)
			return (<div className="bg-warning text-white text-center" style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}> <i className="material-icons">warning</i> No team</div>)

		return (
			<Card small className="mb-4">
				<CardHeader className="border-bottom">
					<h6 className="m-0">Add a character</h6>
				</CardHeader>
				{this.state.error && (
					<div
						className="bg-warning text-white text-center"
						style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
						<i className="material-icons">warning</i> {this.state.error}
					</div>
				)}
				<ListGroup flush>
					<ListGroupItem className="p-3">
						<Row>
							<Col>
								<Form onSubmit={this.handleSubmit}>
									<Row form>
										<Col md="2" className="form-group">
											<label htmlFor="fePlayer">Player</label>
											<Typeahead
												ref={this.playerRef}
												id="fePlayer"
												labelKey="name"
												placeholder="Choose a player..."
												newSelectionPrefix="Add: "
												selectHintOnEnter={true}
												allowNew={true}
												options={this.state.players}
												onChange={ev => this.selectPlayer(ev)}
											/>
										</Col>
										<Col md="2" className="form-group">
											<label htmlFor="feType">Type</label>
											<FormSelect
												id="feType"
												value={this.state.type}
												required
												onChange={(event) => { this.setState({ type: event.target.value }) }}
											>
												<option value="0">Main</option>
												<option value="1">Alt</option>
												<option value="2">Alt fun</option>
											</FormSelect>
										</Col>
										<Col md="4" className="form-group">
											<label htmlFor="feRealm">Server</label>
											<FormSelect
												id="feRealm"
												value={this.state.realm}
												invalid={this.state.invalidRealm}
												required
												onChange={(event) => { this.setState({ realm: event.target.value }); }}>
												<option>Choose...</option>
												{this.state.realms.sort(c => c.type).map((realm, index) => {
													return (
														<option value={realm.id} key={realm.id}>{realm.name}</option>
													);
												})}
											</FormSelect>
											<FormFeedback valid={false}>A realm must be selected</FormFeedback>
										</Col>
										<Col className="form-group">
											<label htmlFor="feCharacter">Character</label>
											<InputGroup>
												<FormInput
													id="feCharacter"
													type="text"
													placeholder="Name"
													invalid={this.state.errorName}
													value={this.state.name}
													required
													onChange={(event) => { this.setState({ name: event.target.value, errorName: '' }); }}
												/>
												<div className="input-group-append">
													<Button type="submit">
														<i className={`material-icons ${this.state.loading ? 'spin': ''}`}>{this.state.loading ? 'refresh' : 'save'}</i> Add
													</Button>
												</div>
												<FormFeedback valid={false}>{this.state.errorName}</FormFeedback>
											</InputGroup>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</ListGroupItem>
				</ListGroup>
			</Card>
		);
	}
}

CharacterAdd.propTypes = {
	/**
	 * Default realm
	 */
	realm: PropTypes.string,

	user: PropTypes.object,
	team: PropTypes.object
};

CharacterAdd.defaultProps = {
	realm: ''
};

export default CharacterAdd
