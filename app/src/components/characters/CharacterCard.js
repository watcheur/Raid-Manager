import React from "react";
import { Card, CardBody, Form, Alert } from "shards-react";
import classNames from "classnames";

import Blizzard from '../../data/blizzard';

const CharacterChard = ({ character, className, ...attrs }) => {
    const classes = classNames(
        className,
        "p-1",
        "px-3",
        "character-card",
        Blizzard.ClassToObj(character.class).slug
    );
    
    return (   
        <div className={classes} { ...attrs }>
            <div className={`GameIcon GameIconClass GameIcon--${Blizzard.SpecToObj(character.spec).class.toUpperCase()} GameIcon--tiny`}>
                <div className="GameIcon-icon"></div> 
            </div>
            <div className='px-1'>
                {character.name.capitalize()}
            </div>
        </div>
    )
}

export default CharacterChard;
