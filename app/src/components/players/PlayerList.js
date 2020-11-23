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

    async deletePlayer(player) {
        let players = [...this.state.players];
        let index = this.state.players.indexOf(this.state.players.find(c => c.id === player.id));
        if (index >= 0) {
            players.splice(index, 1);
            this.setState({players: players});
        }

        try
        {
            const res = await Api.DeletePlayer(player.id, { team: this.props.team.id })
            if (res)
            {
                toast.success(`Player ${player.name.capitalize()} deleted`)
            }
        }
        catch (error)
        {
            if (error.response)
                this.setState({ loading: false, error: error.response.data.message })
            else
                this.setState({ loading: false, error: error.message })
        }
    }

    async updatePlayer(player, rank) {
        this.setState({ loading: true });
        
        try
        {
            const res = Api.UpdatePlayer(player.id, { rank: rank, team: this.props.team })
            if (res)
            {
                let { players } = this.state;
                let index = players.indexOf(player);
                if (index >= 0)
                {
                    players.splice(index, 1)
                    this.setState({ players: players })
                }

                this.setState({ loading: false })
            }
        }
        catch (error)
        {
            if (error.response)
                this.setState({ loading: false, error: error.response.data.message })
            else
                this.setState({ loading: false, error: error.message })
        }
    }

    async loadPlayers() {
        this.setState({ loading: true });

        try
        {
            const { rank, team } = this.props;

            const res = await Api.GetPlayers({ rank: rank, team: team.id })
            if (res)
                this.setState({ loading: false, players: res.data.data })
        }
        catch (error)
        {
            if (error.response)
                this.setState({ loading: false, error: error.response.data.message })
            else
                this.setState({ loading: false, error: error.message })
        }
    }

    componentDidMount() {
        if (this.dispatcherToken)
            Dispatcher.unregister(this.dispatcherToken);
        this.dispatcherToken = Dispatcher.register(payload => {
            if ([Constants.CHANNEL_PLAYER, Constants.CHANNEL_CHARACTER].indexOf(payload.channel) >= 0)
            {
                switch (payload.actionType) {
                    case Constants.CREATED:
                    case Constants.UPDATED:
                        if (!this.props.rank || payload.character || (payload.rank == this.props.rank))
                            this.loadPlayers();
                        break;
                    case Constants.DELETED:
                        if (payload.player)
                        {
                            let { players } = this.state;
                            let index = players.findIndex(p => p.id == payload.player);
                            if (index >= 0)
                            {
                                players.splice(index, 1)
                                this.setState({ players: players })
                            }
                        }
                        break;
                }
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
            <Card small className="mb-4 overflow-hidden players-list">
                <CardHeader className="py-0"><h5 className={classNames("m-0 py-3", this.props.className)}>{title} ({this.state.players.length})</h5></CardHeader>
                <CardBody className="p-0 pb-3">
                    <table className="table mb-0">
                        <tbody>
                            {this.state.loading && (
                                <tr className="p-0 pb-3 text-center">
                                    <td colspan="4">
                                        <h1 className="material-icons spin">refresh</h1>
                                    </td>
                                </tr>
                            )}
                            {this.state.error && (
                                <tr className="bg-dark p-0 pb-3">
                                    <td colSpan="4"
                                        className="bg-warning text-white text-center"
                                        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                        <i className="material-icons">warning</i> {this.state.error}
                                    </td>
                                </tr>
                            )}
                            {!this.state.players && (<tr className="text-center"><td colspan="3">Aucun joueurs</td></tr>)}
                            {this.state.players && this.state.players.map((player, index) => {
                                return (
                                    <tr key={index}>
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
                                                        {char.name.capitalize()} {char.type == GameData.Characters.Type.MAIN && (<i className="material-icons">star</i>)}
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