import {fail, redirect} from "@sveltejs/kit";
import {superValidate, message} from "sveltekit-superforms";
import {joi} from "sveltekit-superforms/adapters";
import {signupSchema} from "$lib/schemas";
import type {LayoutServerLoad} from "../../../../.svelte-kit/types/src/routes/$types";

export const load: LayoutServerLoad = async () => {
    const form = await superValidate(joi(signupSchema))
    return {form}
}

export const actions = {
    default: async ({locals, request}) => {
        const form = await superValidate(request, joi(signupSchema))

        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            const newUserRecord = await locals.pb.collection('users').create(form.data)
            await locals.pb.collection('users').requestVerification(form.data.email)
            await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password)
            await locals.pb.collection('verification_emails').create({
                user: newUserRecord.id
            })
        }catch (e) {
            console.log(e.data)
            return message(form, e.data?.data)
        }

        return redirect(303, '/auth/verify')
    }
}