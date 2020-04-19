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
  DatePicker,
  InputGroup
} from "shards-react";
import { toast } from 'react-toastify';
import moment from "moment";

import Api from '../../data/api';

class EventAdd extends React.Component {
	defaultState = {
        expansions: [],
        date: '',
        time: '',
        raid: '',
        difficulty: '',
        title: '',
        loading: false,
        invalidRaid: false,
        invalidDate: false,
        invalidTime: false,
        invalidDifficulty: false,
        apiError: false,
        apiErrorMessage: true
    }

    constructor(props) {
		super(props);

		this.state = {...this.defaultState, ...props}
		this.defaultState = {...this.state}
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(event) {
        event.preventDefault();

        let invalids = {
            invalidRaid: this.state.raid.length === 0,
            invalidDifficulty: this.state.difficulty.length === 0,
            invalidDate: this.state.date.length === 0,
            invalidTime: this.state.time.length === 0
        }
        
        this.setState(invalids);

        if (invalids.invalidTime || invalids.invalidDate || invalids.invalidRaid || invalids.invalidDifficulty)
            return;

        this.setState({ loading: true, apiError: false, apiErrorMessage: '' });
        Api.CreateEvent({
            title: this.state.title,
            schedule: moment(this.state.date).format(`YYYY-MM-DD ${this.state.time}:00`),
            raid: this.state.raid,
            difficulty: this.state.difficulty
        })
        .then(res => {
            this.setState({ loading: false });
            if (!res.data.err) {
                this.setState({ ...this.defaultState });
                toast.success(`Event created`)
            }
            else
                this.setState({ loading: false });
        })
        .catch(err => {
            this.setState({
                loading: false,
                apiError: true,
                apiErrorMessage: err.response.data.message
            });
        })
	}

    componentDidMount() {
        Api.GetExpansions()
            .then(res => {
                if (!res.data.err) {
					this.setState({ expansions: res.data.data })
					this.defaultState.expansions = res.data.data;
				}
            })
            .catch(err => alert(err))
	}

	componentWillUnmount() {
		
	}
	
	render() {
		return (
			<Card small>
				<CardHeader className="border-bottom">
					<h6 className="m-0">Add an event</h6>
				</CardHeader>
				<ListGroup flush>
					<ListGroupItem className="p-3">
						<Row>
							<Col>
								<Form onSubmit={this.handleSubmit}>
									<Row form>
										<Col md="3" className="form-group">
											<label htmlFor="feRaid">Raid</label>
											<FormSelect
												id="feRaid"
												value={this.state.raid}
                                                required
                                                invalid={this.state.invalidRaid}
												onChange={(event) => { this.setState({ raid: event.target.value }); }}>
												<option value=''>Choose...</option>
												{this.state.expansions.sort((a, b) => { return (a.id < b.id) }).map((exp, index) => {
													return (
														<optgroup key={exp.id} label={exp.name}>
                                                            {exp.raids.sort((a, b) => { return a.id < b.id }).map((raid, index) => {
                                                                return (<option key={raid.id} value={raid.id}>{raid.name}</option>)
                                                            })}
                                                        </optgroup>
													);
												})}
											</FormSelect>
											<FormFeedback valid={false}>Select a raid</FormFeedback>
										</Col>
                                        <Col md="2" className="form-group">
                                        <label htmlFor="feDifficulty">Difficulty</label>
											<FormSelect
                                                id="feDifficulty"
                                                value={this.state.difficulty}
                                                invalid={this.state.invalidDifficulty}
												required
												onChange={(event) => { this.setState({ difficulty: event.target.value }); }}>
												<option value=''>Choose...</option>
                                                <option value="0">LFR</option>
                                                <option value="1">Normal</option>
                                                <option value="2">Heroic</option>
                                                <option value="3">Mythic</option>
											</FormSelect>
											<FormFeedback valid={false}>Select a difficilty</FormFeedback>
                                        </Col>
                                        <Col md="3" className="form-group">
                                            <label htmlFor="feDate">Date</label>
                                            <InputGroup>
                                                <DatePicker
                                                    id="feDate"
                                                    selected={this.state.date}
                                                    invalid={this.state.invalidDate}
                                                    onChange={(value) => { this.setState({ date: (value ? value : undefined) }); }}
                                                    placeholderText="Start Date"
                                                    dropdownMode="select"
                                                    className="text-center"
                                                    locale="en_GB"
                                                    required
                                                />
                                                <FormInput
                                                    id="feTime"
                                                    type="time"
                                                    placeholder="Time"
                                                    invalid={this.state.invalidTime}
                                                    value={this.state.time}
                                                    className="text-center"
                                                    required
                                                    onChange={(event) => { this.setState({time: event.target.value}) }}/>
                                            </InputGroup>
                                        </Col>
                                        <Col md="4" className="form-group">
                                            <label htmlFor="feTitle">Title</label>
                                            <InputGroup>
                                                <FormInput
                                                    id="feTitle"
                                                    type="text"
                                                    placeholder="Title"
                                                    value={this.state.title}
                                                    required
                                                    onChange={(event) => { this.setState({ title: event.target.value }); }}
                                                />
												<div className="input-group-append">
													<Button type="submit">
														<i className={`material-icons ${this.state.loading ? 'spin': ''}`}>{this.state.loading ? 'refresh' : 'save'}</i> Add
													</Button>
												</div>
											</InputGroup>
                                        </Col>
									</Row>
                                    {this.state.apiError && (<div className="text-danger"><i className='material-icons'>error</i> {this.state.apiErrorMessage}</div>)}
								</Form>
							</Col>
						</Row>
					</ListGroupItem>
				</ListGroup>
			</Card>
		);
	}
}

EventAdd.propTypes = {
    difficulty: PropTypes.number,
    raid: PropTypes.number,
    title: PropTypes.string
};

EventAdd.defaultProps = {
    time: '20:30'
};

export default EventAdd
