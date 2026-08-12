/* =========================================================
   AXXOR — MAIN.JS
   Lightweight scroll + reveal controller
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .hub-card, .identity-section, .page-section"
    );


    function revealElementsOnScreen() {

        if (!revealElements.length) {
            return;
        }


        const trigger =
            window.innerHeight * 0.88;


        revealElements.forEach(function (element) {

            const rect =
                element.getBoundingClientRect();


            if (rect.top < trigger) {

                element.classList.add(
                    "is-visible"
                );

            }

        });

    }


    /* =====================================================
       INTERSECTION OBSERVER
    ===================================================== */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.05,

                    rootMargin:
                        "0px 0px -5% 0px"
                }

            );


        revealElements.forEach(function (element) {

            observer.observe(element);

        });

    }


    /* =====================================================
       SCROLL FALLBACK
    ===================================================== */

    let ticking = false;


    window.addEventListener(
        "scroll",
        function () {

            if (ticking) {
                return;
            }


            ticking = true;


            requestAnimationFrame(function () {

                revealElementsOnScreen();

                ticking = false;

            });

        },
        {
            passive: true
        }
    );


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (anchor) {

            anchor.addEventListener(
                "click",
                function (event) {

                    const id =
                        anchor.getAttribute("href");


                    if (!id || id === "#") {
                        return;
                    }


                    const target =
                        document.querySelector(id);


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       INITIAL CHECK
    ===================================================== */

    window.addEventListener(
        "load",
        function () {

            /*
             * IMPORTANT:
             * We deliberately DO NOT touch the intro,
             * body overflow, .site visibility or
             * aria-hidden state here.
             *
             * intro.js owns the intro.
             */

            revealElementsOnScreen();

        }
    );


    /* =====================================================
       TAB / APP RECOVERY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (!document.hidden) {

                revealElementsOnScreen();

            }

        }
    );


})();

/* =========================================================
   AXXOR — TEXT CLEANUP
   Remove AI-looking em dashes
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    const nodes = [];

    let node;

    while (node = walker.nextNode()) {
        nodes.push(node);
    }

    nodes.forEach((textNode) => {

        if (!textNode.nodeValue.includes("—")) {
            return;
        }

        textNode.nodeValue =
            textNode.nodeValue
                .replace(/\s*—\s*/g, ", ")
                .replace(/,\s*,/g, ",")
                .replace(/\s+,/g, ",")
                .replace(/,\s*([.!?])/g, "$1");
    });

});