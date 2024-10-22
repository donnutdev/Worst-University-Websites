import type {LayoutServerLoad} from "../../../../.svelte-kit/types/src/routes/$types";
import {redirect} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({locals}) => {
    const last_email = await locals.pb.collection("verification_emails").getFirstListItem(`user="${locals.user?.id}"`)
    if (locals.user == null || locals.user?.verified) {
        return redirect(303, '/')
    }
    return {
        last_email
    }
}

export const actions = {
    default: async ({locals}) => {
        let now = new Date().toISOString()
        await locals.pb.collection('users').requestVerification(locals.user?.email)
        const last_email = await locals.pb.collection("verification_emails").getFirstListItem(`user="${locals.user?.id}"`)
        let new_last_email = await locals.pb.collection('verification_emails').update(last_email.id, {
            updated: now
        })
        return {
            last_email: new_last_email
        }
    }
}