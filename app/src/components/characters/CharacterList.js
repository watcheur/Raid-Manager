import React from 'react';
import { Card, CardHeader, CardBody } from "shards-react";
import classNames from "classnames";

import GameData from '../../data/gamedata';
import Api from '../../data/api';
import { Dispatcher, Constants } from "../../flux";

/**
 * @param {Object} parameters
 */
export default class CharactersList extends React.Component {
    state = {
        characters: [],
        selected: 0,
        isLoading: false,
        error: null
    }

    constructor(props) {
        super(props);

        this.dispatcherToken = null;
        this.refreshCharacter = this.refreshCharacter.bind(this);
        this.deleteCharacter = this.deleteCharacter.bind(this);
        this.error = this.error.bind(this);
        this.success = this.success.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
    }

    spin(target) {
        if (target) {
            target.className = 'material-icons spin';
        }
    }

    error(target) {
        if (target) {
            target.className = 'material-icons text-danger';
            target.textContent = 'clear';
            setTimeout(() => {
                target.textContent = 'refresh'
                target.className = 'material-icons';
            }, 2000);
        }
    }

    success(target) {
        if (target) {
            target.className = 'material-icons text-success';
            target.textContent = 'check';
            setTimeout(() => {
                target.textContent = 'refresh'
                target.className = 'material-icons';
            }, 2000);
        }
    }

    deleteCharacter(target, char) {
        let characters = [...this.state.characters];
        let index = this.state.characters.indexOf(this.state.characters.find(c => c.id === char.id));
        if (index >= 0) {
            characters.splice(index, 1);
            this.setState({characters: characters});
        }

        Api.DeleteCharacter(char.id)
            .then(res => {
            })
            .catch(err => {
                alert('An error occured while deleting this character');
                
                characters.splice(index, 0, char);
                this.setState({ characters: characters });
            })
    }

    refreshCharacter(target, char) {
        this.spin(target);
        Api.RefreshCharacter(char.id)
            .then(res => {
                if (!res.data.err) {
                   let characters = [...this.state.characters];
                   let index = this.state.characters.indexOf(this.state.characters.find(c => c.id === res.data.data.id));
                   if (index >= 0) {
                        Object.assign(characters[index], res.data.data)
                        this.setState({characters: characters });
                        this.success(target);
                   }
                }
            })
            .catch(err => {
                this.error(target);
                alert('An error occured while refreshing this character');
            })
    }

    loadCharacters(target = null) {
        this.spin(target);
        const { name, realm, type, level, cl, spec, role, equipped, avg, azerite, weekly} = this.props;
        
        this.setState({ isLoading: true, error: null });
        Api.GetCharacters({
            name: name,
            realm, realm,
            type: type,
            level: level,
            class: cl,
            spec: spec,
            role: role,
            equipped: equipped,
            avg: avg,
            azerite: azerite,
            weekly: weekly
        })
        .then(res => {
            this.setState({ isLoading: false });
            if (!res.data.err) {
                this.setState({ characters: res.data.data })
                this.success(target);
            }
            else {
                this.error(target);
                this.setState({ error: res.data.message })
            }
        })
        .catch(err => {
            this.setState({ isLoading: false, error: err.message });
            this.error(target);
        });
    }

