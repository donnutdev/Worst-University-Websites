<script>
    import "../app.css";
    import MdiInformationOutline from "~icons/mdi/information-outline"
    import MdiHamburger from "~icons/mdi/hamburger"

    export let data;
</script>
<div class="navbar bg-base-100">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <MdiHamburger class="w-6 h-6"/>
            </div>
            <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li><a href="/">The List</a></li>
                <li><a href="/rate">Submit a Rating</a></li>
                <li><a href="/my-ratings">My Ratings</a></li>
                <li><a href="/info">About</a></li>
                {#if data.user !== null}
                    <li><p>{data.user.email}</p></li>
                    <li><a href="/auth/logout">Logout</a></li>
                {:else}
                    <li><a href="/auth/login">Login</a></li>
                {/if}
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <a class="btn btn-ghost text-wrap text-xs sm:text-xl" href="/">Worst University<br class="sm:hidden"/> Websites</a>
    </div>
    <div class="navbar-end">
        <a class="btn btn-ghost btn-circle" href="/info">
            <MdiInformationOutline class="w-6 h-6"/>
        </a>
    </div>
</div>
<slot></slot>