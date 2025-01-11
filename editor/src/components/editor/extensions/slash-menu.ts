import type { Editor, Range } from "@tiptap/core";


export default () => ({
    onStart: (props: { editor: Editor; range: Range }) => {
        // start tells the thing to appear

        const { selection } = props.editor.state;

        const parentNode = selection.$from.node(selection.$from.depth);
        const blockType = parentNode.type.name;

        if (blockType === "codeBlock") {
            return false;
        }

        const position = props.editor.view.coordsAtPos(props.range.to)
        const show = new Event('slash-open');
        const rect = new CustomEvent('slash-relocate', {
            detail: {
                rect: [position.bottom + 10, position.left]
            }
        });

        document.dispatchEvent(show)
        document.dispatchEvent(rect)
    },
    onUpdate: (props: { editor: Editor; range: Range }) => {
        const position = props.editor.view.coordsAtPos(props.range.to)
        const rect = new CustomEvent('slash-relocate', {
            detail: {
                rect: [position.bottom + 10, position.left]
            }
        });

        document.dispatchEvent(rect)
    },
    onExit: () => {
        const hide = new Event('slash-close');
        document.dispatchEvent(hide);
    },
});