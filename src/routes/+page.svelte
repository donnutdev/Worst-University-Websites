<script>
    import MdiArrowRight from "~icons/mdi/arrow-right"
    import {goto} from "$app/navigation";
    import {MetaTags} from "svelte-meta-tags";

    export let data;

    let {pb} = data;

    let page = 1;

    const webPageRegex = /(https|http):\/\/(.*)\//

    async function getUniversities() {
        let results = await pb.collection('university_average').getFullList({
            sort: '-average_rating',
        })
        // sort by average_rating and total_ratings
        results = results.sort((a, b) => {
            if (a.average_rating === b.average_rating) {
                return b.total_ratings - a.total_ratings
            }
            return b.average_rating - a.average_rating
        })
        return results
    }

    const list = getUniversities()
</script>

<MetaTags
        title="Worst University Websites"
        description="This is a list of universities with the WORST websites."
        canonical="https://worstuniversitywebsites.com/"
        openGraph={{
            title: "The List",
            description: `This is a list of universities with the WORST websites.`,
            url: "https://worstuniversitywebsites.com/",
            siteName: "Worst University Websites",
        }}
/>

<div class="sm:container sm:mx-auto mx-5 mt-5 mb-20 flex flex-col justify-center gap-5">
    <h1 class="text-xl w-full mx-auto text-center sm:text-3xl">Welcome to the list of universities with the <strong>worst websites!</strong></h1>
    <div class="inline-flex gap-2 justify-center">
        <a class="btn btn-sm btn-primary" href="/rate">Submit your own university rating<MdiArrowRight/></a>
    </div>
    <div class="divider"></div>
    {#await list}
        <div class="flex justify-center items-center mt-10">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:then universities}
        <table class="table-sm sm:table mx-auto">
            <caption>Higher rating = worse website</caption>
            <!-- head -->
            <thead>
            <tr>
                <th class="hidden sm:block"></th>
                <th>Name</th>
                <th>Rating</th>
                <th>Sites</th>
            </tr>
            </thead>
            <tbody>

            {#each universities as university, index (university.id)}
                <tr class="hover">
                    <th class="hidden sm:block">#{index+1}</th>
                    <td role="button" on:click={() => goto(`/university/${university.id}`)}>{university.university_name}</td>
                    <td>{university.average_rating}/100 ({university.total_ratings})</td>
                    <td class="inline-flex flex-wrap gap-1">
                        {#each university.web_pages as web_page (web_page)}
                            <a href={web_page} target="_blank" class="link">{webPageRegex.exec(web_page)["2"]}</a>
                        {/each}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    {:catch error}
        <div class="text-center text-red-500">Error: {error.message}</div>
    {/await}
</div>
