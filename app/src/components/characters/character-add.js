import React from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormInput,
  FormFeedback,
  FormSelect,
  Button,
  Card,
  CardHeader
} from "shards-react";

import Api from '../../data/api';

class CharacterAdd extends React.Component {
	defaultState = {
		realms: [],
		realm: '',
		name: '',
		type: 0,
		invalidName : false,
		errorNameText: '',
		invalidRealm: false
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState,...props}
		this.defaultState.realm = props.realm;
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(event) {
		event.preventDefault();

		this.setState({
			invalidName: this.state.name.length === 0,
			invalidRealm: this.state.realm.length === 0
		})

		if (this.state.name.length === 0)
			return this.setState({ errorNameText: 'You must specify a character name' })

		const { name, realm, type } = this.state;
		if (name.length > 0 && realm.length > 0) {
			Api.CreateCharacter({
				name: name,
				realm: realm,
				type: type
			})
			.then(res => {
				if (!res.data.err) {
					this.setState({ ...this.defaultState });
				}
			})
			.catch(err => {
				this.setState({ errorNameText: err.response.data.message, invalidName: true });
			})
		}
	}

    componentDidMount() {
        Api.GetRealms(this.props.parameters)
            .then(res => {
                if (!res.data.err) {
					this.setState({ realms: res.data.data })
					this.defaultState.realms = res.data.data;
				}
            })
            .catch(err => alert(err))
	}

	componentWillUnmount() {
		
	}
	
	render() {
		return (
			<Card small className="mb-4 overflow-hidden">
				<CardHeader className="border-bottom">
					<h6 className="m-0">Add a character</h6>
				</CardHeader>
				<ListGroup flush>
					<ListGroupItem className="p-3">
						<Row>
							<Col>
								<form onSubmit={this.handleSubmit}>
									<Row form>
										<Col md="1" className="form-group">
											<label htmlFor="feRealm">Type</label>
											<FormSelect
												id="feRealm"
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
														<option value={realm.slug} key={realm.id}>{realm.name}</option>
													);
												})}
											</FormSelect>
											<FormFeedback invalid>A realm must be selected</FormFeedback>
										</Col>
										<Col md="6" className="form-group">
											<label htmlFor="feCharacter">Character</label>
											<FormInput
												id="feCharacter"
												type="text"
												placeholder="Name"
												invalid={this.state.invalidName}
												value={this.state.name}
												required
												onChange={(event) => { this.setState({ name: event.target.value, errorNameText: '', invalidName: false }); }}
											/>
											<FormFeedback invalid>{this.state.errorNameText}</FormFeedback>
										</Col>
										<Col md="1" className="form-group d-flex flex-column">
											<Button type="submit" className="mt-auto">
												<i className="material-icons">save</i> Add
											</Button>
										</Col>
									</Row>
								</form>
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
	realm: PropTypes.string
};

CharacterAdd.defaultProps = {
	realm: ''
};

export default CharacterAdd
