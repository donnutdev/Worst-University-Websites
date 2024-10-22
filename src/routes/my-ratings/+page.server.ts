import type {LayoutServerLoad} from "../../../.svelte-kit/types/src/routes/$types";
import {error} from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({locals}) => {
    if (!locals.user) {
        return {
            status: 303,
            redirect: '/auth/login'
        }
    }

    const results = await locals.pb.collection('ratings').getFullList({
        filter: `user="${locals.user.id}"`,
        sort: '-created',
        expand: ['university']
    })

    return {
        ratings: results
    }
}

export const actions = {
    delete: async ({locals, request}) => {
        const body = Object.fromEntries(await request.formData())

        try {
            await locals.pb.collection('ratings').delete(body.rating_id)
        }catch (e) {
            console.log(e)
            throw error(500, 'Failed to delete rating')
        }

        return
    }
}