import { $, component$, JSXOutput, NoSerialize, PropsOf, QRL, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { LuCode, LuHeading1, LuHeading2, LuHeading3, LuList, LuListOrdered, LuQuote, LuText, LuWand2 } from "@qwikest/icons/lucide";
import type { ChainedCommands, Editor } from "@tiptap/core";

interface Item{
    icon: JSXOutput,
    content: string,
    class?: string,
    activeClass?: string,
    category: string,
    action?: QRL<(cmd: ChainedCommands) => void>
}

const items_list: Item[] = [
    {
        icon: <LuWand2/>,
        content: "AI Writer",
        category: "ai",
        activeClass: "bg-lime-300",
        action: $(() => {
            const event = new Event('prompt-open');
            document.dispatchEvent(event)
        })
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
    const index = useSignal(0);
    const rect = useSignal([0, 0])
    const items = useStore<Item[]>([]);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
        items.push(...items_list);

        const keys = ['ArrowUp', 'ArrowDown', 'Enter'];
        const opens = () => open.value = true
        const closes = () => open.value = false
        // @ts-ignore
        const relocate = (e: Event) => rect.value = e.detail.rect
        const keydown = async (e: KeyboardEvent) => {
            // If slash-menu is not open, we do nothing
            if(!open.value) return
            // We prevent the editor to handle these keys
            if(keys.includes(e.key)) e.preventDefault();

            
            const i = index.value;
            if(e.key == keys[0]) {
                // the item above or the last one
                index.value = i == 0 
                    ? items.length - 1
                    : i - 1;
            } else if(e.key == keys[1]) {
                // the item bellow or the first one.
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
        }

        document.addEventListener('slash-open', opens);
        document.addEventListener('slash-close', closes);
        document.addEventListener('slash-relocate', relocate);
        document.addEventListener('keydown', keydown);
        
        cleanup(() => {
            document.removeEventListener('slash-open', opens);
            document.removeEventListener('slash-close', closes);
            document.removeEventListener('slash-relocate', relocate);
            document.removeEventListener('keydown', keydown);
            items.splice(0, items.length)
            index.value = 0;
        })
    })

    return <div id="slash" style={{
        top: rect.value[0],
        left: rect.value[1],
        display: open.value ? undefined : 'none'
    }}  {...props}>
        {
            items
                .reduce<string[]>((a, c) => {
                    if(!a.includes(c.category)) {
                        a.push(c.category)
                    }
                    return a;
                }, [])
                .map((category, i, categories) => <section key={i}>
                    <p>
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
                                class={[
                                    item.class ? item.class : '',
                                    index.value == categories.slice(0, i)
                                        .map(c => items.filter(item => item.category == c).length)
                                        .reduce((s, c) => s + c, 0) + j
                                    ? item.activeClass ? item.activeClass : 'bg-black bg-opacity-10'
                                    : ''
                                ]}>
                                {
                                    item.icon
                                }
                                {
                                    item.content
                                }
                            </div>)
                    }
                </section>)
        }
    </div>
})