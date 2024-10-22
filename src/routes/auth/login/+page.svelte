<script>
    import {superForm} from "sveltekit-superforms";

    export let data;

    const {form, errors, message} = superForm(data.form)

    $: console.log($message)
</script>

<div class="sm:container sm:mx-auto mx-5 mt-5 flex flex-col justify-center gap-5">
    <h1 class="text-xl w-full mx-auto text-center sm:text-3xl">Log into an account</h1>
    <div class="bg-base-100 border w-full max-w-lg rounded-box p-8 mx-auto">
        <form class="w-full mx-auto" method="POST">
            <div class="flex flex-col gap-5 w-full">
                <div class="flex flex-col gap-2">
                    <label for="email">Email</label>
                    <input type="email" name="email" placeholder="something@example.com" class="input input-bordered w-full" bind:value={$form.email} />
                    {#if $errors.email}
                        <p class="text-xs text-red-600">{$errors.email}</p>
                    {/if}
                    {#if $message?.email}
                        <p class="text-xs text-red-600">{$message.email.message}</p>
                    {/if}
                </div>
                <div class="flex flex-col gap-2">
                    <label for="password">Password</label>
                    <input type="password" name="password" placeholder="password" class="input input-bordered w-full" bind:value={$form.password} />
                    {#if $errors.password}
                        <p class="text-xs text-red-600">{$errors.password}</p>
                    {/if}
                    {#if $message?.password}
                        <p class="text-xs text-red-600">{$message.password.message}</p>
                    {/if}
                </div>
                <p class="text-sm">Don't have an account? <a href="/auth/signup" class="link">Sign up</a></p>
                <div class="flex gap-2 justify-center">
                    <button type="submit" class="btn btn-primary">Log In</button>
                </div>
            </div>
        </form>
    </div>
</div>