import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormInput, Button } from "shards-react";
import ReactQuill, { Quill } from "react-quill";
import { toast } from 'react-toastify';

import "react-quill/dist/quill.snow.css";
import "../assets/quill.css";

import PageTitle from "../components/common/PageTitle";

import { Api, GameData } from "../data";
import { Dispatcher, Constants } from "../flux";
import { CharacterBlot, IconBlot, SpellBlot } from "../components/notes";
import { useAuthState } from "../context";

Quill.register('formats/wowchar', CharacterBlot);
Quill.register('formats/wowico', IconBlot);
Quill.register('formats/wowspell', SpellBlot);

let loaded = false;

const NotesOverview = (props) => {
    const { user, team } = useAuthState();

    let dispatcherToken;
    let quillRef;
    let reactQuillRef;


    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const [ notes, setNotes ] = useState([]);
    const [ selected, setSelected ] = useState(null);
    const [ title, setTitle ] = useState('');

    const load = async () => {
        loaded = true;
        try
        {
            setLoading(true);
            const res = await Api.GetNotes({ favorite: 1, team: team.id });
            if (res)
            {
                setNotes(res.data.data);
            }
            setLoading(false);
        }
        catch (error)
        {
            setLoading(false);
            if (error.response)
                setError(error.response.data.message);
            else
                setError(error.message);
        }
    }

    const save = async () => {
        setLoading(true);

        if (selected) {
            try
            {
                const res = await Api.UpdateNote(selected.id, title, JSON.stringify(quillRef.getContents()), true, { team: team.id })
                if (res)
                {
                    toast.success(`Note ${title} updated`);
                    let newNotes = notes;
                    let idx = notes.findIndex(n => n.id === res.data.data.id);
                    if (idx >= 0) {
                        newNotes[idx] = res.data.data;
                        setNotes(newNotes);
                    }
                }
                setLoading(false);
            }
            catch (error)
            {
                setLoading(false);
                if (error.response)
                    setError(error.response.data.message);
                else
                    setError(error.message);
            }
        }
        else {
            try
            {
                const res = await Api.CreateNote(title, JSON.stringify(quillRef.getContents()), true, { team: team.id })
                if (res)
                {
                    toast.success(`Note ${title} created`);
                    notes.push(res.data.data);
                    setNotes(notes);
                    setSelected(null);
                    setTitle('');
                    quillRef.setContents('');
                }
                setLoading(false);
            }
            catch (error)
            {
                setLoading(false);
                if (error.response)
                    setError(error.response.data.message);
                else
                    setError(error.message);
            }
        }
    }

    const del = async(note) => {
        setLoading(true);
        try
        {
            const res = await Api.DeleteNote(note.id, { team: team.id });
            if (res)
            {
                setLoading(false);

                let idx = notes.findIndex(n => n.id === note.id);

                if (idx >= 0) {
                    let newNotes = [...notes];
                    newNotes.splice(idx, 1);
                    setNotes(newNotes);

                    if (selected && selected.id === note.id) {
                        setSelected(null);
                        setTitle('');
                        quillRef.setContents('');
                    }
                }

                toast.success(`Note ${note.title} deleted`);
            }
        }
        catch (error)
        {
            setLoading(false);
            if (error.response)
                setError(error.response.data.message);
            else
                setError(error.message);
        }
    }

    const select = async(note) => {
        if (selected && selected.id === note.id) {
            setTitle('');
            setSelected(null);
            quillRef.setContents('');
        }
        else {
            setSelected(note);
            setTitle(note.title);
            quillRef.setContents(JSON.parse(note.text));
        }
    }

    const insertIco = (ev, ico) => {
        ev.preventDefault();

        if (!quillRef)
            return;

        const range = quillRef.selection.savedRange;
        if (range && range.length != 0) return;

        const cursorPosition = range.index;

        quillRef.insertEmbed(cursorPosition, 'wowico', ico, 'api');
        // this.quillRef.insertText(cursorPosition + 2, ' ', 'api');
        quillRef.setSelection(cursorPosition + 1, 'api');
    }

    const insertSpell = (ev) => {
        ev.preventDefault();

        if (!quillRef)
            return;

        const range = quillRef.selection.savedRange;
        if (range && range.length != 0) return;

        const cursorPosition = range.index;

        var spellId = window.prompt("Spell id", "");
        if (spellId.length > 0)
        {
            quillRef.insertEmbed(cursorPosition, 'wowspell', {
                path: Api.SpellMedia(spellId),
                name: spellId
            }, 'api');
            //this.quillRef.insertText(cursorPosition + 2, ' ', 'api');
            quillRef.setSelection(cursorPosition + 1, 'api');
        }
    }

    useEffect(() => {
        if (!loaded && (!notes || notes.length == 0))
            load();

        if (!quillRef)
            quillRef = reactQuillRef.getEditor();
        
        if (!dispatcherToken) {
            /*
            this.dispatcherToken = Dispatcher.register(payload => {
                switch (payload.actionType) {
                    case Constants.CREATED:
                    case Constants.UPDATED:
                        load()
                        break;
                    case Constants.DELETED:
                        if (selected && payload.note == selected.id)
                            this.setState({ selected: null });
                        this.loadNotes();
                        break;
                    default:
                }
            });
            */
        }
    })

    return (
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
                                <Col md="2" className="text-right">{loading && (<i className='material-icons spin'>refresh</i>)}</Col>
                            </Row>
                        </CardHeader>
                        {error && (
                            <CardBody
                                className="bg-danger text-white text-center p-3 "
                                style={{ boxShadow: "inset 0 0 5px rgba(0,0,0,.2)" }}>
                                <i className='material-icons'>error</i> {error}
                            </CardBody>
                        )}
                        <CardBody className="py-0 px-3">
                            <Row>
                                <Col md="3" className="bg-light border-right px-0 overflow-auto">
                                    {notes && notes.sort((a, b) => a.id > b.id).map((note, idx) => {
                                        return (
                                            <Row md="12" className={`fav-note px-0 py-2 m-0 border-bottom m-0 ${selected && selected.id === note.id ? 'selected' : ''}`}>
                                                <Col onClick={(ev) => select(note)}><h6 className="m-0">{note.title}</h6></Col>
                                                <Col md="2" className="text-right"><a className="delete" onClick={(ev) => del(note)}><i className="material-icons">clear</i></a></Col>
                                            </Row>
                                        );
                                    })}
                                </Col>
                                <Col md="9" className="p-0">
                                    <Row className="border-bottom p-0 m-0">
                                        <Col md="12" className="p-0">
                                            <FormInput value={title} onChange={(evt) => setTitle(evt.target.value)} size="lg" className="m-0 rounded-0 border-0" placeholder="Title..." />
                                        </Col>
                                    </Row>

                                    <Row className="p-0 m-0">
                                        <Col md="9" className="p-0 note-editor">
                                            <ReactQuill className="add-new-post__editor border-0 vh-50"
                                                formats={['wowchar', 'wowico', 'wowspell']}
                                                modules={{ toolbar: false }}
                                                ref={(el) => { reactQuillRef = el }} />
                                        </Col>
                                        <Col md="3" className="border-left border-bottom px-0">
                                            <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                {GameData.Icons.Raid.map((ico, idx) =>
                                                    <Button theme="light" onClick={ev => insertIco(ev, ico)}>
                                                        <img className="GameIcon--tiny" src={`/images/blizzard/${ico.path}`} alt={ico.name} />
                                                    </Button>
                                                )}
                                            </Col>
                                            <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                {GameData.Icons.Classes.map((ico, idx) =>
                                                    <Button theme="light" onClick={ev => insertIco(ev, ico)}>
                                                        <img className="GameIcon--tiny" src={`/images/blizzard/${ico.path}`} alt={ico.name} />
                                                    </Button>
                                                )}
                                            </Col>
                                            <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                {GameData.Icons.Others.map((ico, idx) =>
                                                    <Button theme="light" onClick={ev => insertIco(ev, ico)}>
                                                        <img className="GameIcon--tiny" src={`/images/blizzard/${ico.path}`} alt={ico.name} />
                                                    </Button>
                                                )}
                                            </Col>
                                            <Col md="12" lg="12" className="py-2 px-0 text-center border-bottom">
                                                <Button theme="light" className="tiny" onClick={ev => insertSpell(ev)}>
                                                    <img className="GameIcon-tiny rounded" src="/images/blizzard/inv_misc_questionmark.jpg" alt="unknown" /> Spell
                                                </Button>
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row className="border-top p-0 m-0">
                                        <Col md="12" className="py-2 text-right">
                                            <Button onClick={() => save() } disabled={loading} className="m-0"><i className='material-icons'>save</i> Save</Button>
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

export default NotesOverview;
