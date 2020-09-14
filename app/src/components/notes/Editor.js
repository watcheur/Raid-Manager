import React from "react";
import {
    Row,
    Col,
    Button,
    FormInput
} from "shards-react";

import ReactQuill, {Quill} from "react-quill";
import GameData from "../../data/gamedata";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

import { CharacterBlot, IconBlot, SpellBlot } from ".";

Quill.register('formats/wowchar', CharacterBlot);
Quill.register('formats/wowico', IconBlot);
Quill.register('formats/wowspell', SpellBlot);

class NoteEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            characters: [],
            content: '',
            title: '',
            value: ''
        }

        if (this.props.note) {
            this.state.title = this.props.note.title;
            this.state.value = this.props.note.text;
        }

        this.handleChange = this.handleChange.bind(this);
        this.insert = this.insert.bind(this);
        this.emitChanges = this.emitChanges.bind(this);
        this.contentEditable = React.createRef();
        this.reactQuillRef = null;
        this.quillRef = null;
    }

    componentDidMount() {
        this.quillRef = this.reactQuillRef.getEditor();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.characters !== this.props.characters)
            this.setState({ characters: this.props.characters });

        if (prevProps.note !== this.props.note) {
            if (this.props.note) {
                this.setState({
                    title: this.props.note.title,
                    value: this.props.note.text
                })

                this.quillRef.setContents(JSON.parse(this.props.note.text));
            }
            else {
                this.setState({ title: '', value: ''})
                this.quillRef.setContents('');
            }
        }
    }

    handleChange = (content, delta, source, editor) => {
        this.setState({ content: content })
        this.emitChanges();
    }

    emitChanges() {
        if (this.props.onChangeValue) {
            this.props.onChangeValue({
                title: '', //this.state.title,
                text: JSON.stringify(this.quillRef.getContents())
            })
        }
    }

    insert(char) {
        const range = this.quillRef.selection.savedRange;
        if (range && range.length != 0) return;

        let data = {
            name: char.name.capitalize(),
            color: GameData.ClassToColor(char.class).replace('#', ''),
            class: GameData.ClassToObj(char.class).slug
        };

        const cursorPosition = range.index;

        this.quillRef.insertEmbed(cursorPosition, 'wowchar', data, 'api');
        this.quillRef.insertText(cursorPosition + 2, ' ', 'api');
        this.quillRef.setSelection(cursorPosition + 1, 'api');
    }
	
	render() {
        return (
            <Row className="border m-1 rounded bg-white">
                <Col lg="12" className="py-2 text-center">
                    {this.state.characters.length === 0 && ('No characters selected')}
                    {this.state.characters.sort((a, b) => (a.class > b.class)).map((char, idx) => {
                        return (
                            <Button key={char.id} value={char.id} className={`btn-transparent border-0 GameColorClass ${GameData.ClassToObj(char.class).slug}`}
                                onClick={(ev) => { ev.preventDefault(); this.insert(char) /* `|cff${GameData.ClassToColor(char.class).replace('#', '')}${char.name}|r` */ }}>
                                {char.name.capitalize()}
                            </Button>)
                    })}
                </Col>
                {/*
                <Col lg="12" className="p-0">
                    <FormInput value={this.state.title} onChange={(evt) => this.setState({ title: evt.target.value }, () => this.emitChanges())} size="lg" className="m-0 rounded-0 border-0" placeholder="Title..." />
                </Col>
                */ }
                <Col lg="12" className="h-100 min-vh-20 p-0 note-editor">
                    
                    <ReactQuill className="add-new-post__editor mb-1 border-top"
                        formats={['wowchar', 'wowico', 'wowspell']}
                        modules={{ toolbar: false }}
                        ref={(el) => { this.reactQuillRef = el }}
                        value={this.state.content}
                        onChange={this.handleChange} />
                </Col>
            </Row>
        );
	}
}

export default NoteEditor