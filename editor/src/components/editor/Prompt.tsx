import { component$, NoSerialize, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Editor } from "@tiptap/core";
import { Transaction } from "@tiptap/pm/state";

interface Props {
    editor: NoSerialize<Editor>
}

export default component$(({ editor }: Props) => {
    const prompt = useStore({
        pos: 0,
        active: false,
        text: '',
        top: 0,
        left: 0
    })

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({ cleanup }) => {
        const closes = () => {
            prompt.active = false;
            editor?.off('update', update)
        }
        const update = (props: { transaction: Transaction }) => {
            const selection = props.transaction.selection
            const before = selection.$from.before() + 1
            if(before != prompt.pos) {
                closes();
                return;
            }

            const coords = editor?.view.coordsAtPos(selection.from);
            if(coords && coords.bottom + 10 != prompt.top) {
                prompt.top = coords.bottom + 10;
            }
        }
        const opens = () => {
            prompt.active = true;

            const selection = editor?.state.selection;
            if(!selection) return

            const coords = editor.view.coordsAtPos(selection.from);
            prompt.top = coords.bottom + 10;
            prompt.left = coords.left;
            prompt.pos = selection.$from.before() + 1;

            editor?.on('update', update)
        }

        document.addEventListener('prompt-open', opens)

        cleanup(() => {
            closes();
            document.removeEventListener('prompt-open', opens)
        })
    })

    return <div class={["gap-0 backdrop-blur-sm text-sm absolute w-[90vw] sm:w-[40vw] z-50",
        prompt.active ? 'block' : 'hidden']}
        style={{
            top: prompt.top,
            left: prompt.left
        }}>
        <div class="flex flex-row gap-2 w-full">
            <div id="ai-prompt" class="px-2.5 py-1 cursor-pointer select-none bg-lime-100 hover:bg-lime-300 
                text-black text-opacity-50 hover:text-opacity-75 transition-colors col-span-3"
                onClick$={async () => {
                    const from = editor?.state.selection.$from
                    const parent = from?.parent;
                    if(!parent || !editor || !from) return
                    const data = parent.textContent;


                    editor.chain().deleteRange({ 
                        from: from.before() + 1,
                        to: from.after() - 1
                    }).insertContentAt(from.before() + 1, `'${data}' prompted`).focus().run()
                    prompt.active = false;

                }}>
                Prompt
            </div>
            <div class="px-2.5 py-1 text-center cursor-pointer select-none
                bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors"
                onClick$={() => prompt.active = false}>
                Cancel
            </div>
        </div>
    </div>
})