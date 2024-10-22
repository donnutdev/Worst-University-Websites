// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type PocketBase, {AuthModel} from "pocketbase";

declare global {
	namespace App {
		interface Locals {
			pb: PocketBase,
			user: AuthModel
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
