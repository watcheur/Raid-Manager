import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormInput, Button, Form, FormSelect, InputGroup } from "shards-react";
import ReactQuill, {Quill} from "react-quill";
import { toast } from 'react-toastify';
import classNames from "classnames";

import PageTitle from "../components/common/PageTitle";
import PlayerList from "../components/players/PlayerList.js";

import GameData from '../data/gamedata';
import Api from "../data/api";
import { Dispatcher, Constants } from "../flux";
import PlayersList from "../components/players/PlayerList.js";
import { useAuthState } from "../context";
import PlayerAdd from "../components/players/PlayerAdd";

const PlayersOverview = (props) => {
    const { user, team } = useAuthState();

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="Liste des joueurs" subtitle="Dashboard" className="text-sm-left mb-3" />
            </Row>

            {user && (
            <Row className="justify-content-md-center">
                <Col sm="12" md="12" lg="12">
                    <PlayerAdd user={user} team={team} />
                </Col>
            </Row>)}
            
            <Row className="justify-content-md-center">
                <Col sm="12" md="12" lg="12">
                    <PlayersList title="Raiders" rank={GameData.Players.Ranks.Raider} user={user} team={team} className="green" />
                </Col>
            </Row>
            
            <Row className="justify-content-md-center">
                <Col sm="12" md="12" lg="12">
                    <PlayersList title="Apply" rank={GameData.Players.Ranks.Apply} user={user} team={team} className="yellow" />
                </Col>
            </Row>
            
            <Row className="justify-content-md-center">
                <Col sm="12" md="12" lg="12">
                    <PlayersList title="TBD" rank={GameData.Players.Ranks.TBD} user={user} team={team} />
                </Col>
            </Row>
            
            <Row className="justify-content-md-center">
                <Col sm="12" md="12" lg="12">
                    <PlayersList title="Out" rank={GameData.Players.Ranks.Out} user={user} team={team} className="red" />
                </Col>
            </Row>
        </Container>
    )
}
export default PlayersOverview;
