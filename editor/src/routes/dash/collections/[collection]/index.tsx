import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
    const loc = useLocation()
    return <>
        title,<br/>
        desc,<br/>
        <hr class="my-4"/>
        edit / delete btns
        <hr class="my-4"/>
        cache ttl / stats
    </>
})