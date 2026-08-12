/* =========================================================
   AXXOR — NAVIGATION CONTROLLER
   Mobile menu + page transitions + navigation handling
========================================================= */

(function () {
    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuButton =
        document.getElementById("mobile-menu-button");

    const mobileMenu =
        document.getElementById("mobile-menu");

    const transition =
        document.getElementById("page-transition");

    const transitionPanel =
        transition
            ? transition.querySelector(".transition-panel")
            : null;

    const transitionContent =
        transition
            ? transition.querySelector(".transition-content")
            : null;


    /* =====================================================
       STATE
    ===================================================== */

    let menuOpen = false;

    let navigating = false;


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMenu() {

        if (!menuButton || !mobileMenu) {
            return;
        }

        menuOpen = true;

        menuButton.classList.add("is-open");

        mobileMenu.classList.add("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeMenu() {

        if (!menuButton || !mobileMenu) {
            return;
        }

        menuOpen = false;

        menuButton.classList.remove("is-open");

        mobileMenu.classList.remove("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        /*
         * Only restore scrolling if
         * the intro is already finished.
         */

        if (
            !document.body.classList.contains(
                "intro-active"
            )
        ) {
            document.body.style.overflow = "";
        }
    }


    function toggleMenu() {

        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }


    /* =====================================================
       MENU BUTTON
    ===================================================== */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                toggleMenu();

            }
        );

    }


    /* =====================================================
       CLOSE MENU ON OUTSIDE CLICK
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === mobileMenu
                ) {
                    closeMenu();
                }

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                menuOpen
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================================
       PAGE TRANSITION
    ===================================================== */

    function startTransition(
        destination
    ) {

        if (
            navigating ||
            !destination
        ) {
            return;
        }


        navigating = true;


        /*
         * Close mobile menu first.
         */

        closeMenu();


        /*
         * Activate transition layer.
         */

        if (transition) {

            transition.classList.add(
                "is-active"
            );

        }


        /*
         * Give animation time to cover
         * the current page before navigating.
         */

        setTimeout(
            function () {

                window.location.href =
                    destination;

            },
            750
        );

    }


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    const transitionLinks =
        document.querySelectorAll(
            "[data-transition]"
        );


    transitionLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    /*
                     * Ignore empty/hash links.
                     */

                    if (
                        !href ||
                        href === "#" ||
                        href.startsWith(
                            "javascript:"
                        )
                    ) {
                        return;
                    }


                    /*
                     * Ignore modifier clicks.
                     * Allows normal browser behavior
                     * for new tabs.
                     */

                    if (
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey ||
                        event.altKey ||
                        event.button !== 0
                    ) {
                        return;
                    }


                    /*
                     * External URLs should behave
                     * normally.
                     */

                    if (
                        href.startsWith(
                            "http://"
                        ) ||
                        href.startsWith(
                            "https://"
                        ) ||
                        href.startsWith(
                            "mailto:"
                        )
                    ) {
                        return;
                    }


                    event.preventDefault();

                    startTransition(href);

                }
            );

        }
    );


    /* =====================================================
       X / EXTERNAL LINKS
       Prevent transition hijacking.
    ===================================================== */

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    /*
                     * Make sure external links
                     * never trigger page transition.
                     */

                    link.removeAttribute(
                        "data-transition"
                    );

                }
            );

        }
    );


    /* =====================================================
       BACK / FORWARD CACHE HANDLING
    ===================================================== */

    window.addEventListener(
        "pageshow",
        function (event) {

            if (event.persisted) {

                navigating = false;

                if (transition) {

                    transition.classList.remove(
                        "is-active"
                    );

                }

                closeMenu();

            }

        }
    );


    /* =====================================================
       PAGE LOAD TRANSITION
    ===================================================== */

    window.addEventListener(
        "load",
        function () {

            if (!transition) {
                return;
            }


            /*
             * Make sure transition starts hidden.
             */

            transition.classList.remove(
                "is-active"
            );


            /*
             * Small delay gives the browser
             * time to paint the page.
             */

            requestAnimationFrame(
                function () {

                    requestAnimationFrame(
                        function () {

                            transition.classList.remove(
                                "is-active"
                            );

                        }
                    );

                }
            );

        }
    );


    /* =====================================================
       RESIZE SAFETY
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            /*
             * If screen becomes desktop,
             * close mobile navigation.
             */

            if (
                window.innerWidth > 767 &&
                menuOpen
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================================
       PREVENT DOUBLE NAVIGATION
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            navigating = true;

        }
    );


    /* =====================================================
       READY EVENT
    ===================================================== */

    document.dispatchEvent(
        new CustomEvent(
            "axxor:navigation-ready"
        )
    );

})();