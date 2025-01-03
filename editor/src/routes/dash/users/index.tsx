import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

// user:
// id
// email
// name

export default component$(() => {
    return <>
        Users
    </>
})

export const head: DocumentHead = {
    title: "Lume - Users",
    meta: [
        {
            name: "description",
            content: "Lume's editor",
        },
    ],
    frontmatter: {
        dash: true
    }
};
