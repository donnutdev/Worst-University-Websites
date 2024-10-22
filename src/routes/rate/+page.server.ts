import type {LayoutServerLoad} from "../../../.svelte-kit/types/src/routes/$types";
import {message, setError, superValidate} from "sveltekit-superforms";
import {joi} from "sveltekit-superforms/adapters";
import {ratingSchema} from "$lib/schemas";
import {fail, redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = async () => {
    const form = await superValidate(joi(ratingSchema))
    return {form}
}

export const actions = {
    default: async ({locals, request}) => {
        const form = await superValidate(request, joi(ratingSchema))

        console.log(form.data)

        const record_check = await locals.pb.collection('ratings').getFullList({
            filter: `user="${locals.user?.id}" && university="${form.data.university}"`,
        })

        if (record_check.length > 0) {
            return setError(form, 'university', 'You have already rated this university. You can go to your ratings page and delete it before adding a new one.')
        }

        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            await locals.pb.collection('ratings').create({
                user: locals.user?.id,
                ...form.data
            })
        }catch (e) {
            return message(form, e.data.data)
        }

        console.log(form.university)

        return redirect(303, `/university/${form.data.university}`)
    }
}
