import { component$, useStore } from "@builder.io/qwik";
import { DocumentHead, Link } from "@builder.io/qwik-city";
import { LuArrowLeft, LuCalendarPlus, LuFileInput, LuUser } from "@qwikest/icons/lucide";

export default component$(() => {
    const media = useStore({
        description: '',
        date: new Date()
    });

    return <>
        <header class="flex flex-row gap-2 py-4 justify-start w-full">
            <Link class="m-2 p-2 rounded-full bg-black bg-opacity-0 
                cursor-pointer hover:bg-opacity-15" href="/dash/media/">
                <LuArrowLeft/>
            </Link>
            <div>
                <h1 class="font-semibold text-xl">
                    Insert a media
                </h1>
                <p class="font-light text-sm">
                    Media are files that can be distributed fast, at high scale.
                </p>
            </div>
        </header>
        <section class="flex flex-col gap-3">
            <h2 class="font-semibold mt-3">File</h2>
            <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="relative flex flex-col items-center justify-center w-full py-32 border-2 border-black border-opacity-15 border-dashed rounded-lg cursor-pointer bg-black bg-opacity-5 hover:bg-opacity-15">
                    <div class="flex flex-col items-center justify-center">
                        <img id="preview" class="object-contain rounded w-4/5 h-4/5 
                            absolute top-[10%] left-[10%] hidden" />
                        <LuFileInput class="w-4 h-4 text-gray-500" />
                        <p class="text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>
                    <input id="dropzone-file" accept="image/*,audio/*" type="file" class="hidden" onInput$={(_,  t) => {
                        const preview = document.getElementById('preview') as HTMLImageElement;

                        if(!t.files || t.files.length == 0) {
                            preview.style.display = 'none'
                            return
                        }
                        const file = t.files[0];
                        const url = URL.createObjectURL(file);
                        preview.src = url;
                        preview.style.display = 'block';
                    }} />
                </label>
            </div>

            <h2 class="font-semibold mt-3">
                Meta
                <span class="font-light text-xs">, allows to sort and filter media.</span>
            </h2>
            <Link class="border rounded border-collapse border-dashed px-3 py-2 block
                bg-black bg-opacity-0">
                <div class="flex flex-row items-center gap-1 *:w-fit">
                    <h1 class="text-xl">
                        some uuid
                    </h1>
                    <p class="font-light outline-none" contentEditable="true" onInput$={(_, t) => media.description = t.innerText}>
                        A brief description
                    </p>
                </div>
                <div class="flex flex-wrap flex-row gap-2 text-xs font-light">
                    <div class="flex flex-row items-center gap-1"
                        title="Creation date">
                        <LuCalendarPlus/>
                        { 
                            media.date.toLocaleDateString(undefined, {
                                dateStyle: 'short'
                            }) 
                        }
                    </div>
                    <div class="flex flex-row items-center gap-1"
                        title="Uploader">
                        <LuUser/>
                        xxx
                    </div>
                </div>
            </Link>

            <h2 class="font-semibold mt-3">
                Confirmation
                <span class="font-light text-xs">, send to the media storage.</span>
            </h2>
            <div class="flex flex-row items-center gap-3 text-xs font-medium">
                <div class="px-2.5 py-1 w-fit cursor-pointer bg-opacity-15 bg-green-700 hover:bg-opacity-25"
                    onClick$={async () => {
                        const input = document.getElementById('dropzone-file') as HTMLInputElement;
                        if(!input.files || input.files.length == 0 
                            || media.description.length == 0) {
                            return
                        }

                        const form = new FormData()
                        form.set('file', input.files[0]);
                        form.set('description', media.description);
                        const response = await fetch('http://localhost/media', {
                            method: 'POST',
                            credentials: 'include',
                            body: form
                        });

                        console.info(response)
                    }}>
                    Insert
                </div>
                <Link class="px-2.5 py-1 w-fit cursor-pointer bg-opacity-15 bg-red-700 hover:bg-opacity-25"
                    href="/dash/media/">
                    Cancel
                </Link>
            </div>
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