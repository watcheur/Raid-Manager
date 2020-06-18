import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormInput, Button, Form, FormFeedback, InputGroup } from "shards-react";
import ReactQuill, {Quill} from "react-quill";
import { toast } from 'react-toastify';
import classNames from "classnames";

import "react-quill/dist/quill.snow.css";
import "../assets/quill.css";

import PageTitle from "../components/common/PageTitle";

import GameData from '../data/gamedata';
import Api from "../data/api";
import { Dispatcher, Constants } from "../flux";

class PlayerOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            error: '',
            name: ''
        }

        this.save = this.save.bind(this);
        this.loadPlayers = this.loadPlayers.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    loadPlayers() {
        this.setState({ loading: true });

        Api.GetPlayers({ include: 1 })
        .then(res => {
            this.setState({ loading: false });
            if (!res.data.err) {
                this.setState({players: res.data.data });
            }
        })
        .catch(err => {
            this.setState({ loading: false });
            alert('An error occured while refreshing this character');
        })
    }

    handleSubmit(event) {
		event.preventDefault();

		this.setState({ loading: true });
        const { name } = this.state;
        
		if (name.length > 0) {
            Api.CreatePlayer({ name: name })
            .then(res => {
                if (!res.data.err) {
                    let players = this.state.players || [];
                    players.push(res.data.data);

                    this.setState({ players: players, name: '' });
                }
                this.setState({ loading: false })
            })
            .catch(err => this.setState({ error: 'Add player error: ' + err.message, loading: false }));
		}
	}

    componentDidMount() {
        this.loadPlayers();
    }

    save() {
        this.setState({ loading: true })
    }

    deletePlayer(player) {
        let players = [...this.state.players];
        let index = this.state.players.indexOf(this.state.players.find(c => c.id === player.id));
        if (index >= 0) {
            players.splice(index, 1);
            this.setState({players: players});
        }

        Api.DeletePlayer(player.id)
            .then(res => {
                if (!res.data.err)
					toast.success(`Player ${player.name.capitalize()} deleted`)
            })
            .catch(err => {
                alert('An error occured while deleting this player');
                
                players.splice(index, 0, player);
                this.setState({ players: players });
            })
    }

    render() {
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title="Liste des joueurs" subtitle="Dashboard" className="text-sm-left mb-3" />
                </Row>

                <Row className="justify-content-md-center">
                    <Col sm="12" md="12" lg="12">
                        <Card small className="mb-4 overflow-hidden">
                            <CardHeader className="py-0"><h5 className="m-0 py-3">Joueurs ({this.state.players.length})</h5></CardHeader>
                            <CardBody className="p-0 pb-3">
                                <table className="table mb-0">
                                    <tbody>
                                        {this.state.loading && (
                                            <tr className="p-0 pb-3 text-center">
                                                <td colspan="3">
                                                    <h1 className="material-icons spin ">refresh</h1>
                                                </td>
                                            </tr>
                                        )}
                                        {!this.state.players && (<tr className="text-center"><td colspan="3">Aucun joueurs</td></tr>)}
                                        <tr>
                                            <td colspan="3" className="py-2">
                                                <Form onSubmit={this.handleSubmit}>
                                                    <Row form>
                                                        <Col className="form-group mb-0">
                                                            <InputGroup>
                                                                <FormInput
                                                                    id="feName"
                                                                    type="text"
                                                                    placeholder="Name"
                                                                    invalid={this.state.invalidName}
                                                                    value={this.state.name}
                                                                    required
                                                                    onChange={(event) => { this.setState({ name: event.target.value, errorNameText: '', invalidName: false }); }}
                                                                />
                                                                <div className="input-group-append">
                                                                    <Button type="submit">
                                                                        <i className={`material-icons ${this.state.loading ? 'spin': ''}`}>{this.state.loading ? 'refresh' : 'save'}</i> Add
                                                                    </Button>
                                                                </div>
                                                                <FormFeedback valid={false}>{this.state.errorNameText}</FormFeedback>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </td>
                                        </tr>
                                        {this.state.players && this.state.players.map((player, index) => {
                                            return (
                                                <tr key={index} className="players-list">
                                                    <td className="player-name">{player.name}</td>
                                                    <td className="player-characters">
                                                        {player.characters && player.characters.map((char, index) => {
                                                            return (
                                                                <span className={classNames('GameColorClass', GameData.ClassToObj(char.class).slug, 'char-name')}>
                                                                    {char.name} {char.type == GameData.Characters.Type.MAIN && (<i className="material-icons">star</i>)}
                                                                </span>
                                                            );
                                                        })}
                                                    </td>
                                                    <td className='text-right'><a style={{cursor:'pointer'}} onClick={ev => this.deletePlayer(player)} className="material-icons text-danger">clear</a></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default PlayerOverview;
