import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "shards-react";
import { useHistory } from "react-router-dom";

import { logoutUser, setTeam, useAuthState, useAuthDispatch } from "../context";
import { Api } from "../data";

const TeamsOverview = (props) => {

    let history = useHistory();
	const dispatch = useAuthDispatch();
    const { user } = useAuthState();
    
    const [ loading, setLoading ] = useState(true);
    const [ teams, setTeams ] = useState([]);
    const [ error, setError ] = useState('');

    const getTeams = async () => {
        setLoading(true);

        try {
            const res = await Api.GetTeams();
            if (res && res.data.data)
            {
                setLoading(false);
                setTeams(res.data.data);
            }
        }
        catch (error)
        {
            setError(error.message);
        }
    }

    const teamClicked = (ev, team) => {
        setTeam(dispatch, team);
        history.push('/characters');
    }

    useEffect(() => {
        if (!teams || teams.length == 0)
            getTeams();
    })

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <Col xs="12" sm="12" className="text-center">
                    <h3 className="page-title">Select a team</h3>
                </Col>
            </Row>

            <Row className="justify-content-md-center">

                {error && (
                    <Col sm="12" md="3" lg="2" className="my-3 bg-danger text-white rounded text-center" style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                        <i className="material-icons">warning</i> {error}
                    </Col>
                )}

                {loading && (
                    <Col sm="12" md="12" lg="12" className="text-center">
                        <h5 className="material-icons spin">refresh</h5>
                    </Col>
                )}

                {teams.map(team => (
                    <Col sm="12" md="2" lg="2">
                        <Card className="text-center team-card" onClick={(ev) => teamClicked(ev, team)}>
                            <CardBody>
                                <img
                                    className="d-inline-block align-top mb-3"
                                    style={{ maxWidth: "50px" }}
                                    src='/images/blizzard/logo.png'
                                    alt={team.name}
                                />
                                <h4>{team.name}</h4>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default TeamsOverview;
