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

class CharacterDetail extends React.Component {
    defaultState = {
        characterId: 0,
        character : null,

        loading: false
    }

    constructor(props) {
        super(props);

        const { match: { params } } = this.props;
        
        this.defaultState.characterId = params.characterId;
        this.state = {...this.defaultState};

        this.loadCharacter = this.loadCharacter.bind(this);
    }

    loadCharacter() {
        this.setState({ loading: true });

        Api.GetCharacter(this.state.characterId)
            .then(res => {
                this.setState({ loading: false });
                if (!res.data.err) {
                    this.setState({ character: res.data.data });
                }
            })
            .catch(err => {
                this.setState({ loading: false });
                alert('An error occured while refreshing this character');
            })
    }
    componentDidMount() {
        this.loadCharacter();
    }

    render() {
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title={this.state.character?.name} subtitle="Dashboard" className="text-sm-left mb-3" />
                </Row>

            </Container>
        )
    }
}

export default CharacterDetail;