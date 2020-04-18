import React from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from "shards-react";

import Blizzard from '../../data/blizzard';
import Api from '../../data/api';

/**
 * @param {Object} parameters
 */
export default class CharactersList extends React.Component {
    state = {
        characters: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Api.GetCharacters(this.props.parameters || {})
            .then(res => {
                if (!res.data.err)
                    this.setState({ characters: res.data.data })
            })
            .catch(err => alert(err))
    }

    render() {
        const { title } = this.props;
        const slots = ['Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Wrist', 'Hand', 'Waist', 'Leg', 'Foot', 'LeftFinger', 'RightFinger', 'LeftTrinket', 'RightTrinket', 'Weapon', 'Offhand'];
        
        return (
            <Card small className="mb-4 overflow-hidden">
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
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.characters.sort(c => c.type).map((character, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={`GameColorClass ${Blizzard.ClassToObj(character.class).slug}`}>{character.name}</td>
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
                                        <td class={character.weekly ? 'text-success': 'text-danger'}><i class="material-icons">{character.weekly ? 'done' : 'clear'}</i></td>
                                        <td class={Blizzard.IlvlToClass(character.equipped)}>{character.equipped}</td>
                                        {slots.map((value, index) => {
                                            return (
                                                <td key={index} class={Blizzard.IlvlToClass(character[Blizzard.TrSlot(value)])}>
                                                    {character[Blizzard.TrSlot(value)]}
                                                </td>
                                            )
                                        })}
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