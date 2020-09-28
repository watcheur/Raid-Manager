import React from 'react';
import { Card, CardHeader, CardBody } from "shards-react";
import classNames from "classnames";
import { Parser } from "expr-eval"

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
        error: null,
        filters: {}
    }

    constructor(props) {
        super(props);

        this.dispatcherToken = null;
        this.refreshCharacter = this.refreshCharacter.bind(this);
        this.deleteCharacter = this.deleteCharacter.bind(this);
        this.error = this.error.bind(this);
        this.success = this.success.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.filter = this.filter.bind(this);
        this.filterChar = this.filterChar.bind(this);
    }

    spin(target) {
        if (target) {
            target.className = 'material-icons spin';
        }
    }

    filter(target) {
        let res = window.prompt(`You may set a filter for the ${target} column (empty to clean)\n\neg "> 21" or "<= 42"\nFor a more arithmetical search use x as "x > 10 and x < 20"`, this.state.filters[target] ?? '');
        if (res === null)
            return;

        let filters = this.state.filters;

        if (res.length)
            filters[target] = res;
        else
            delete filters[target];

        this.setState({ filters: filters });
    }

    filterChar(char) {
        let keys = Object.keys(this.state.filters).length;
        if (keys) {
            let count = 0;
            let parser = new Parser();

            for (var i in this.state.filters) {
                if (this.state.filters.hasOwnProperty(i)) {
                    let value = this.state.filters[i];
                    let expr = null
                    try {
                        if (value.indexOf("x") >= 0)
                            expr = parser.parse(value)
                        else
                            expr = parser.parse('x ' + value);
                    }
                    catch (err) { expr = parser.parse('x >= ' + value); }

                    switch (i) {
                        case 'weekly':
                            if (value == 0 && !char.weekly)
                                count++;
                            else if (expr.evaluate({ x: char.weekly }))
                                count++;
                            break;
                        case 'azerite':
                        case 'equipped':
                            if (expr.evaluate({ x: char[i] }))
                                count++;
                            break;
                        default:
                            let item = char.items.find(it => it.slot == i);

                            if (item && expr.evaluate({ x: item.level }))
                                count++;
                            break;
                    }
                    
                }
            }

            return count == keys;
        }

        return true;
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
        const { title, admin, logged } = this.props;
        const slots = ['HEAD', 'NECK', 'SHOULDER', 'BACK', 'CHEST', 'WRIST', 'HANDS', 'WAIST', 'LEGS', 'FEET', 'FINGER_1', 'FINGER_2', 'TRINKET_1', 'TRINKET_2', 'MAIN_HAND', 'OFF_HAND'];
        
        return (
            <Card small className="mb-4 overflow-hidden text-center characters-list">
                {title.length ? (
                    <CardHeader className="bg-dark">
                        <h5 className="m-0 text-white">
                            {title}
                            {this.state.isLoading && (
                                <i className="material-icons spin ">refresh</i>
                            )}
                        </h5>
                    </CardHeader>
                ) : ''}
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
                                <th scope="col" className="border-0 char-azerite" onClick={ev => this.filter('azerite')}>
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-HeartOfAzeroth GameIcon--small ${this.state.filters['azerite'] ? 'border-orange': ''}`}
                                        data-tip={`Heart of Azeroth${(this.state.filters['azerite'] ? ` (${this.state.filters['azerite']})` : '')}`}>
                                        <div className="GameIcon-icon"></div>
                                    </div>
                                </th>
                                <th scope="col" className="border-0 char-weekly" onClick={ev => this.filter('weekly')}>
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-Weekly GameIcon--small ${this.state.filters['weekly'] ? 'border-orange': ''}`}
                                        data-tip={`Weekly chest${(this.state.filters['weekly'] ? ` (${this.state.filters['weekly']})` : '')}`}>
                                        <div className="GameIcon-icon"></div>
                                    </div>
                                </th>
                                <th scope="col" className="border-0 char-equipped" onClick={ev => this.filter('equipped')}>
                                    <div className={`GameIcon GameIconUtils GameIcon--Utils-Gear GameIcon--small ${this.state.filters['equipped'] ? 'border-orange': ''}`}
                                        data-tip={`Equipped gear${(this.state.filters['equipped'] ? ` (${this.state.filters['equipped']})` : '')}`}>
                                        <div className="GameIcon-icon"></div>
                                    </div>
                                </th>
                                {slots.map((value, index) => {
                                    return (
                                        <th scope="col" key={index} className={`border-0 char-${value}`} onClick={ev => this.filter(value)}>
                                            <div className={`GameIcon GameIcon--slot--${value} GameIcon--slot GameIcon--small ${this.state.filters[value] ? 'border-orange': ''}`} data-tip={value + (this.state.filters[value] ? ` (${this.state.filters[value]})` : '')}>
                                                <div className="GameIcon-icon"></div>
                                            </div>
                                        </th>
                                    )
                                })}
                                {admin && logged ? (
                                <th scope="col" className="border-0 char-refresh">
                                    <a style={{cursor:'pointer'}} onClick={ev => this.loadCharacters(ev.target)} className='material-icons'>refresh</a>
                                </th>) : (<th scope="col" className="border-0"></th>)}

                                <th scope="col" className="border-0 char-delete"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.error && (
                                <tr className="bg-dark p-0 pb-3">
                                    <td colSpan={11+slots.length}
                                        className="bg-warning text-white text-center"
                                        style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                        <i className="material-icons">warning</i> {this.state.error}
                                    </td>
                                </tr>
                            )}
                            {this.state.characters.filter(this.filterChar).sort((a, b) => { return (a.role - b.role || a.class - b.class) }).map((character, index) => {
                                return (
                                    <tr key={index} className={this.state.selected === character.id ? 'selected' : ''}>
                                        <td onClick={(ev) => this.toggleSelected(character.id)}
                                            className={classNames('GameColorClass', GameData.ClassToObj(character.class).slug, 'char-name')} style={{textTransform: 'capitalize'}}>
                                            <a
                                                href={`https://worldofwarcraft.com/en-gb/character/eu/${character.realm}/${character.name}`}
                                                target="_blank"
                                                className='mr-1'>
                                                <img src="/images/blizzard/logo.png" className='GameIcon--tiny' />
                                            </a>
                                            <a
                                                href={admin && logged ? `/characters/${character.id}/wishlist` : '#'}
                                                className={classNames('GameColorClass', GameData.ClassToObj(character.class).slug)}>
                                                {character.name}
                                            </a>
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
                                            let item = character.items.find(it => it.slot == value);
                                            if (!item)
                                                return (<td key={index}></td>);
                                            return (
                                                <td key={index} className={classNames(GameData.IlvlToClass(item.level), 'items', `char-${value}`)}>
                                                    <a href="#" className={classNames(GameData.IlvlToClass(item.level))} data-wowhead={GameData.ItemToWowHead(item)}>{item.level}</a>
                                                </td>
                                            )
                                        })}
                                        
                                        {admin && logged ? (
                                            <td className='char-refresh'><a style={{cursor:'pointer'}} onClick={ev => this.refreshCharacter(ev.target, character)} className="material-icons">refresh</a></td>
                                        ) : (<td></td>)}

                                        {admin && logged ? (
                                            <td className='char-delete'><a style={{cursor:'pointer'}} onClick={ev => this.deleteCharacter(ev.target, character)} className="material-icons text-danger">clear</a></td>
                                        ): (<td></td>)}
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