import React from "react";
import { useDrop } from 'react-dnd';
import classNames from "classnames";
import { Col } from 'shards-react';

import CharacterCard from '../characters/CharacterCard';
import Blizzard from '../../data/gamedata';

const RoleZone = ({ className, role, characters, onCharacterClick, onCharacterDrop  }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'character',
        canDrop: (item,) => {
            if (role === Blizzard.Characters.Role.TANK)
                return Blizzard.Characters.TankClasses.indexOf(item.class) !== -1;

            if (role === Blizzard.Characters.Role.HEAL)
                return Blizzard.Characters.HealClasses.indexOf(item.class) !== -1;
            
            return true;
        },
        drop: (item,) => {
            onCharacterDrop(item.id, role);
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
          canDrop: !!monitor.canDrop(),
        }),
      })

    const dpsRole = (role === Blizzard.Characters.Role.DPS);

    let classes = classNames(
        className,
        'dropzone',
        'w-100',
        'h-100',
        (!isOver && canDrop ? 'droppable' : ''),
        (isOver && canDrop ? 'hover' : ''),
        (isOver && !canDrop ? 'notdroppable' : '')
    )

    return (
        <div className={classes} ref={drop}>
            {dpsRole && (
                <Col lg="12" className="p-0 border-top border-bottom bg-white text-center">
                    <h6 className='my-1'>Melee</h6>
                </Col>
            )}
            <Col lg="12" className={classNames(dpsRole ? 'min-vh-10' : '', 'py-1')}>
                {characters.filter(c => dpsRole ? (!Blizzard.SpecToObj(c.spec).range) : true).sort((a, b) => a.class - b.class).map((character, index) => {
                    return (
                        <CharacterCard key={character.id} character={character} icon={false} className="text-center d-inline-block m-1" onClick={() => onCharacterClick(character) } />
                    )
                })}
            </Col>

            {dpsRole && (
                <div>
                <Col lg="12" className="p-0 border-top border-bottom bg-white text-center">
                    <h6 className='my-1'>Ranged</h6>
                </Col>
                <Col lg="12 min-vh-10 py-1">
                    {characters.filter(c => dpsRole ? (Blizzard.SpecToObj(c.spec).range) : true).sort((a, b) => a.class - b.class).map((character, index) => {
                        return (
                            <CharacterCard key={character.id} character={character} icon={false} className="text-center d-inline-block m-1" onClick={() => onCharacterClick(character) } />
                        )
                    })}
                </Col>
                </div>
            )}

        </div>
    )
}

export default RoleZone