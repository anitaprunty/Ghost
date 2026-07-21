const {addCreateDocumentOption} = require('../render-utils/add-create-document-option');
const {html} = require('../render-utils/tagged-template-fns.js');

let toggleIdCounter = 0;

function nextToggleId() {
    toggleIdCounter += 1;
    return `kg-toggle-${toggleIdCounter}`;
}

function cardTemplate({node, contentId}) {
    return (
        `
        <div class="kg-card kg-toggle-card" data-kg-toggle-state="close">
            <h4 class="kg-toggle-heading-text">
                <button
                    class="kg-toggle-heading"
                    type="button"
                    aria-expanded="false"
                    aria-controls="${contentId}"
                >
                    <span class="kg-toggle-heading-label">${node.heading}</span>
                    <span class="kg-toggle-card-icon" aria-hidden="true">
                        <svg id="Regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path class="cls-1" d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"></path>
                        </svg>
                    </span>
                </button>
            </h4>
            <div class="kg-toggle-content" id="${contentId}" aria-hidden="true">${node.content}</div>
        </div>
        `
    );
}

function emailCardTemplate({node}) {
    return (
        html`
        <table cellspacing="0" cellpadding="0" border="0" width="100%" class="kg-toggle-card">
            <tbody>
                <tr>
                    <td class="kg-toggle-heading">
                        <h4>${node.heading}</h4>
                    </td>
                </tr>
                <tr>
                    <td class="kg-toggle-content">
                        ${node.content}
                    </td>
                </tr>
            </tbody>
        </table>
        `
    );
}

function renderToggleNode(node, options = {}) {
    addCreateDocumentOption(options);

    const document = options.createDocument();

    const htmlString = options.target === 'email'
        ? emailCardTemplate({node}, options)
        : cardTemplate({node, contentId: nextToggleId()});

    const container = document.createElement('div');
    container.innerHTML = htmlString.trim();

    const element = container.firstElementChild;
    return {element};
}

module.exports = renderToggleNode;
