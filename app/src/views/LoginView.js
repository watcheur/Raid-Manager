import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Container, Button, Row, Col, Card, CardBody, CardFooter, CardHeader, Form, FormInput } from "shards-react";
import { useHistory } from "react-router-dom";

import { loginUser, useAuthState, useAuthDispatch } from "../context";

function Login(props) {
    let history = useHistory();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const dispatch = useAuthDispatch();
    const { loading, errorMessage, user } = useAuthState();

    if (user)
        history.push('/');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            let response = await loginUser(dispatch, username, password);
            if (response)
               history.push('/');
        } catch (error) {
            dispatch({ type: 'LOGIN_ERROR', error: "Error" });
        }
    }

    return (
        <Container fluid className="d-flex align-items-center justify-content-center p-0 vh-100">
            <Row className="w-100">
                <Col md={{ size: 2, offset: 5 }}>
                    <Card className="m-0">
                        <Form onSubmit={handleLogin}>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Login</h6>
                            </CardHeader>
                            <CardBody className="p-3">
                                {errorMessage && (
                                <Row className="text-danger text-sm m-0 text-center">
                                    <Col>
                                        <p className="text-center mb-3"><small>{errorMessage}</small></p>
                                    </Col>
                                </Row>)}
                                <Row form className="m-0">
                                    <Col className="form-group">
                                        <FormInput
                                            id="feUsername"
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            required
                                            onChange={(event) => { setUsername(event.target.value); }}
                                            disabled={loading}
                                        />
                                    </Col>
                                </Row>
                                <Row form className="m-0">
                                    <Col>
                                        <FormInput
                                            id="fePassword"
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            required
                                            onChange={(event) => { setPassword(event.target.value) }}
                                            disabled={loading}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter className="border-top">
                                <Button className="btn-block" type="submit" disabled={loading}>
                                    {loading ? <i className="material-icons spin">refresh</i> : <i className="material-icons">people</i>}
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

export default Login;