<script>
    import {page} from "$app/stores";

    export let data;

    let {pb} = data;

    async function getUniversityData() {
        const results = await pb.collection('university_average').getFullList({
            sort: 'average_rating',
        })
        let university = results.find((item) => item.id === $page.params.id)
        if (!university) {
            throw new Error('University not found')
        }
        university.overall_rank = results.findIndex((item) => item.id === $page.params.id) + 1
        console.log(results)
        return university
    }

    let universityData = getUniversityData()

    async function getUniversityComments() {
        const results = await pb.collection('ratings_public').getFullList({
            filter: `university="${$page.params.id}"`,
            sort: '-created'
        })
        console.log(results)
        return results
    }

    let comments = getUniversityComments()
</script>

<div class="sm:container sm:mx-auto mx-5 mt-20 flex flex-col justify-center gap-5">
    {#await universityData}
            <div class="flex justify-center items-center mt-10">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
    {:then university}
        {#if university.img_url}
            <div class="mx-auto">
                <img src={university.img_url} alt={university.university_name} class="w-60 rounded-lg shadow-lg" />
            </div>
        {/if}
        <h1 class="text-xl w-full mx-auto text-center sm:text-5xl">
            {university.university_name}
        </h1>
        <div class="stats stats-vertical sm:stats-horizontal shadow max-w-2xl mx-auto">
            <div class="stat">
                <div class="stat-title">Total Ratings</div>
                <div class="stat-value">{university.total_ratings}</div>
            </div>
            <div class="stat">
                <div class="stat-title">Average Rating</div>
                <div class="stat-value">{university.average_rating}/100</div>
            </div>
            <div class="stat">
                <div class="stat-title">Overall Rank</div>
                <div class="stat-value">#{university.overall_rank}</div>
            </div>
        </div>
    {:catch error}
        <div class="text-center text-red-500">Error: {error.message}</div>
    {/await}
    <div class="divider"></div>
    {#await comments}
        <div class="flex justify-center items-center mt-10">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:then ratings}
        <div class="flex flex-col gap-5 w-full max-w-3xl mx-auto">
            {#each ratings as rating}
                <div class="bg-base-100 border rounded-box p-6 mx-auto">
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between">
                            <div class="flex gap-2 place-items-center justify-between w-full">
                                <span class="font-bold">Rating Given: {rating.rating}/100</span>
                                <span class="text-xs">{(new Date(rating.created)).toLocaleString()}</span>
                            </div>
                        </div>
                        {@html rating.comment}
                    </div>
                </div>
            {/each}
        </div>
    {:catch error}
        <div class="text-center text-red-500">Error: {error.message}</div>
    {/await}
</div>