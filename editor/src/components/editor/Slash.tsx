import { $, component$, JSXOutput, NoSerialize, PropsOf, QRL, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { LuCode, LuHeading1, LuHeading2, LuHeading3, LuList, LuListOrdered, LuQuote, LuText, LuWand2 } from "@qwikest/icons/lucide";
import type { ChainedCommands, Editor } from "@tiptap/core";

const items: {
    icon: JSXOutput,
    content: string,
    category: string,
    action?: QRL<(cmd: ChainedCommands) => void>
}[] = [
    {
        icon: <LuWand2/>,
        content: "AI Writer",
        category: "ai"
    },
    {
        icon: <LuText/>,
        content: "Paragraph",
        category: "format",
        action: $((cmd) => {
            cmd.setParagraph().run()
        })
    },
    {
        icon: <LuHeading1/>,
        content: "Heading 1",
        category: "format",
        action: $((cmd) => {
            cmd.setHeading({
                level: 1
            }).run()
        })
    },
    {
        icon: <LuHeading2/>,
        content: "Heading 2",
        category: "format",
        action: $((cmd) => {
            cmd.setHeading({
                level: 2
            }).run()
        })
    },
    {
        icon: <LuHeading3/>,
        content: "Heading 3",
        category: "format",
        action: $((cmd) => {
            cmd.setHeading({
                level: 3
            }).run()
        })
    },
    {
        icon: <LuList/>,
        content: "Bullet list",
        category: "format",
        action: $((cmd) => {
            cmd.toggleBulletList().run()
        })
    },
    {
        icon: <LuListOrdered/>,
        content: "Ordered list",
        category: "format",
        action: $((cmd) => {
            cmd.toggleOrderedList().run()
        })
    },
    {
        icon: <LuQuote/>,
        content: "Blockquote",
        category: "format",
        action: $((cmd) => {
            cmd.setBlockquote().run()
        })
    },
    {
        icon: <LuCode/>,
        content: "Code block",
        category: "format",
        action: $((cmd) => {
            cmd.setCodeBlock().run()
        })
    }
]

export default component$(({ editor, ...props }: PropsOf<'div'> & { editor: NoSerialize<Editor> }) => {
    const open = useSignal(false);
    const index = useSignal(0)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        document.addEventListener('slash-open', () => {
            open.value = true
        })
        
        document.addEventListener('slash-close', () => {
            open.value = false
        })

        const keys = ['ArrowUp', 'ArrowDown', 'Enter'];
        document.addEventListener('keydown', async (e) => {
            if(!open.value) return
            if(keys.includes(e.key)) {
                e.preventDefault();
            }

            const i = index.value;
            if(e.key == keys[0]) {
                index.value = i == 0 
                    ? items.length - 1
                    : i - 1;
            } else if(e.key == keys[1]) {
                index.value = i == items.length - 1 
                    ? 0 
                    : i + 1;
            } else if(e.key == keys[2]) {
                if(editor && items[i].action) {
                    const from = editor.state.selection.$from;

                    const textBeforeCursor = from.nodeBefore?.text || ''

                    // Check if text before cursor starts with `/`
                    if (textBeforeCursor.startsWith('/')) {
                        editor.chain().command(({ tr }) => {
                            tr.delete(from.pos - from.parent.textContent.length, from.pos);
                            return true
                        }).run()
                    }
                    await items[i].action(editor.chain());
                }
            }
        })
    })

    return <div id="slash" {...props}>
        {
            items
                .reduce<string[]>((a, c) => {
                    if(!a.includes(c.category)) {
                        a.push(c.category)
                    }
                    return a;
                }, [])
                .map((category, i, categories) => <>
                    <p key={i}>
                        {
                            category
                        }
                    </p>
                    {
                        items
                            .filter(item => item.category == category)
                            .map((item, j) => <div
                                onClick$={() => {
                                    if(editor && item.action) {
                                        item.action(editor.chain());
                                    }
                                }}
                                key={i + '-' + j} 
                                class={
                                    index.value == categories.slice(0, i)
                                        .map(c => items.filter(item => item.category == c).length)
                                        .reduce((s, c) => s + c, 0) + j
                                    ? 'bg-black bg-opacity-10'
                                    : ''}>
                                {
                                    item.icon
                                }
                                {
                                    item.content
                                }
                            </div>)
                    }
                </>)
        }
    </div>
})