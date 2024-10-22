<script lang="ts">
    import {superForm} from "sveltekit-superforms";
    import {MetaTags} from "svelte-meta-tags";

    export let data;

    const {form, errors, message} = superForm(data.form)

    let {pb} = data;

    let name = '';

    async function getAutoComplete(name: string) {
        const results = await pb.collection('universities').getFullList({
            filter: `name ~ '%${name}%'`,
        })
        return results
    }

    $: console.log($message)
</script>

<MetaTags
        title="Add a Rating"
        description="Rate a university's website which you think is bad so it is on the list."
        canonical="https://worstuniversitywebsites.com/rate"
        openGraph={{
            title: "Add a Rating",
            description: `Rate a university's website which you think is bad so it is on the list.`,
            url: "https://worstuniversitywebsites.com/rate",
            siteName: "Worst University Websites",
        }}
/>

<div class="sm:container sm:mx-auto mx-5 mt-5 my-20 flex flex-col justify-center gap-5">
    <h1 class="text-xl w-full mx-auto text-center sm:text-3xl">Submit your own university website rating</h1>
    <form class="w-full lg:w-3/4 mx-auto" method="POST">
        <div class="flex flex-col gap-5 w-full">
            <div class="flex flex-col gap-2">
                <label for="university_name">University Name</label>
                <input type="text" placeholder="University Of ..." bind:value={name} class="input input-bordered w-full" />
            </div>
            <div class="flex flex-col gap-1 max-h-64 overflow-y-auto">
                    {#await getAutoComplete(name)}
                        <div class="flex justify-center items-center">
                            <span class="loading loading-spinner loading-lg"></span>
                        </div>
                    {:then universities}
                        {#each universities.slice(0, 1000) as university}
                            <label class="label cursor-pointer border rounded-md px-3">
                                <span class="label-text">{university.name}</span>
                                <input type="radio" required="required" name="university" value={university.id} class="radio" bind:group={$form.university} />
                            </label>
                        {/each}
                    {:catch error}
                        <div class="text-center text-red-500">Error: {error.message}</div>
                    {/await}
            </div>
            {#if $errors.university}
                <p class="text-xs text-red-600">{$errors.university}</p>
            {/if}
            <div class="flex flex-col gap-2">
                <label for="rating">Website Rating</label>
                <input name="rating" type="range" min="0" max="100" class="range" step="5" bind:value={$form.rating}/>
                <div class="flex w-full justify-between px-2 text-xs">
                    <span>Decent</span>
                    <span>Bad</span>
                    <span>Terrible</span>
                </div>
                {#if $errors.rating}
                    <p class="text-xs text-red-600">{$errors.rating}</p>
                {/if}
            </div>
            <div class="flex flex-col gap-2">
                <label for="comment">Comment</label>
                <textarea name="comment" placeholder="Add what you think are the bad/good elements of the chosen university's website and your frustrations if you have any. Spill your heart out!" class="input input-primary h-32" bind:value={$form.comment}></textarea>
                {#if $errors.comment}
                    <p class="text-xs text-red-600">{$errors.comment}</p>
                {/if}
            </div>
            <div class="flex gap-2 justify-center">
                <button type="submit" class="btn btn-primary">Submit Rating</button>
            </div>
        </div>
    </form>
</div>