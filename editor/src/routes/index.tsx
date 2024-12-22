import { component$, useStore } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

import "./style.css"
export default component$(() => {
    const data = useStore({
        email: "",
        password: ""
    })

    return (
        <div class="text-gray-700 dark:text-white w-screen h-screen flex flex-col md:grid md:grid-cols-2">
            <div class="w-full h-1/4 md:h-full bg-gradient-to-tr md:bg-gradient-to-br from-red-200 to-red-600">
                <div class="w-full h-full wavy bg-white dark:bg-slate-700 bg-opacity-25">
                    <div class="w-full h-full bg-gradient-to-b md:bg-gradient-to-r to-[#fff] dark:to-slate-700 from-[#fff0]"/>
                </div>
            </div>
            <div class="w-full h-full px-12 py-24 md:py-48 md:px-24 dark:bg-slate-700">
                <h1 class="text-5xl font-bold w-fit my-3">
                        {/* bg-gradient-to-tr md:bg-gradient-to-br to-red-200 from-red-600 */}
                    Lume<span class="text-xl font-normal">'s Editor</span>
                </h1>
                <p>
                    Create, edit, manage, and publish content
                </p>

                <form class="py-6 flex flex-col gap-3 dark:text-slate-700" preventdefault:submit={true}
                    onSubmit$={async () => {
                        if(data.email.includes('@') && data.password.length > 6) {
                            // const url = new URL('/auth/login', 'http://')
                            const response = await fetch('http://localhost/auth/login', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    ...data
                                })
                            })

                            const body = await response.text()
                            console.log(response, body)
                        }
                    }}>
                    <input type="email" 
                        onInput$={(_, t) => data.email = t.value} 
                        placeholder="Enter your email"
                        class="p-3 text-xl outline-none border rounded font-medium" 
                        required />
                    <input type="password" 
                        onInput$={(_, t) => data.password = t.value} 
                        placeholder="Enter your password" 
                        required
                        class="p-3 text-xl outline-none border rounded font-medium" />

                    <div class="flex gap-3">
                        <input type="submit" value="Login"
                            class="px-3 py-1.5 rounded text-xl font-semibold bg-[#e5e7eb] cursor-pointer
                                hover:bg-red-600 dark:hover:bg-[#e5e7eb60] hover:bg-opacity-25 transition-colors" />
                    </div>
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
