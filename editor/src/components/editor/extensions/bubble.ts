import BubbleMenu from "@tiptap/extension-bubble-menu";

export default (element: HTMLElement) => BubbleMenu.configure({
    element,
    pluginKey: 'bubble',
    tippyOptions: {
        placement: "top-start",
        onShown() {
            const event = new Event("bubble-open")
            document.dispatchEvent(event);
        },
        onHide() {
            const event = new Event("bubble-close")
            document.dispatchEvent(event)
        }
    }
})