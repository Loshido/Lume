import { Extension } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";

export default Extension.create({
    name: "command",
    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            } as SuggestionOptions,
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});