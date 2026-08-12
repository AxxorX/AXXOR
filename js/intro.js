/* =========================================================
   AXXOR — INTRO CONTROLLER
   DON'T SCROLL → PFP → IDENTITY → HUB

   FINAL FIXED VERSION
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const intro =
        document.getElementById("intro");

    const screen =
        document.getElementById("intro-screen");

    const site =
        document.getElementById("site");

    const hero =
        document.querySelector(".home-intro-content");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!intro || !screen || !site) {
        return;
    }


    /* =====================================================
       SETTINGS
    ===================================================== */

    const MAX_STEP = 3;

    let step = 0;

    let locked = true;

    let isAnimating = false;

    let hasCompleted = false;

    let touchStartY = 0;

    let touchStartX = 0;

    let lastWheelTime = 0;


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    site.setAttribute(
        "aria-hidden",
        "true"
    );

    intro.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "intro-active"
    );

    screen.classList.remove(
        "is-revealing",
        "is-identity",
        "is-exiting",
        "is-complete"
    );


    /* =====================================================
       SCROLL LOCK
    ===================================================== */

    function lockScroll() {

        document.documentElement.style.overflow =
            "hidden";

        document.body.style.overflow =
            "hidden";

        document.body.style.touchAction =
            "none";
    }


    function unlockScroll() {

        document.documentElement.style.overflow =
            "";

        document.body.style.overflow =
            "";

        document.body.style.touchAction =
            "";
    }


    lockScroll();


    /* =====================================================
       SHOW HOMEPAGE
    ===================================================== */

    function showHomepage() {

        /*
         * Make the site visible.
         */

        site.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * IMPORTANT:
         *
         * #intro itself is 100vh.
         * If we only hide its children,
         * it still occupies one full viewport
         * and creates the giant blank area.
         *
         * Completely remove it from layout.
         */

        intro.style.display =
            "none";


        /*
         * Explicit site visibility.
         */

        site.style.opacity =
            "1";

        site.style.visibility =
            "visible";


        /*
         * Explicit hero visibility.
         */

        if (hero) {

            hero.classList.add(
                "is-visible"
            );

            hero.style.opacity =
                "1";

            hero.style.visibility =
                "visible";

            hero.style.transform =
                "none";

            hero.style.filter =
                "none";
        }


        /*
         * Remove intro body state.
         */

        document.body.classList.remove(
            "intro-active"
        );


        /*
         * Unlock normal scrolling.
         */

        unlockScroll();


        /*
         * Always start homepage at top.
         */

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        /*
         * Tell the rest of the website
         * that intro is complete.
         */

        document.dispatchEvent(
            new CustomEvent(
                "axxor:intro-complete"
            )
        );
    }


    /* =====================================================
       UPDATE INTRO STATE
    ===================================================== */

    function updateStep() {

        /*
         * STEP 0
         * DON'T SCROLL
         */

        if (step <= 0) {

            screen.classList.remove(
                "is-revealing",
                "is-identity",
                "is-exiting"
            );

            return;
        }


        /*
         * STEP 1
         * PFP REVEAL
         */

        if (step === 1) {

            screen.classList.add(
                "is-revealing"
            );

            screen.classList.remove(
                "is-identity",
                "is-exiting"
            );

            return;
        }


        /*
         * STEP 2
         * AXXOR IDENTITY
         */

        if (step === 2) {

            screen.classList.add(
                "is-revealing",
                "is-identity"
            );

            screen.classList.remove(
                "is-exiting"
            );

            return;
        }


        /*
         * STEP 3
         * EXIT INTRO
         */

        if (step >= MAX_STEP) {

            screen.classList.add(
                "is-revealing",
                "is-identity"
            );

            exitIntro();
        }
    }


    /* =====================================================
       NEXT STEP
    ===================================================== */

    function nextStep() {

        if (!locked) {
            return;
        }

        if (isAnimating) {
            return;
        }

        if (step >= MAX_STEP) {
            return;
        }


        isAnimating = true;

        step++;

        updateStep();


        setTimeout(function () {

            isAnimating = false;

        }, 850);
    }


    /* =====================================================
       PREVIOUS STEP
    ===================================================== */

    function previousStep() {

        if (!locked) {
            return;
        }

        if (isAnimating) {
            return;
        }

        if (step <= 0) {
            return;
        }


        isAnimating = true;

        step--;


        /*
         * Back to DON'T SCROLL.
         */

        if (step === 0) {

            screen.classList.remove(
                "is-revealing",
                "is-identity",
                "is-exiting"
            );
        }


        /*
         * Back to PFP.
         */

        else if (step === 1) {

            screen.classList.add(
                "is-revealing"
            );

            screen.classList.remove(
                "is-identity",
                "is-exiting"
            );
        }


        /*
         * Back to AXXOR identity.
         */

        else if (step === 2) {

            screen.classList.add(
                "is-revealing",
                "is-identity"
            );

            screen.classList.remove(
                "is-exiting"
            );
        }


        setTimeout(function () {

            isAnimating = false;

        }, 750);
    }


    /* =====================================================
       EXIT INTRO
    ===================================================== */

    function exitIntro() {

        if (hasCompleted) {
            return;
        }


        hasCompleted = true;


        /*
         * Let the AXXOR identity breathe
         * for a short moment.
         */

        setTimeout(function () {

            screen.classList.add(
                "is-exiting"
            );


            /*
             * Finish exit animation.
             */

            setTimeout(function () {

                /*
                 * Hide intro visually.
                 */

                screen.classList.add(
                    "is-complete"
                );


                /*
                 * Remove intro from layout
                 * and reveal homepage.
                 */

                showHomepage();


                /*
                 * Intro is no longer controlling
                 * scrolling.
                 */

                locked = false;

            }, 900);

        }, 450);
    }


    /* =====================================================
       WHEEL CONTROL
    ===================================================== */

    function handleWheel(event) {

        if (!locked) {
            return;
        }


        event.preventDefault();


        const now =
            Date.now();


        /*
         * Prevent trackpad / mouse wheel spam.
         */

        if (
            now - lastWheelTime <
            600
        ) {
            return;
        }


        lastWheelTime =
            now;


        if (event.deltaY > 0) {

            nextStep();

        }

        else if (event.deltaY < 0) {

            previousStep();
        }
    }


    window.addEventListener(
        "wheel",
        handleWheel,
        {
            passive: false
        }
    );


    /* =====================================================
       TOUCH START
    ===================================================== */

    function handleTouchStart(event) {

        if (!locked) {
            return;
        }


        if (
            !event.touches ||
            !event.touches.length
        ) {
            return;
        }


        touchStartY =
            event.touches[0].clientY;

        touchStartX =
            event.touches[0].clientX;
    }


    /* =====================================================
       TOUCH END
    ===================================================== */

    function handleTouchEnd(event) {

        if (!locked) {
            return;
        }


        if (
            !event.changedTouches ||
            !event.changedTouches.length
        ) {
            return;
        }


        const touch =
            event.changedTouches[0];


        const endY =
            touch.clientY;

        const endX =
            touch.clientX;


        const deltaY =
            touchStartY - endY;

        const deltaX =
            touchStartX - endX;


        /*
         * Ignore horizontal gestures.
         */

        if (
            Math.abs(deltaX) >
            Math.abs(deltaY)
        ) {
            return;
        }


        /*
         * Ignore tiny movement.
         */

        if (
            Math.abs(deltaY) < 35
        ) {
            return;
        }


        if (deltaY > 0) {

            nextStep();

        }

        else {

            previousStep();
        }
    }


    document.addEventListener(
        "touchstart",
        handleTouchStart,
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        handleTouchEnd,
        {
            passive: true
        }
    );


    /* =====================================================
       KEYBOARD CONTROL
    ===================================================== */

    function handleKeyboard(event) {

        if (!locked) {
            return;
        }


        /*
         * DOWN
         */

        if (
            event.key === "ArrowDown" ||
            event.key === "PageDown" ||
            event.key === " "
        ) {

            event.preventDefault();

            nextStep();

            return;
        }


        /*
         * UP
         */

        if (
            event.key === "ArrowUp" ||
            event.key === "PageUp"
        ) {

            event.preventDefault();

            previousStep();

            return;
        }


        /*
         * ENTER
         */

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            nextStep();
        }
    }


    document.addEventListener(
        "keydown",
        handleKeyboard
    );


    /* =====================================================
       PAGE VISIBILITY SAFETY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible" &&
                locked
            ) {

                lockScroll();
            }
        }
    );


    /* =====================================================
       INTRO READY
    ===================================================== */

    requestAnimationFrame(
        function () {

            document.dispatchEvent(
                new CustomEvent(
                    "axxor:intro-ready"
                )
            );

        }
    );


})();