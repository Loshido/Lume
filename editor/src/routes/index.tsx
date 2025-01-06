import { component$, useSignal, useStore } from "@builder.io/qwik";
import { useNavigate, type DocumentHead } from "@builder.io/qwik-city";

import "./style.css"
export default component$(() => {
    const nav = useNavigate()
    const data = useStore({
        email: "",
        password: ""
    })
    const error = useSignal('');

    return (
        <div class="text-gray-700 w-screen h-screen flex flex-col md:grid md:grid-cols-2">
            <div class="w-full h-1/4 md:h-full bg-gradient-to-tr md:bg-gradient-to-br from-red-200 to-red-600">
                <div class="w-full h-full wavy bg-white bg-opacity-25">
                    <div class="w-full h-full bg-gradient-to-b md:bg-gradient-to-r to-[#fff] from-[#fff0]"/>
                </div>
            </div>
            <div class="w-full h-full px-12 py-24 md:py-48 md:px-24">
                <h1 class="text-2xl font-bold w-fit my-2">
                    Lume<span class="text-base font-normal">'s Editor</span>
                </h1>
                <p class="text-sm">
                    Create, edit, manage, and publish content
                </p>

                <form class="py-4 flex flex-col gap-3" preventdefault:submit={true}
                    onSubmit$={async () => {
                        if(data.email.includes('@') && data.password.length > 6) {
                            const response = await fetch('http://localhost/auth/login', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    ...data
                                })
                            })

                            if(response.status === 200) {
                                localStorage.setItem('jwt', await response.text())
                                nav('/dash')
                            } else {
                                error.value = response.status + ' - ' + response.statusText;
                            }
                        }
                    }}>
                    <input type="email" 
                        onInput$={(_, t) => data.email = t.value} 
                        placeholder="Enter your email"
                        class="px-2 py-1.5 text-lg outline-none border rounded" 
                        required />
                    <input type="password" 
                        onInput$={(_, t) => data.password = t.value} 
                        placeholder="Enter your password" 
                        required
                        class="px-2 py-1.5 text-lg outline-none border rounded" />

                    <div class="flex gap-3">
                        <input type="submit" value="Access"
                            class="px-2 py-1 rounded text-lg font-semibold bg-[#e5e7eb] cursor-pointer
                                hover:bg-red-600 hover:bg-opacity-25 transition-colors" />

                    </div>
                    <p>
                        {
                            error.value
                        }
                    </p>
                </form>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Lume - Editor",
    meta: [
        {
            name: "description",
            content: "Lume's editor",
        },
    ],
};
