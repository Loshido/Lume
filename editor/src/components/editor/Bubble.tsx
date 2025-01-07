import { $, component$, NoSerialize, PropsOf, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { LuBold, LuCode, LuHighlighter, LuItalic, LuLink, LuPalette, LuStrikethrough, LuSubscript, LuSuperscript, LuUnderline } from "@qwikest/icons/lucide";
import type { Editor } from "@tiptap/core";

interface BubbleProps {
    editor?: NoSerialize<Editor>
}

export default component$(({editor, ...props}: BubbleProps & PropsOf<'div'>) => {
    const couleur = useSignal("#000")
    const buttons = [
        {
            name: "bold",
            title: "Mettre en gras",
            slot: <LuBold/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleBold().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "italic",
            title: "Mettre en italic",
            slot: <LuItalic/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleItalic().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "underline",
            title: "Souligner",
            slot: <LuUnderline/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleUnderline().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "strike",
            title: "Barrer",
            slot: <LuStrikethrough/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleStrike().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "code",
            title: "Mettre en format code",
            slot: <LuCode/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleCode().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "superscript",
            title: "Mettre en exposant",
            slot: <LuSuperscript/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleSuperscript().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "subscript",
            title: "Mettre en indice",
            slot: <LuSubscript/>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                editor?.chain().focus().toggleSubscript().run()
                t.classList.toggle('active')
            })
        },
        {
            name: "link",
            title: "Créer un lien",
            slot: <>
                <LuLink/>
            </>,
            action: $((_: PointerEvent, t: HTMLDivElement) => {
                const previous = editor?.getAttributes('link').href
                const url = window.prompt('URL', previous)
                if(url?.length == 0) {
                    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
                    t.classList.remove('active')
                } else {
                    editor?.chain().focus().extendMarkRange('link').setLink({
                        href: url || window.location.origin,
                        target: "_blank"
                    }).run()
                    t.classList.add('active');
                }
            })
        }
    ]
    const names = buttons.map(button => button.name)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        document.addEventListener('bubble-open', () => {
            if(!editor) return
            const attributes = editor.getAttributes('textStyle')
            couleur.value = attributes.color || "#000";

            const marks = editor.state.selection.$head.marks()
            marks.forEach(mark => {
                const e = document.getElementById(`bubble-${mark.type.name}`)
                e?.classList.add('active')
            })
        })

        document.addEventListener('bubble-close', () => {
            names.forEach(n => {
                const e = document.getElementById(`bubble-${n}`)
                e?.classList.remove('active')
            })  
        })
    })

    return <div id="bubble" {...props}>
        {
            buttons.map(button => <div
                id={`bubble-${button.name}`}
                key={button.name} 
                title={button.title} 
                onClick$={button.action}>
                {button.slot}
            </div>)
        }
        <div>
            <LuPalette style={`stroke: ${couleur.value};`}/>
            {/* <span style={`color: ${couleur.value};`}>Couleur</span> */}
            <input 
                name="couleur"
                onInput$={(_, t) => {
                    editor?.chain().focus().setColor(t.value).run()
                    couleur.value = t.value
                }}
                type="color"/>
        </div>
    </div>
})