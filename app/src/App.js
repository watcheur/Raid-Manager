import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Backend from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import routes from "./routes";
import withTracker from "./withTracker";

import { Modal, ModalHeader, Row, Col, FormInput, Button, Form } from "shards-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

//import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.css";
import "./assets/blizzard.css";
import "./assets/toast.css";
import "./assets/override.css";

import Context from './utils/context';

class EndpointPrompt extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			prompted: false,
			value: localStorage.getItem('api') || ''
		}

		window.alert = window.console.log;
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		document.addEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown(event) {
		if (event.key === "F10" || event.keyCode === 121)
			this.setState({ prompted: !this.state.prompted });
	}

	handleSubmit(event)
	{
		event.preventDefault();

		if (this.state.value && this.state.value.length > 0)
			localStorage.setItem('api', this.state.value);
		if (!this.state.value || this.state.value.length === 0)
			localStorage.removeItem('api');
		window.location.reload();
	}

	render() {
		return (
			<Modal open={this.state.prompted}>
				<ModalHeader>API Endpoint</ModalHeader>
				<Form onSubmit={this.handleSubmit}>
					<Row className="border-top py-2 px-2 m-0" form>
						<Col md="9" className="m-0 px-1"><FormInput value={this.state.value} onChange={(ev) => this.setState({value: ev.target.value})} placeholder="API endpoint..." /></Col>
						<Col className="m-0 px-0"><Button className="btn-block">Save</Button></Col>
					</Row>
				</Form>
			</Modal>
		);
	}
}

export default () => (
	<DndProvider backend={Backend}>
		<Router basename={""}>
			<div>
			<EndpointPrompt />
			{routes.map((route, index) => {
				return (
				<Route
					key={index}
					path={route.path}
					exact={route.exact}
					component={withTracker(props => {
					return (
						<route.layout {...props}>
						<route.component {...props} />
						</route.layout>
					);
					})}
				/>
				);
			})}
			</div>
		</Router>
	</DndProvider>
)