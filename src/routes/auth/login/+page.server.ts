import {error, fail, redirect} from "@sveltejs/kit";
import {superValidate, message} from "sveltekit-superforms";
import {joi} from "sveltekit-superforms/adapters";
import {loginSchema} from "$lib/schemas";
import type {LayoutServerLoad} from "../../../../.svelte-kit/types/src/routes/$types";

export const load: LayoutServerLoad = async () => {
    const form = await superValidate(joi(loginSchema))
    return {form}
}

export const actions = {
    default: async ({locals, request}) => {
        const form = await superValidate(request, joi(loginSchema))

        try {
            await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password)
            if (!locals.pb?.authStore?.model?.verified) {
                return redirect(303, '/auth/verify')
            }
        }catch (e) {
            console.log(e)
            return message(form, e.data?.data)
        }

        redirect(303, '/rate')
    }
}