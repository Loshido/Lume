import { Editor } from "@tiptap/core";

import extensions from "./extensions";
import bubble_ext from "./extensions/bubble";
import slash_ext from "./extensions/slash";

export default async (data: string) => {
    const ext = extensions;

    
    let editor_container = document.getElementById('editor');
    let bubble = document.getElementById('bubble');
    let slash = document.getElementById('slash');

    await new Promise((resolve) => {
        setTimeout(() => {
            if(!editor_container) editor_container = document.getElementById('editor');
            if(!bubble) bubble = document.getElementById('bubble');
            if(!slash) slash = document.getElementById('slash');

            if(bubble && editor_container && slash) {
                resolve(null)
            }
        }, 100)
    });
        
    ext.push(bubble_ext(bubble!))
    ext.push(slash_ext(slash!))
    const editor = new Editor({
        element: editor_container!,
        extensions: ext,
        content: data
    })

    return editor
}