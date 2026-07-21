const assert = require('assert/strict');
const {callRenderer, html, assertPrettifiesTo} = require('../test-utils');

describe('services/koenig/node-renderers/toggle-renderer', function () {
    function getTestData(overrides = {}) {
        return {
            heading: 'Toggle Heading',
            content: 'Collapsible content',
            ...overrides
        };
    }

    function renderForWeb(data, options) {
        return callRenderer('toggle', data, options);
    }

    function renderForEmail(data, options) {
        return callRenderer('toggle', data, {...options, target: 'email'});
    }

    describe('web', function () {
        it('matches snapshot for default test data', function () {
            const result = renderForWeb(getTestData());

            assert.ok(result.html);

            // Normalize generated ids so the snapshot stays stable
            const normalizedHtml = result.html
                .replace(/id="kg-toggle-\d+"/g, 'id="kg-toggle-ID"')
                .replace(/aria-controls="kg-toggle-\d+"/g, 'aria-controls="kg-toggle-ID"');

            assertPrettifiesTo(normalizedHtml, html`
                <div class="kg-card kg-toggle-card" data-kg-toggle-state="close">
                    <h4 class="kg-toggle-heading-text">
                        <button
                            class="kg-toggle-heading"
                            type="button"
                            aria-expanded="false"
                            aria-controls="kg-toggle-ID"
                        >
                            <span class="kg-toggle-heading-label">Toggle Heading</span>
                            <span class="kg-toggle-card-icon" aria-hidden="true">
                                <svg id="Regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        class="cls-1"
                                        d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"></path>
                                </svg>
                            </span>
                        </button>
                    </h4>
                    <div class="kg-toggle-content" id="kg-toggle-ID" aria-hidden="true">Collapsible content</div>
                </div>
            `);
        });

        it('exposes heading text as the button accessible name', function () {
            const result = renderForWeb(getTestData({heading: 'FAQ about billing'}));
            const button = result.element.querySelector('button.kg-toggle-heading');
            const label = result.element.querySelector('.kg-toggle-heading-label');
            const content = result.element.querySelector('.kg-toggle-content');

            assert.equal(button.getAttribute('aria-expanded'), 'false');
            assert.equal(button.getAttribute('aria-controls'), content.id);
            assert.equal(label.textContent, 'FAQ about billing');
            assert.equal(content.getAttribute('aria-hidden'), 'true');
            assert.equal(button.querySelector('.kg-toggle-card-icon').getAttribute('aria-hidden'), 'true');
            // Generic aria-label must not override the heading text
            assert.equal(button.hasAttribute('aria-label'), false);
        });
    });

    describe('email', function () {
        it('matches snapshot for default test data', function () {
            const result = renderForEmail(getTestData(), {feature: {}});

            assert.ok(result.html);

            assertPrettifiesTo(result.html, html`
                <table cellspacing="0" cellpadding="0" border="0" width="100%" class="kg-toggle-card">
                    <tbody>
                        <tr>
                            <td class="kg-toggle-heading">
                                <h4>Toggle Heading</h4>
                            </td>
                        </tr>
                        <tr>
                            <td class="kg-toggle-content">Collapsible content</td>
                        </tr>
                    </tbody>
                </table>
            `);
        });
    });
});
