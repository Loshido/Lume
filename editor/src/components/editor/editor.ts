import { Editor } from "@tiptap/core";

import StarterKit from '@tiptap/starter-kit'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import TextStyle from '@tiptap/extension-text-style'
import { Color } from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Typography from "@tiptap/extension-typography"

export default (data: string, element: Element, bubble: HTMLElement) => {
    const editor = new Editor({
        element,
        extensions: [
            StarterKit,
            Superscript,
            Subscript,
            TextStyle,
            Color,
            Typography,
            Placeholder.configure({
                placeholder: `Tapez / pour insérer un élement`
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            Underline,
            BubbleMenu.configure({
                element: bubble,
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
        ],
        content: data
    })

    return editor
}