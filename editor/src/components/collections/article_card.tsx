import { component$, QRL } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuEye, LuEyeOff } from "@qwikest/icons/lucide";

interface Article {
    id: string,
    title: string,
    description: string,
    updatedat: string,
    draft: boolean
}

type Props = {
    article: Article,
    ask_delete?: QRL<(id: string) => void>,
    href?: string,
}

export default component$(({ article, ask_delete, href }: Props) => {
    return <article class="w-full h-full border rounded px-3 py-2">
        <h1 class="text-xl font-semibold">
            {
                article.title
            }
        </h1>
        <p class="text-sm">
            {
                article.description
            }
        </p>
        <div class="flex flex-row gap-1 items-center text-xs font-thin mb-2">

            {
                article.draft
                ? <LuEyeOff/>
                : <LuEye/>
            }

            -

            <p>
                { article.id }
            </p>

            -

            <p>
                Last update { new Date(article.updatedat).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short'
                }) }
            </p>
        </div>
        <div class="flex flex-row items-center text-xs font-medium gap-1">
            <Link class="px-2.5 py-1 w-fit cursor-pointer select-none
                bg-blue-100 hover:bg-blue-300 transition-colors"
                href={href} prefetch={false}>
                Edit
            </Link>
            {
                ask_delete 
                ? <div class="px-2.5 py-1 w-fit cursor-pointer select-none
                    bg-red-100 hover:bg-red-300 transition-colors" 
                        onClick$={() => ask_delete(article.id)}>
                    Delete
                </div>
                : null
            }
        </div>
    </article>
})