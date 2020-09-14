import {Quill} from "react-quill";

let Base = Quill.import('blots/embed');
class CharacterBlot extends Base {
    static create(value) {
        let node = super.create(value.name);

        node.innerHTML = value.name;

        node.setAttribute('data-character', value.name);
        node.setAttribute('data-color', value.color);
        node.setAttribute('data-cl', value.class);
        node.setAttribute('data-note', `|cff${value.color}${value.name}|r`);
        node.setAttribute('class', `wowchar GameColorClass ${value.class}`);
        node.setAttribute('spellcheck', "false");
        node.setAttribute('autocomplete', "off");
        node.setAttribute('autocorrect', "off");
        node.setAttribute('autocapitalize', "off");

        return node;
    }

    static value(node) {
        return {
            name: node.getAttribute('data-character'),
            color: node.getAttribute('data-color'),
            class: node.getAttribute('data-cl'),
            note: node.getAttribute('data-note')
        }
    }

    static formats(node) {
        return {
            name: node.getAttribute('data-character'),
            color: node.getAttribute('data-color'),
            class: node.getAttribute('data-cl'),
            note: node.getAttribute('data-note')
        }
    }
}
CharacterBlot.blotName = 'wowchar';
CharacterBlot.tagName = 'wowchar';

export default CharacterBlot