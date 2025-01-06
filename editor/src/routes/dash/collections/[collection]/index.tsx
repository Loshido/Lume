import { component$, useContext, useStore } from "@builder.io/qwik";
import { collectionCtx } from "./layout";
import { LuDisc3, LuLibrarySquare } from "@qwikest/icons/lucide";
import { useNavigate } from "@builder.io/qwik-city";


export default component$(() => {
    const nav = useNavigate()
    const collection = useContext(collectionCtx);
    const edit = useStore({
        active: false,
        id: '',
        name: '',
        description: '',
        delete_confirmation: false
    })

    if(!collection.value) return <div class="w-full h-full flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <>
        <div class="flex flex-row items-center gap-3 px-4">
            <LuLibrarySquare class="w-12 h-12"/>
            <div>
                <h1 class="font-semibold text-3xl">
                    <span id="name"  class="outline-none"
                        contentEditable={edit.active ? 'true' : 'false'}>
                        {
                            collection.value.name
                        }
                    </span> <span class="text-sm text-black text-opacity-25">
                        (<span id="id" class="outline-none"
                            contentEditable={edit.active ? 'true' : 'false'}>
                            {
                                collection.value.id
                            }
                        </span>)
                    </span>
                </h1>
                <p class="font-light text-black text-opacity-50 outline-none" id="description" 
                    contentEditable={edit.active ? 'true' : 'false'}>
                    {
                        collection.value.description
                    }
                </p>
            </div>
        </div>
        <hr class="my-5"/>
        <div class="flex flex-row items-center gap-3 px-4">
            {
                edit.active
                ? <>
                    <div class="text-sm px-2 py-0.5 rounded cursor-pointer select-none
                        bg-green-100 hover:bg-green-300 transition-colors"
                        onClick$={async () => {
                            const id = document.getElementById('id')!;
                            const desc = document.getElementById('description')!;
                            const name = document.getElementById('name')!;

                            const data: {
                                [key in 'id' | 'description' | 'name']?: string
                            } = {}
                            if(id.innerText.length > 0) 
                                data.id = id.innerText;
                            if(desc.innerText.length > 0) 
                                data.description = desc.innerText;
                            if(name.innerText.length > 0) 
                                data.name = name.innerText;
                            
                            const url = `http://localhost/collections/${collection.value!.id}`;
                            const response = await fetch(url, {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            });
                            
                            if(response.status == 200) {
                                if(desc.innerText.length > 0) 
                                    collection.value!.description = desc.innerText;
                                if(name.innerText.length > 0) 
                                    collection.value!.name = name.innerText;
                                if(id.innerText.length > 0) {
                                    collection.value!.id = id.innerText
                                    nav(`/dash/collections/${collection.value!.id}/`)
                                };
                            }

                            console.trace(await response.json())
                        }}>
                        Save
                    </div>
                    <div class="text-sm px-2 py-0.5 rounded cursor-pointer select-none
                        bg-red-100 hover:bg-red-300 transition-colors"
                        onClick$={() => {
                            const id = document.getElementById('id')!;
                            const desc = document.getElementById('description')!;
                            const name = document.getElementById('name')!;

                            id.innerText = collection.value!.id;
                            desc.innerText = collection.value!.description;
                            name.innerText = collection.value!.name;
                            edit.active = false
                        }}>
                        Cancel
                    </div>
                </>
                : <>
                    <div class="text-sm px-2 py-0.5 rounded cursor-pointer select-none
                        bg-blue-100 hover:bg-blue-300 transition-colors"
                        onClick$={() => edit.active = true}>
                        Edit
                    </div>
                    <div class="text-sm px-2 py-0.5 rounded cursor-pointer select-none
                        bg-red-100 hover:bg-red-300 transition-colors"
                        onClick$={() => edit.delete_confirmation = true}>
                        Delete
                    </div>
                </>
            }
            <dialog open={edit.delete_confirmation} class={edit.delete_confirmation 
                    ? 'w-screen h-screen absolute top-0 left-0 bg-transparent' 
                    : 'hidden'}
                    onClick$={(e, t) => e.target == t.querySelector('section') ? edit.delete_confirmation = false : null}>
                <section class="bg-white bg-opacity-50 w-full h-full backdrop-blur-sm
                    flex flex-col justify-center items-center gap-3">
                    <p class="w-2/3 text-center">
                        Are you sure you want to permanently remove this collection ?
                    </p>
                    <div class="flex flex-row items-center gap-3">
                        <div class="text-sm px-2 py-0.5 rounded cursor-pointer select-none
                            bg-red-100 hover:bg-red-300 transition-colors"
                            onClick$={async () => {
                                const url = `http://localhost/collections/${collection.value!.id}`
                                const response = await fetch(url, {
                                    method: 'DELETE',
                                    credentials: 'include'
                                })

                                if(response.status == 200) {
                                    nav('/dash/collections');
                                } else {
                                    console.error(response)
                                }
                            }}>
                            Yes
                        </div>
                        <div class="text-sm px-2 py-0.5 rounded cursor-pointer select-none
                            bg-blue-100 hover:bg-blue-300 transition-colors"
                            onClick$={() => edit.delete_confirmation = false}>
                            No, Cancel
                        </div>
                    </div>
                </section>
            </dialog>
        </div>

        {/* cache ttl / stats */}
    </>
})