import React from "react";
import PropTypes from "prop-types";
import {
    Row,
    Col
} from "shards-react";
import { useDrop } from "react-dnd";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

import ContentEditable from 'react-contenteditable';
import Blizzard from "../../data/blizzard";
/**
G1 |cff3ec5e9Ballzonfire|r |cffa22fc8Raìzen|r |cfffefefeCystos|r 
G2 |cffa9d271Rougeole|r |cff3ec5e9Dwënrêth|r |cffa9d271Rhogarr|r 
G3 |cfffe7b09Gwibuss|r |cfff38bb9Øøniki|r |cffa22fc8Epokkz|r

|

document.execCommand('insertText', false, '|cff{hexa}{name}|r')

{Warrior}{Paladin}{Hunter}{Rogue}{Priest}{Death Knight}{Shaman}{Mage}{Warlock}{Monk}{Druid}{Demon Hunter}
 */

class NoteEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            characters: [],
            content: '',
            contentFormatted: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.characters !== this.props.characters)
            this.setState({ characters: this.props.characters });
    }

    handleChange = evt => {
        this.setState({ content: evt.target.value })
    }
	
	render() {
        return (
            <Row className="border m-1 rounded bg-white">
                <Col lg="12" className="border-bottom py-2 text-center">
                    {/*this.state.characters && (
                        <FormSelect>
                            <option value=''>Characters...</option>
                            {this.state.characters.map((char, idx) => {
                                return (<option key={char.id} value={char.id} className={`GameColorClass ${Blizzard.ClassToObj(char.class).slug}`}>{char.name.capitalize()}</option>)
                            })}
                        </FormSelect>
                        )*/}
                    {this.state.characters.sort((a, b) => (a.class > b.class)).map((char, idx) => {
                        return (
                            <span key={char.id} value={char.id} className={`pr-2 GameColorClass ${Blizzard.ClassToObj(char.class).slug}`}
                                onMouseDown={(ev) => { ev.preventDefault(); document.execCommand('insertText', false, `|cff${'toto'}${char.name}|r`) }}>
                                {char.name.capitalize()}
                            </span>)
                    })}
                </Col>
                <Col lg="12" className="h-100 min-vh-50 p-0">
                    <ContentEditable
                        className='p-2 min-vh-50 h-100 w100'
                        onChange={this.handleChange}
                        html={this.state.contentFormatted}
                    />
                </Col>
            </Row>
        );
	}
}

export default NoteEditor