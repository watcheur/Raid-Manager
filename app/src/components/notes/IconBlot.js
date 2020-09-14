import {Quill} from "react-quill";

let Base = Quill.import('blots/embed');
class IconBlot extends Base {
    static create(value) {
        let node = super.create(value.name);

        node.innerHTML = `<img class="GameIcon--tiny" src="/images/blizzard/${value.path}" alt="${value.name}" />`;

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
IconBlot.blotName = 'wowico';
IconBlot.tagName = 'wowico';

export default IconBlot;