import { redirect } from '@sveltejs/kit';

export const GET = ({ locals, params }) => {
    const token = params.token
    locals.pb.collection('users').confirmVerification(token)

    return redirect(303, '/rate')
};