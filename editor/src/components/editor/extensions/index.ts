import StarterKit from '@tiptap/starter-kit'
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import TextStyle from '@tiptap/extension-text-style'
import { Color } from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Typography from "@tiptap/extension-typography"
import { type Extensions } from "@tiptap/core";
import { DisableEnter } from './slash'

export default [
    StarterKit,
    Superscript,
    Subscript,
    TextStyle,
    Color,
    Typography,
    Placeholder.configure({
        placeholder: `Press '/' for commands`
    }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
    }),
    Underline,
    DisableEnter
] as Extensions