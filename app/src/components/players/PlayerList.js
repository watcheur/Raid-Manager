import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormInput, Button, Form, FormSelect, InputGroup } from "shards-react";
import ReactQuill, {Quill} from "react-quill";
import { toast } from 'react-toastify';
import classNames from "classnames";

import PageTitle from "../../components/common/PageTitle";

import GameData from '../../data/gamedata';
import Api from "../../data/api";
import { Dispatcher, Constants } from "../../flux";

/**
 * @param {Object} parameters
 */
export default class PlayersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            error: ''
        };

        this.dispatcherToken = null;
        this.loadPlayers = this.loadPlayers.bind(this);
        this.deletePlayer = this.deletePlayer.bind(this);
        this.updatePlayer = this.updatePlayer.bind(this);
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

    updatePlayer(player, rank) {
        this.setState({ loading: true });
        
        Api.UpdatePlayer(player.id, { rank: rank })
            .then(res => {
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
                alert('An error occured while updating this player');
            })
    }

    loadPlayers() {
        this.setState({ loading: true });

        Api.GetPlayers({ include: 1, rank: this.props.rank })
            .then(res => {
                this.setState({ loading: false });
                if (!res.data.err) {
                    this.setState({players: res.data.data });
                }
            })
            .catch(err => {
                this.setState({ loading: false });
                alert('An error occured while refreshing this player');
            })
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.PLAYER_CREATED:
                case Constants.PLAYER_UPDATE:
                case Constants.PLAYER_DELETED:
                case Constants.CHAR_CREATED:
                    if (this.props.type === undefined || this.props.type == payload.character.type)
                        this.loadPlayers();
                    break;
                default:
            }
        });
        this.loadPlayers();
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    render() {
        const { title } = this.props;

        return(
            <Card small className="mb-4 overflow-hidden">
                <CardHeader className="py-0"><h5 className={classNames("m-0 py-3", this.props.className)}>{title} ({this.state.players.length})</h5></CardHeader>
                <CardBody className="p-0 pb-3">
                    <table className="table mb-0">
                        <tbody>
                            {this.state.loading && (
                                <tr className="p-0 pb-3 text-center">
                                    <td colspan="3">
                                        <h1 className="material-icons spin">refresh</h1>
                                    </td>
                                </tr>
                            )}
                            {!this.state.players && (<tr className="text-center"><td colspan="3">Aucun joueurs</td></tr>)}
                            {this.state.players && this.state.players.map((player, index) => {
                                return (
                                    <tr key={index} className="players-list">
                                        <td className="player-rank">
                                            <FormSelect
                                                id="feRank"
                                                value={player.rank}
                                                required
                                                onChange={(event) => { this.updatePlayer(player, event.target.value); }}
                                            >
                                                <option value={GameData.Players.Ranks.Raider}>Raider</option>
                                                <option value={GameData.Players.Ranks.Apply}>Apply</option>
                                                <option value={GameData.Players.Ranks.TBD}>TBD</option>
                                                <option value={GameData.Players.Ranks.Out}>Out</option>
                                            </FormSelect>
                                        </td>
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
        )
    }
}