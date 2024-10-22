import { redirect } from '@sveltejs/kit';

export const GET = ({ locals }) => {
    locals.pb.authStore.clear();
    locals.user = null;

    throw redirect(303, '/auth/login');
};