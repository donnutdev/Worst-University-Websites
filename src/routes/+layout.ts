import type {LayoutLoad} from './$types'
import PocketBase from "pocketbase";
import {PUBLIC_POCKETBASE_URL} from "$env/static/public";

export const load: LayoutLoad = async ({ fetch, data }) => {
    const pb = new PocketBase(PUBLIC_POCKETBASE_URL)

    return {
        pb,
        user: data.user,
    }
}