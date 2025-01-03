import { component$ } from "@builder.io/qwik";
import { Link, type LinkProps } from "@builder.io/qwik-city";
import { LuCalendarPlus, LuListOrdered } from "@qwikest/icons/lucide";

interface Collection {
    id: string,
    name: string,
    description: string,
    articles: number,
    date: Date
}

type Props = {
    collection: Collection
} & LinkProps

export default component$(({ collection }: Props) => {
    return <Link class="border-2 border-dashed px-4 py-3 rounded block
        bg-black bg-opacity-0 hover:bg-opacity-5 hover:border-solid
        transition-colors duration-500 cursor-pointer"
        href={`/dash/collections/${collection.id}/`}>
        <h1 class="text-xl">
            { collection.name }
        </h1>
        <p class="font-light">
            { collection.description }
        </p>
        <div class="flex flex-wrap flex-row gap-2 text-xs font-light">
            <div class="flex flex-row items-center gap-1"
                title="Creation date">
                <LuCalendarPlus/>
                { 
                    collection.date.toLocaleDateString(undefined, {
                        dateStyle: 'short'
                    }) 
                }
            </div>
            <div class="flex flex-row items-center gap-1"
                title="Number of article">
                <LuListOrdered/>
                { 
                    collection.articles
                }
            </div>
        </div>
    </Link>
})