import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { DocumentHead, Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft, LuDisc3 } from "@qwikest/icons/lucide";

export default component$(() => {
    const loc = useLocation();
    const nav = useNavigate()
    const media = useSignal<{
        id: string,
        description: string,
        origin: string,
        createdat: Date
    }>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
        const response = await fetch(`http://localhost/media?id=${loc.params.id}`);
        if(response.status == 200) {
            const data = await response.json();
            media.value = {
                ...data[0],
                createdat: new Date(data[0].createdat)
            }
            console.log(media.value)
        } else {
            console.error(response)
            nav('/dash/media');
        };
    })

    if(!media.value) return <div class="w-full h-full flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <>
        <header class="flex flex-row gap-2 py-4 justify-start w-full">
            <Link class="m-2 p-2 rounded-full bg-black bg-opacity-0 
                cursor-pointer hover:bg-opacity-15" href="/dash/media/">
                <LuArrowLeft/>
            </Link>
            <div>
                <h1 class="font-semibold text-xl">
                    { media.value.id }
                </h1>
                <p class="font-light text-sm">
                    { media.value.description } <span class="text-black text-opacity-25">
                        - {
                            media.value.createdat.toLocaleString(undefined, {
                                dateStyle: 'short',
                                timeStyle: 'short'
                            })
                        }
                    </span>
                </p>
            </div>
        </header>
        <section class="flex flex-col gap-3 px-5 md:px-16 lg:px-48 xl:px-64">
            <h2 class="font-semibold mt-3">File</h2>
            <img src={`http://localhost/media/${media.value.id}`} class="w-full object-contain rounded p-5" width={1000} height={500} alt={media.value.id} />
        </section>
    </>
})


export const head: DocumentHead = {
    title: "Lume - Media",
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