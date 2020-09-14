import {Quill} from "react-quill";

let Base = Quill.import('blots/embed');
class SpellBlot extends Base {
    static create(value) {
        let node = super.create(value.name);

        node.innerHTML = `<img class="GameIcon--tiny" src="${value.path}" alt="${value.name}" />`;

        node.setAttribute('data-path', value.path);
        node.setAttribute('data-name', value.name);
        node.setAttribute('data-spell', value.spell || false);
        node.setAttribute('class', `wowico`);
        node.setAttribute('spellcheck', "false");
        node.setAttribute('autocomplete', "off");
        node.setAttribute('autocorrect', "off");
        node.setAttribute('autocapitalize', "off");

        return node;
    }

    static value(node) {
        return {
            name: node.getAttribute('data-name'),
            path: node.getAttribute('data-path')
        }
    }

    static formats(node) {
        return {
            name: node.getAttribute('data-name'),
            path: node.getAttribute('data-path')
        }
    }
}
SpellBlot.blotName = 'wowspell';
SpellBlot.tagName = 'wowspell';

export default SpellBlot;