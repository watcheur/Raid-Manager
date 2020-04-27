import React from "react";
import { useDrag } from 'react-dnd';
import classNames from "classnames";

import GameData from '../../data/gamedata';

const CharacterChard = ({ character, icon = true, className, ...attrs }) => {
    const classes = classNames(
        className,
        "p-1",
        "px-3",
        "character-card",
        "border-darker",
        GameData.ClassToObj(character.class).slug
    );

    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: 'character', id: character.id, class: character.class },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      })
    
    return (   
        <div ref={drag} className={classes} { ...attrs }>
            {icon && (
            <div className={`GameIcon GameIconClass GameIcon--${GameData.SpecToObj(character.spec).class.toUpperCase()} GameIcon--tiny`}>
                <div className="GameIcon-icon"></div> 
            </div>)}
            <div className='px-1'>
                {character.name.capitalize()}
            </div>
        </div>
    )
}

export default CharacterChard;
