import { Extension } from "@tiptap/core";
import BubbleMenu from "@tiptap/extension-bubble-menu";

export const DisableEnter = Extension.create({
    addKeyboardShortcuts() {
        return {
            Enter: () => {
                return document.getElementById('editor')?.classList.contains('slash-active') || false
            },
        };
    },
});

export default (element: HTMLElement) => BubbleMenu.configure({
    element,
    pluginKey: 'slash',
    tippyOptions: {
        placement: "bottom-start",
        onShown() {
            const event = new Event("slash-open")
            document.dispatchEvent(event);
            document.getElementById('editor')?.classList.add('slash-active')
        },
        onHide() {
            const event = new Event("slash-close")
            document.dispatchEvent(event)
            document.getElementById('editor')?.classList.remove('slash-active')
        }
    },
    shouldShow({ state, from } ) {
        const $from = state.doc.resolve(from)
        const isRootDepth = $from.depth === 1;
        const isStartOfNode = $from.parent.textContent?.charAt(0) === '/';

        const content = $from.parent.text?.slice(1);
        const event = new CustomEvent('slash-update', {
            detail: content
        });
        document.dispatchEvent(event);

        return isRootDepth && isStartOfNode
    }
})