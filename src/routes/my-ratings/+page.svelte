<script>
    import {enhance} from "$app/forms";
    import {page} from "$app/stores";
    import {invalidateAll} from "$app/navigation";

    export let data;

    let {ratings} = data;

    let deleting = ""

    $: (ratings = data.ratings);

    console.log(ratings)

    const onDelete = (id) => {
        deleting = id
        return ({result, update}) => {
            deleting = ""
            if (result.type === 'success') {
                invalidateAll()
            }else {
                update()
            }
        }
    }
</script>

<div class="sm:container sm:mx-auto mx-5 mt-5 mb-20 flex flex-col justify-center gap-5">
    <h1 class="text-xl w-full mx-auto text-center sm:text-3xl">My Ratings</h1>
    <div class="divider"></div>
    {#await ratings}
        <div class="flex justify-center items-center mt-10">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    {:then ratings}
        <div class="flex flex-col gap-5 w-full max-w-3xl mx-auto">
            {#each ratings as rating}
                <div class="bg-base-100 border rounded-box p-6 mx-auto w-full">
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2 place-items-center justify-between w-full">
                            <p class="font-bold sm:text-xl">{rating.expand.university.name}</p>
                            <p class="text-xs">{(new Date(rating.created)).toLocaleString()}</p>
                        </div>
                        <div>
                            <span class="font-bold text-sm sm:text-base">Rating Given: {rating.rating}/100</span>
                        </div>
                        <div class=" text-sm sm:text-base">
                            {@html rating.comment}
                        </div>
                    </div>
                    <form method="POST" action="?/delete" use:enhance={() => onDelete(rating.id)}>
                        <input type="hidden" name="rating_id" value={rating.id}/>
                        <button class="btn btn-error btn-sm mt-2">Delete Rating</button>
                    </form>
                </div>
            {/each}
        </div>
    {:catch error}
        <div class="text-center text-red-500">Error: {error.message}</div>
    {/await}
</div>