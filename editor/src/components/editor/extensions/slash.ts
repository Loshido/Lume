import { Extension } from "@tiptap/core";

export const DisableEnter = Extension.create({
    addKeyboardShortcuts() {
        return {
            Enter: () => {
                return document.getElementById('slash')?.style.display != 'none' || false
            },
        };
    },
});