    toggleSelected(id) {
        this.setState({
            selected: (this.state.selected === id ? 0 : id)
        })
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.CHAR_CREATED:
                case Constants.CHAR_UPDATE:
                    if (this.props.type === undefined || this.props.type == payload.character.type)
                        this.loadCharacters();
                    break;
                case Constants.CHAR_DELETED:
                    this.loadCharacters();
                    break;
                default:
            }
        });
        this.loadCharacters();
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    render() {
        const { title } = this.props;
        const slots = ['Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Wrist', 'Hand', 'Waist', 'Leg', 'Foot', 'LeftFinger', 'RightFinger', 'LeftTrinket', 'RightTrinket', 'Weapon', 'Offhand'];
        
        return (
            <Card small className="mb-4 overflow-hidden text-center">
                {title.length ? (<CardHeader className="bg-dark"><h5 className="m-0 text-white">{title}</h5></CardHeader>) : ''}
                <CardBody className="bg-dark p-0 pb-3">
                    <table className="table table-dark mb-0">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col" className="border-0 char-name">
                                    Name
                                </th>
                                <th scope="col" className="border-0 char-level">
                                    Level
                                </th>
                                <th scope="col" className="border-0 char-race">
                                    Race
                                </th>
                                <th scope="col" className="border-0 char-class">
                                    Class
                                </th>
                                <th scope="col" className="border-0 char-spec">
                                    Spec
                                </th>
                                <th scope="col" className="border-0 char-role">
                                    Role
                                </th>
                                <th scope="col" className="border-0 char-azerite">
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-HeartOfAzeroth GameIcon--small`} data-tip="Heart of Azeroth">
                                        <div className="GameIcon-icon"></div>
                                    </div>
                                </th>
                                <th scope="col" className="border-0 char-weekly">
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-Weekly GameIcon--small`} data-tip="Weekly chest">
                                        <div className="GameIcon-icon"></div>
                                    </div>
                                </th>
                                <th scope="col" className="border-0 char-equipped">
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-Gear GameIcon--small`} data-tip="Equipped gear">
                                        <div className="GameIcon-icon"></div>
                                    </div>
                                </th>
                                {slots.map((value, index) => {
                                    return (
                                        <th scope="col" key={index} className={`border-0 char-${value}`}>
                                            <div className={`GameIcon GameIcon--slot${value} GameIcon--slot GameIcon--small`} data-tip={value}>
                                                <div className="GameIcon-icon"></div>
                                            </div>
                                        </th>
                                    )
                                })}
                                <th scope="col" className="border-0 char-refresh">
                                    <a style={{cursor:'pointer'}} onClick={ev => this.loadCharacters(ev.target)} className='material-icons'>refresh</a>
                                </th>
                                <th scope="col" className="border-0 char-delete"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.isLoading && (
                                <tr className="bg-dark p-0 pb-3">
                                    <td colSpan={11+slots.length}>
                                        <h1 className="material-icons spin ">refresh</h1>
                                    </td>
                                </tr>
                            )}
                            {this.state.error && (
                                <tr className="bg-dark p-0 pb-3">
                                    <td colSpan={11+slots.length}
                                        className="bg-warning text-white text-center"
                                        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                        <i className="material-icons">warning</i> {this.state.error}
                                    </td>
                                </tr>
                            )}
                            {this.state.characters.sort((a, b) => { return (a.role - b.role || a.class - b.class) }).map((character, index) => {
                                return (
                                    <tr key={index} className={this.state.selected === character.id ? 'selected' : ''}>
                                        <td onClick={(ev) => this.toggleSelected(character.id)}
                                            className={classNames('GameColorClass', GameData.ClassToObj(character.class).slug, 'char-name')} style={{textTransform: 'capitalize'}}>
                                            {character.name}
                                            <i className="show-item material-icons">{this.state.selected === character.id ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                                        </td>
                                        <td className='char-level'>{character.level}</td>
                                        <td className='char-race'>
                                            <div className={`GameIcon GameIconRace ${GameData.CharToRaceIc(character)} GameIcon--small`}>
                                                <div className="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td className='char-class'>
                                            <div className={`GameIcon GameIconClass GameIcon--${GameData.ClassToObj(character.class).slug.toUpperCase()} GameIcon--small`}>
                                                <div className="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td className='char-spec'>
                                            <div className={`GameIcon GameIconClass GameIcon--${GameData.SpecToObj(character.spec).class.toUpperCase()} GameIcon--small`}>
                                                <div className="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td className='char-role'>
                                            <div className={`GameIcon GameIconRole GameIcon--${GameData.RoleToObj(character.role).slug.toUpperCase()} GameIcon--small`}>
                                                <div className="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td className={classNames(GameData.AzeriteToClass(character.azerite), 'char-azerite')}>{character.azerite || (<i className="material-icons">help_outline</i>)}</td>
                                        <td className={classNames(character.weekly ? 'text-success': 'text-danger', 'char-weekly')}>{character.weekly || ''} <i className="material-icons">{character.weekly ? '' : 'clear'}</i> </td>
                                        <td className={classNames(GameData.IlvlToClass(character.equipped), 'char-equipped')}>{character.equipped}</td>
                                        {slots.map((value, index) => {
                                            return (
                                                <td key={index} className={classNames(GameData.IlvlToClass(character[GameData.TrSlot(value)]), 'items', `char-${value}`)}>
                                                    {character[GameData.TrSlot(value)]}
                                                </td>
                                            )
                                        })}
                                        <td className='char-refresh'><a style={{cursor:'pointer'}} onClick={ev => this.refreshCharacter(ev.target, character)} className="material-icons">refresh</a></td>
                                        <td className='char-delete'><a style={{cursor:'pointer'}} onClick={ev => this.deleteCharacter(ev.target, character)} className="material-icons text-danger">clear</a></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </CardBody>

            </Card>
        )
    }
}