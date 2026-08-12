/* =========================================================
   AXXOR — CUSTOM CURSOR
   Desktop only / lightweight / touch-safe
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DEVICE CHECK
    ===================================================== */

    const finePointer =
        window.matchMedia(
            "(pointer: fine)"
        );


    /*
     * Don't create a custom cursor on
     * touch devices.
     */

    if (!finePointer.matches) {
        return;
    }


    /* =====================================================
       CREATE CURSOR
    ===================================================== */

    const cursor =
        document.querySelector(".cursor");

    const dot =
        document.querySelector(".cursor-dot");


    /*
     * If the HTML doesn't contain cursor
     * elements, create them automatically.
     */

    let cursorElement = cursor;
    let dotElement = dot;


    if (!cursorElement) {

        cursorElement =
            document.createElement("div");

        cursorElement.className =
            "cursor";

        document.body.appendChild(
            cursorElement
        );

    }


    if (!dotElement) {

        dotElement =
            document.createElement("div");

        dotElement.className =
            "cursor-dot";

        document.body.appendChild(
            dotElement
        );

    }


    /* =====================================================
       STATE
    ===================================================== */

    let mouseX = -100;
    let mouseY = -100;

    let currentX = -100;
    let currentY = -100;

    let visible = false;


    /* =====================================================
       MOUSE MOVE
    ===================================================== */

    document.addEventListener(
        "mousemove",
        function (event) {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;


            if (!visible) {

                visible = true;

                cursorElement.style.opacity =
                    "1";

                dotElement.style.opacity =
                    "1";

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       ANIMATION LOOP
    ===================================================== */

    function animate() {

        /*
         * Smooth follow.
         * The dot follows almost instantly.
         */

        currentX +=
            (mouseX - currentX) * 0.18;

        currentY +=
            (mouseY - currentY) * 0.18;


        cursorElement.style.transform =
            `translate3d(${currentX}px, ${currentY}px, 0)
             translate(-50%, -50%)`;


        dotElement.style.transform =
            `translate3d(${mouseX}px, ${mouseY}px, 0)
             translate(-50%, -50%)`;


        requestAnimationFrame(
            animate
        );

    }


    requestAnimationFrame(
        animate
    );


    /* =====================================================
       HOVER INTERACTION
    ===================================================== */

    function bindInteractiveElements() {

        const interactive =
            document.querySelectorAll(
                "a, button, [role='button'], .hub-card, .lab-card, .signal-card, .info-card"
            );


        interactive.forEach(
            function (element) {

                element.addEventListener(
                    "mouseenter",
                    function () {

                        cursorElement.style.width =
                            "48px";

                        cursorElement.style.height =
                            "48px";

                        cursorElement.style.borderColor =
                            "rgba(255,255,255,0.65)";

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    function () {

                        cursorElement.style.width =
                            "32px";

                        cursorElement.style.height =
                            "32px";

                        cursorElement.style.borderColor =
                            "rgba(255,255,255,0.35)";

                    }
                );

            }
        );

    }


    bindInteractiveElements();


    /* =====================================================
       HIDE WHEN LEAVING WINDOW
    ===================================================== */

    document.addEventListener(
        "mouseleave",
        function () {

            cursorElement.style.opacity =
                "0";

            dotElement.style.opacity =
                "0";

        }
    );


    document.addEventListener(
        "mouseenter",
        function () {

            if (visible) {

                cursorElement.style.opacity =
                    "1";

                dotElement.style.opacity =
                    "1";

            }

        }
    );


    /* =====================================================
       CLICK FEEDBACK
    ===================================================== */

    document.addEventListener(
        "mousedown",
        function () {

            cursorElement.style.width =
                "25px";

            cursorElement.style.height =
                "25px";

        }
    );


    document.addEventListener(
        "mouseup",
        function () {

            cursorElement.style.width =
                "32px";

            cursorElement.style.height =
                "32px";

        }
    );


    /* =====================================================
       PAGE READY
    ===================================================== */

    document.dispatchEvent(
        new CustomEvent(
            "axxor:cursor-ready"
        )
    );


})();