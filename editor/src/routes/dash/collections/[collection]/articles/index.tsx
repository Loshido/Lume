import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { LuDisc3 } from "@qwikest/icons/lucide";

import ArticleCard from "~/components/collections/article_card";

export default component$(() => {
    const loc = useLocation()

    if(!false) return <div class="w-full h-full flex flex-row gap-2 items-center justify-center">
        <LuDisc3 class="animate-spin"/>
        Loading
    </div>

    return <div class="grid grid-cols-3 gap-3">
        <ArticleCard article={{
            id: 'someid',
            title: 'Some super title that can be long',
            createdat: new Date(),
            updatedat: new Date(),
            draft: true
        }}/>
        <ArticleCard article={{
            id: 'someid',
            title: 'Some super title that can be long',
            createdat: new Date(),
            updatedat: new Date(),
            draft: false
        }}/>
        <ArticleCard article={{
            id: 'someid',
            title: 'Some super title that can be long',
            createdat: new Date(),
            updatedat: new Date(),
            draft: false,
        }} href={`/dash/collections/${loc.params.collection}/someid`}/>
    </div>
})