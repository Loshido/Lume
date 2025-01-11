import { component$, PropsOf, QRL, Slot } from "@builder.io/qwik";

interface Props {
    active: boolean,
    exit: QRL
}

export default component$(({ active, exit, class: classList, ...props }: Props & PropsOf<'section'>) => {
    return <dialog open={active} class={active
            ? 'w-screen h-screen absolute top-0 left-0 bg-transparent z-50' 
            : 'hidden'}
            onClick$={async (e, t) => e.target == t.querySelector('section') ? exit() : null}>
        <section {...props} class={["bg-white bg-opacity-50 w-full h-full backdrop-blur-sm",
            "flex flex-col justify-center items-center gap-3", classList ? classList : '']}>
            <Slot/>
        </section>
    </dialog>
})