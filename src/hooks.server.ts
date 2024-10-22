import PocketBase from 'pocketbase';
import {type Handle, redirect} from '@sveltejs/kit'
import {serializeNonPrimitive} from "$lib/utils";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public"
import {sequence} from "@sveltejs/kit/hooks";

const authentication: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL)
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
    if (event.locals.pb.authStore.isValid) {
        await event.locals.pb.collection('users').authRefresh()
        event.locals.user = serializeNonPrimitive(event.locals.pb.authStore.model)
    }else {
        event.locals.user = null
    }

    const response = await resolve(event)

    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({
        secure: false
    }))

    return response
}

const authorization: Handle = async ({ event, resolve }) => {
    const protected_routes = ['/rate', '/panel', '/my-ratings']

    if (event.locals.user === null && protected_routes.filter(route => event.url.pathname.startsWith(route)).length > 0) {
        return redirect(303, '/auth/login')
    } else if (!event.locals.user?.verified && protected_routes.filter(route => event.url.pathname.startsWith(route)).length > 0) {
        return redirect(303, '/auth/verify')
    } else if (event.locals.user) {
        if (event.locals.user.verified && event.url.pathname.startsWith("/auth/verify")) {
            return redirect(303, '/rate')
        }
        if (event.locals.user && (event.url.pathname.startsWith("/auth/login") || event.url.pathname.startsWith("/auth/signup"))) {
            return redirect(303, '/rate')
        }
    }

    return resolve(event)
}

export const handle = sequence(authentication, authorization)