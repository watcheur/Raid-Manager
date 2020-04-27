import React from "react";
import PropTypes from "prop-types";
import { Container, Button, Row, Col, Card, CardBody, CardFooter, CardHeader, Form, FormInput } from "shards-react";
import { Redirect } from "react-router-dom";


import Api from "../data/api";

class LoginView extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            password: '',
            error: '',
            redirect: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(event)
    {
        event.preventDefault();

        this.setState({ loading: true, error: '' })
        Api.Login(this.state.username, this.state.password)
            .then(res => {
                if (!res.data.err){
                    localStorage.setItem('islogged', '1');

                    this.setState({ loading: false, error: '', redirect: true });
                }
                this.setState({ loading: false, error: 'Invalid credentials'});
            })
            .catch(err => {
                this.setState({ loading: false, error: 'Invalid credentials' });
            })
    }

	render() {
		return(
			<Container fluid className="d-flex align-items-center justify-content-center p-0 vh-100">
                {this.state.redirect && (<Redirect to="/" />)}
                <Row className="w-100">
                    <Col md={{ size: 2, offset: 5 }}>
                        <Card className="m-0">
                            <Form onSubmit={this.handleSubmit}>
                                <CardHeader className="border-bottom">
                                    <h6 className="m-0">Login</h6>
                                </CardHeader>
                                <CardBody className="p-3">
                                    {this.state.error && (
                                    <Row className="text-danger text-sm m-0 text-center">
                                        <Col>
                                            <p className="text-center mb-3"><small>{this.state.error}</small></p>
                                        </Col>
                                    </Row>)}
                                    <Row form className="m-0">
                                        <Col className="form-group">
                                            <FormInput
                                                id="feUsername"
                                                type="text"
                                                placeholder="Username"
                                                value={this.state.username}
                                                required
                                                onChange={(event) => { this.setState({ username: event.target.value }); }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row form className="m-0">
                                        <Col>
                                            <FormInput
                                                id="fePassword"
                                                type="password"
                                                placeholder="Password"
                                                value={this.state.password}
                                                required
                                                onChange={(event) => { this.setState({ password: event.target.value }); }}
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter className="border-top">
                                    <Button className="btn-block" type="submit">
                                        {this.state.loading ? <i className="material-icons spin">refresh</i> : <i className="material-icons">people</i>}
                                        Login
                                    </Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    </Col>
                </Row>
			</Container>
		)
	}
}

export default LoginView;
