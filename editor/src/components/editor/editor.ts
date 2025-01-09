import { Editor } from "@tiptap/core";

import extensions from "./extensions";
import bubble_ext from "./extensions/bubble";

export default async (data: string) => {
    const ext = extensions;
    
    let editor_container = document.getElementById('editor');
    let bubble = document.getElementById('bubble');

    await new Promise((resolve) => {
        setTimeout(() => {
            if(!editor_container) editor_container = document.getElementById('editor');
            if(!bubble) bubble = document.getElementById('bubble');

            if(bubble && editor_container) {
                resolve(null)
            }
        }, 100)
    });
    
    ext.push(bubble_ext(bubble!))
    const editor = new Editor({
        element: editor_container!,
        extensions: ext,
        content: {
            type: "doc",
            content: JSON.parse(data)
        }
    })

    return editor
}