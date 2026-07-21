(function() {
    const toggleHeadingElements = document.getElementsByClassName("kg-toggle-heading");

    const toggleFn = function(event) {
        const button = event.currentTarget;
        const parentElement = button.closest('.kg-toggle-card');
        if (!parentElement) {
            return;
        }

        const contentElement = parentElement.querySelector('.kg-toggle-content');
        const toggleState = parentElement.getAttribute("data-kg-toggle-state");
        const isOpening = toggleState === 'close';

        parentElement.setAttribute('data-kg-toggle-state', isOpening ? 'open' : 'close');
        button.setAttribute('aria-expanded', isOpening ? 'true' : 'false');

        if (contentElement) {
            contentElement.setAttribute('aria-hidden', isOpening ? 'false' : 'true');
        }
    };

    for (let i = 0; i < toggleHeadingElements.length; i++) {
        toggleHeadingElements[i].addEventListener('click', toggleFn, false);
    }
})();
