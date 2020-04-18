import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardFooter, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "shards-react";

import Blizzard from '../../data/blizzard';
import Api from '../../data/api';
import Context from "../../utils/context"
import { Dispatcher, Constants } from "../../flux";

/**
 * @param {Object} parameters
 */
export default class CharactersList extends React.Component {
    state = {
        characters: []
    }

    constructor(props) {
        super(props);

        this.dispatcherToken = null;
        this.refreshCharacter.bind(this);
        this.deleteCharacter.bind(this);
        this.error.bind(this);
        this.success.bind(this);
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
        let index = this.state.characters.indexOf(this.state.characters.find(c => c.id == char.id));
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
                this.setState({ characters: characters })
            })
    }

    refreshCharacter(target, char) {
        this.spin(target);
        Api.RefreshCharacter(char.id)
            .then(res => {
                if (!res.data.err) {
                   let characters = [...this.state.characters];
                   let index = this.state.characters.indexOf(this.state.characters.find(c => c.id == res.data.data.id));
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
                //event.target.className = 'material-icons';
            })
    }

    loadCharacters(target = null) {
        this.spin(target);
        Api.GetCharacters(this.props.parameters)
            .then(res => {
                if (!res.data.err) {
                    this.setState({ characters: res.data.data })
                    this.success(target);
                }
                else {
                    this.error(target);
                }
            })
            .catch(err => {
                this.error(target);
                alert(err);
            });
    }

    componentDidMount() {
        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.NEW_CHAR:
                case Constants.CHAR_UPDATE:
                    this.loadCharacters();
                    break;
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
                {this.props.title.length ? (<CardHeader className="bg-dark"><h5 className="m-0 text-white">{this.props.title}</h5></CardHeader>) : ''}
                <CardBody className="bg-dark p-0 pb-3">
                    <table className="table table-dark mb-0">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col" className="border-0">
                                    Name
                                </th>
                                <th scope="col" className="border-0">
                                    Level
                                </th>
                                <th scope="col" className="border-0">
                                    Race
                                </th>
                                <th scope="col" className="border-0">
                                    Class
                                </th>
                                <th scope="col" className="border-0">
                                    Spec
                                </th>
                                <th scope="col" className="border-0">
                                    Role
                                </th>
                                <th scope="col" className="border-0">
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-HeartOfAzeroth GameIcon--small`} data-tip="Heart of Azeroth">
                                        <div class="GameIcon-icon"></div>
                                    </div>
                                </th>
                                <th scope="col" className="border-0">
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-Weekly GameIcon--small`} data-tip="Weekly chest">
                                        <div class="GameIcon-icon"></div>
                                    </div>
                                </th>
                                <th scope="col" className="border-0">
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-Gear GameIcon--small`} data-tip="Equipped gear">
                                        <div class="GameIcon-icon"></div>
                                    </div>
                                </th>
                                {slots.map((value, index) => {
                                    return (
                                        <th scope="col" key={index} className="border-0">
                                            <div className={`GameIcon GameIcon--slot${value} GameIcon--slot GameIcon--small`} data-tip={value}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </th>
                                    )
                                })}
                                <th scope="col" className="border-0">
                                    <a style={{cursor:'pointer'}} onClick={ev => this.loadCharacters(ev.target)} class='material-icons'>refresh</a>
                                </th>
                                <th scope="col" class="border-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.characters.sort((a, b) => { return (a.role > b.role ? 1 : -1) }).map((character, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={`GameColorClass ${Blizzard.ClassToObj(character.class).slug}`} style={{textTransform: 'capitalize'}}>
                                            {character.name}
                                        </td>
                                        <td>{character.level}</td>
                                        <td>
                                            <div className={`GameIcon GameIconRace ${Blizzard.CharToRaceIc(character)} GameIcon--small`}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td> 
                                            <div className={`GameIcon GameIconClass GameIcon--${Blizzard.ClassToObj(character.class).slug.toUpperCase()} GameIcon--small`}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`GameIcon GameIconClass GameIcon--${Blizzard.SpecToObj(character.spec).class.toUpperCase()} GameIcon--small`}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`GameIcon GameIconRole GameIcon--${Blizzard.RoleToObj(character.role).slug.toUpperCase()} GameIcon--small`}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td class={Blizzard.AzeriteToClass(character.azerite)}>{character.azerite || (<i class="material-icons">help_outline</i>)}</td>
                                        <td class={character.weekly ? 'text-success': 'text-danger'}>{character.weekly || ''} <i class="material-icons">{character.weekly ? 'done' : 'clear'}</i> </td>
                                        <td class={Blizzard.IlvlToClass(character.equipped)}>{character.equipped}</td>
                                        {slots.map((value, index) => {
                                            return (
                                                <td key={index} class={Blizzard.IlvlToClass(character[Blizzard.TrSlot(value)])}>
                                                    {character[Blizzard.TrSlot(value)]}
                                                </td>
                                            )
                                        })}
                                        <td><a style={{cursor:'pointer'}} onClick={ev => this.refreshCharacter(ev.target, character)} class="material-icons">refresh</a></td>
                                        <td><a style={{cursor:'pointer'}} onClick={ev => this.deleteCharacter(ev.target, character)} class="material-icons text-danger">clear</a></td>
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