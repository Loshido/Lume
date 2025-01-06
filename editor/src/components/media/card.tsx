import { component$ } from "@builder.io/qwik"
import { Link, LinkProps } from "@builder.io/qwik-city"
import { LuCalendarPlus, LuUser } from "@qwikest/icons/lucide"

interface Media {
    id: string,
    origin: string,
    description: string,
    createdat: Date
}

type Props = {
    media: Media
} & LinkProps

export default component$(({ media, ...props }: Props) => {
    return <Link {...props} class="border-y border-collapse border-dashed px-3 py-2 block
        bg-black bg-opacity-0 hover:bg-opacity-5 hover:border-solid
        transition-colors duration-500 cursor-pointer"
        href={`/dash/media/${media.id}/`}>
        <div class="flex flex-row items-center gap-1 *:w-fit">
            <h1 class="text-xl">
                { media.id }
            </h1>
            <p class="font-light">
                { media.description }
            </p>
        </div>
        <div class="flex flex-wrap flex-row gap-2 text-xs font-light">
            <div class="flex flex-row items-center gap-1"
                title="Creation date">
                <LuCalendarPlus/>
                { 
                    media.createdat.toLocaleDateString(undefined, {
                        dateStyle: 'short'
                    }) 
                }
            </div>
            <div class="flex flex-row items-center gap-1"
                title="Uploader">
                <LuUser/>
                { 
                    media.origin
                }
            </div>
        </div>
    </Link>
})