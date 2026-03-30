/**
 * Loads references from references.json and renders them into a container element.
 * References are sorted by year, newest first.
 *
 * @param {string} containerId - The id of the element to render into.
 * @param {object} options
 * @param {string}  options.mode        - 'inline' (default) or 'table'
 *                                        'inline' renders paragraphs into a div
 *                                        'table'  renders <tr> rows into a <tbody>
 * @param {boolean} options.showHeading - (inline only) render the "References to studies..." heading
 */
function loadReferences(containerId, options) {
    options = options || {};
    var mode = options.mode || 'inline';
    var showHeading = options.showHeading || false;

    fetch('references.json')
        .then(function(response) {
            if (!response.ok) throw new Error('Failed to load references.json');
            return response.json();
        })
        .then(function(refs) {
            var container = document.getElementById(containerId);
            if (!container) return;

            refs.sort(function(a, b) { return b.year - a.year; });

            if (mode === 'table') {
                var rows = '';
                refs.forEach(function(ref) {
                    rows += '<tr>' +
                        '<td>' + ref.year + '</td>' +
                        '<td>' +
                            ref.authors + ', ' + ref.year + '. ' +
                            '<strong>' + ref.title + '</strong> ' +
                            ref.journal + ' ' +
                            '<a href="' + ref.doi + '" target="_blank">' + ref.doi + '</a>' +
                        '</td>' +
                        '</tr>';
                });
                container.innerHTML = rows;
            } else {
                var html = '';
                if (showHeading) {
                    html += '<span style="font-weight: bold;">References to studies from the mire chronosequence:</span><br><br>';
                }
                refs.forEach(function(ref) {
                    html += ref.authors + ', ' + ref.year + '. ' +
                            '<strong>' + ref.title + '</strong> ' +
                            ref.journal + ' ' +
                            '<a href="' + ref.doi + '" target="_blank">' + ref.doi + '</a>' +
                            '<br><br>';
                });
                container.innerHTML = html;
            }
        })
        .catch(function(err) {
            console.error('Could not load references:', err);
        });
}
