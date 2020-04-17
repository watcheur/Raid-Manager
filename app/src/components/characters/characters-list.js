import Api from '../../data/api';
import React from 'react';
import { Row, Col, Card, CardHeader, CardBody } from "shards-react";
import Blizzard from '../../data/blizzard';

export default class CharactersList extends React.Component {
    state = {
        characters: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        Api.GetCharacters()
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
                <CardHeader className="bg-dark">
                    <h6 className="m-0 text-white">{title}</h6>
                </CardHeader>
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
                                    Azerite
                                </th>
                                <th scope="col" className="border-0">
                                    Role
                                </th>
                                <th scope="col" className="border-0">
                                    WHM
                                </th>
                                <th scope="col" className="border-0">
                                    Gear
                                </th>
                                {slots.map((value, index) => {
                                    return (
                                        <th scope="col" key={index} className="border-0">
                                            <div className={`GameIcon GameIcon--slot${value} GameIcon--slot GameIcon--small`}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.characters.map((character, index) => {
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
                                        <td>SPEC</td>
                                        <td>
                                            <div className={`GameIcon GameIconRole GameIcon--${Blizzard.RoleToObj(character.role).slug.toUpperCase()} GameIcon--small`}>
                                                <div class="GameIcon-icon"></div>
                                            </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
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