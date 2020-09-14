import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormInput, Button } from "shards-react";
import ReactQuill, { Quill } from "react-quill";
import { toast } from 'react-toastify';

import "react-quill/dist/quill.snow.css";
import "../assets/quill.css";

import PageTitle from "../components/common/PageTitle";

import { Api, GameData } from "../data";
import { Dispatcher, Constants } from "../flux";
import { CharacterBlot, IconBlot, SpellBlot } from "../components/notes";

Quill.register('formats/wowchar', CharacterBlot);
Quill.register('formats/wowico', IconBlot);
Quill.register('formats/wowspell', SpellBlot);

class NotesOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
            error: '',

            selected: null,
            title: ''
        }

        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.select = this.select.bind(this);
        this.loadNotes = this.loadNotes.bind(this);

        this.insertIco = this.insertIco.bind(this);
        this.insertSpell = this.insertSpell.bind(this);
        
        this.reactQuillRef = null;
        this.quillRef = null;
    }

    loadNotes() {
        this.setState({ loading: true })
        Api.GetFavoritesNotes()
            .then(res => {
                if (!res.data.err) {
                    this.setState({ loading: false, notes: res.data.data })
                }
            })
            .catch(err => {
                this.setState({ loading: false, error: err.message })
            })
    }

    componentDidMount() {
        this.loadNotes();
        this.quillRef = this.reactQuillRef.getEditor();

        this.dispatcherToken = Dispatcher.register(payload => {
            switch (payload.actionType) {
                case Constants.NOTE_CREATED:
                case Constants.NOTE_UPDATED:
                    this.loadNotes();
                    break;
                case Constants.NOTE_DELETED:
                    if (this.state.selected && payload.note == this.state.selected.id)
                        this.setState({ selected: null });
                    this.loadNotes();
                    break;
                default:
            }
        });
    }

    componentWillUnmount() {
        Dispatcher.unregister(this.dispatcherToken);
    }

    save() {
        this.setState({ loading: true })
        if (this.state.selected) {
            Api.UpdateNote(this.state.selected.id, this.state.title, JSON.stringify(this.quillRef.getContents()), true)
                .then(res => {
                    this.setState({ loading: false })
                    if (!res.data.err) {
                        toast.success(`Note ${this.state.title} updated`);

                        let notes = this.state.notes;
                        let idx = this.state.notes.findIndex(n => n.id === res.data.data.id);
                        if (idx >= 0) {
                            notes[idx] = res.data.data;
                            this.setState({ notes: notes })
                        }
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, error: err.message })
                })
        }
        else {
            Api.CreateNote(this.state.title, JSON.stringify(this.quillRef.getContents()), true)
                .then(res => {
                    this.setState({ loading: false })
                    if (!res.data.err) {
                        toast.success(`Note ${this.state.title} created`);
                        let notes = this.state.notes;
                        notes.push(res.data.data);
                        this.setState({ notes: notes, title: '' });
                        this.quillRef.setContents('');
                    }
                })
                .catch(err => {
                    this.setState({ loading: false, error: err.message })
                })
        }
    }

    delete(note) {
        this.setState({ loading: true });
        Api.DeleteNote(note.id)
        .then(res => {
            if (!res.data.err) {
                this.setState({ loading: false })

                let notes = this.state.notes;
                let idx = this.state.notes.findIndex(n => n.id === note.id);
                if (idx >= 0) {
                    notes.splice(idx, 1);
                    this.setState({ notes: notes })

                    if (this.state.selected && this.state.selected.id === note.id) {
                        this.setState({ selected: null, title: '' });
                        this.quillRef.setContents('');
                    }
                }

                toast.success(`Note ${note.title} deleted`);
            }
        })
        .catch(err => {
            this.setState({ loading: false, error: err.message })
        })
    }

    select(note) {
        if (this.state.selected && this.state.selected.id === note.id) {
            this.setState({
                selected: null,
                title: ''
            });

            this.quillRef.setContents('');
        }
        else {
            this.setState({
                selected: note,
                title: note.title
            });

            this.quillRef.setContents(JSON.parse(note.text));
        }
    }

    insertIco(ev, ico) {
        ev.preventDefault();

        const range = this.quillRef.selection.savedRange;
        if (range && range.length != 0) return;

        const cursorPosition = range.index;

        this.quillRef.insertEmbed(cursorPosition, 'wowico', ico, 'api');
        // this.quillRef.insertText(cursorPosition + 2, ' ', 'api');
        this.quillRef.setSelection(cursorPosition + 1, 'api');
    }

    insertSpell(ev) {
        ev.preventDefault();

        const range = this.quillRef.selection.savedRange;
        if (range && range.length != 0) return;

        const cursorPosition = range.index;

        var spellId = window.prompt("Spell id", "");
        if (spellId.length > 0)
        {
            this.quillRef.insertEmbed(cursorPosition, 'wowspell', {
                path: Api.SpellMedia(spellId),
                name: spellId
            }, 'api');
            //this.quillRef.insertText(cursorPosition + 2, ' ', 'api');
            this.quillRef.setSelection(cursorPosition + 1, 'api');
        }
    }

    render() {
        return(
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle title="Notes" subtitle="Dashboard" className="text-sm-left mb-3" />
                </Row>

                <Row className="justify-content-md-center mb-4">
                    <Col md="12">
                        <Card>
                            <CardHeader className="border-bottom py-2">
                                <Row>
                                    <Col md="10"><h6 className="m-0">Notes Manager</h6></Col>
                                    <Col md="2" className="text-right">{this.state.loading && (<i className='material-icons spin'>refresh</i>)}</Col>
                                </Row>
                            </CardHeader>
                            {this.state.error && (
                                <CardBody
                                    className="bg-danger text-white text-center p-3 "
                                    style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                    <i className='material-icons'>error</i> {this.state.error}
                                </CardBody>
                            )}
                            <CardBody className="py-0 px-3">
                                <Row>
                                    <Col md="3" className="bg-light border-right px-0 overflow-auto">
                                        {this.state.notes && this.state.notes.sort((a, b) => a.id > b.id).map((note, idx) => {
                                            return (
                                                <Row md="12" className={`fav-note px-0 py-2 m-0 border-bottom m-0 ${this.state.selected && this.state.selected.id === note.id ? 'selected' : ''}`}>
                                                    <Col onClick={(ev) => this.select(note)}><h6 className="m-0">{note.title}</h6></Col>
                                                    <Col md="2" className="text-right"><a className="delete" onClick={(ev) => this.delete(note)}><i className="material-icons">clear</i></a></Col>
                                                </Row>
                                            );
                                        })}
                                    </Col>
                                    <Col md="9" className="p-0">
                                        <Row className="border-bottom p-0 m-0">
                                            <Col md="12" className="p-0">
                                                <FormInput value={this.state.title} onChange={(evt) => this.setState({ title: evt.target.value })} size="lg" className="m-0 rounded-0 border-0" placeholder="Title..." />
                                            </Col>
                                        </Row>

                                        <Row className="p-0 m-0">
                                            <Col md="9" className="p-0 note-editor">
                                                <ReactQuill className="add-new-post__editor border-0 vh-50"
                                                    formats={['wowchar', 'wowico', 'wowspell']}
                                                    modules={{ toolbar: false }}
                                                    ref={(el) => { this.reactQuillRef = el }} />
                                            </Col>
                                            <Col md="3" className="border-left border-bottom px-0">
                                                <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                    {GameData.Icons.Raid.map((ico, idx) =>
                                                        <Button theme="light" onClick={ev => this.insertIco(ev, ico)}>
                                                            <img className="GameIcon--tiny" src={`/images/blizzard/${ico.path}`} alt={ico.name} />
                                                        </Button>
                                                    )}
                                                </Col>
                                                <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                    {GameData.Icons.Classes.map((ico, idx) =>
                                                        <Button theme="light" onClick={ev => this.insertIco(ev, ico)}>
                                                            <img className="GameIcon--tiny" src={`/images/blizzard/${ico.path}`} alt={ico.name} />
                                                        </Button>
                                                    )}
                                                </Col>
                                                <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                    {GameData.Icons.Others.map((ico, idx) =>
                                                        <Button theme="light" onClick={ev => this.insertIco(ev, ico)}>
                                                            <img className="GameIcon--tiny" src={`/images/blizzard/${ico.path}`} alt={ico.name} />
                                                        </Button>
                                                    )}
                                                </Col>
                                                <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                    <Button theme="light" className="tiny" onClick={ev => this.insertSpell(ev)}>
                                                        <img className="GameIcon-tiny rounded" src="/images/blizzard/inv_misc_questionmark.jpg" alt="unknown" /> Spell
                                                    </Button>
                                                </Col>
                                            </Col>
                                        </Row>

                                        <Row className="border-top p-0 m-0">
                                            <Col md="12" className="py-2 text-right">
                                                <Button onClick={() => this.save() } className="m-0"><i className='material-icons'>save</i> Save</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default NotesOverview;
