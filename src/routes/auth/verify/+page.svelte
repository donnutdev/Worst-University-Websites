<script lang="ts">
    import {enhance} from "$app/forms";
    import {invalidateAll} from "$app/navigation";
    import {page} from "$app/stores";

    export let data;

    let {last_email} = data;
    let sending = false;

    $: (last_email = data.last_email);

    $: lastEmailDate = new Date(last_email.updated).getTime();
    $: countDownDate = new Date(lastEmailDate + 120000).getTime();
    let now = new Date().getTime();
    $: timeleft = countDownDate - now;
    $: seconds = Math.floor(timeleft / 1000);

    let i = setInterval(() => {
        now = new Date().getTime();
    }, 1000);

    $: if (seconds <= 0) {
        seconds = 0;
    }

    const onSubmit = () => {
        sending = true
        return ({result, update}) => {
            if (result.type === 'success') {
                invalidateAll();
            }else {
                update()
                sending = false
            }
        }
    }

</script>

<div class="sm:container sm:mx-auto mx-5 mt-5 flex flex-col justify-center gap-5">
    <h1 class="text-xl w-full mx-auto text-center sm:text-3xl">Verify your email</h1>
    <div class="bg-base-100 border w-full max-w-lg rounded-box p-6 mx-auto text-center">
        <p>Check your inbox and open the verification link.</p>
        <p>If you don't see the verification email, check your spam folder?</p>
        <p>If you still haven't received the verification link, click the button below.</p>
        <form class="w-full lg:w-3/4 mx-auto my-5" method="POST" use:enhance={onSubmit}>
            <div class="flex gap-2 justify-center">
                <button type="submit" class="btn btn-primary" disabled={seconds > 0 || sending === true}>Resend Verification Email</button>
            </div>
            <span>{seconds}</span>
        </form>
    </div>
</div>