import { component$, QRL, Slot } from "@builder.io/qwik"
import Dialog from "./index"

interface Confirmation {
    active: boolean
    yes: {
        text?: string,
        style?: string,
        fn: QRL<() => void>
    },
    no: {
        text?: string,
        style?: string
        fn: QRL<() => void>
    },
    cancel: QRL<() => void>,
    text?: string
}

export default component$((props: Confirmation) => {
    return <Dialog active={props.active} exit={props.cancel}>
        <p class="w-2/3 text-center">
            {
                props.text
            }
            <Slot/>
        </p>
        <div class="flex flex-row items-center gap-3 text-xs font-medium">
            <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                bg-red-100 hover:bg-red-300 transition-colors"
                onClick$={props.yes.fn} style={props.yes.style}>
                {
                    props.yes.text || 'Yes'
                }
            </div>
            <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                bg-blue-100 hover:bg-blue-300 transition-colors"
                onClick$={props.no.fn} style={props.no.style}>
                {
                    props.no.text || 'No, Cancel'
                }
            </div>
        </div>
    </Dialog>
})