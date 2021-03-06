$(document).ready(function(){
    $('select').material_select();

    $('#btnConjugate').click(function(){
        var params = {
            lang: $('#lang').first().val(),
            verb: $('#verb').first().val()
        };

        console.log(params);

        $.post('conjugate', params).done(onConjugationSucceeded)
                                   .fail(onConjugationFailed);
    });

    function onTranslationSucceeded(data) {

    }

    function onTranslationFailed() {

    }

    function onConjugationSucceeded(data) {
        var ul = $('<ul class="collapsible" data-collapsible="accordion"></ul>')

        if (!Array.isArray(data.conjugations) || data.conjugations.length === 0) {
            onConjugationFailed();
            return;
        }

        data.conjugations.forEach(function(mode) {
            ul.append(createModeBlock(mode));
        });

        updateConjugationsContainer(ul);

        $('.collapsible').collapsible({
            accordion: false
        });
    }

    function createModeBlock(mode) {
        var li = $('<li></li>');
        var header = $('<div class="collapsible-header"><i class="mode-expander mdi-navigation-expand-more"></i></div>')
        var body = $('<div class="collapsible-body"></div>');

        header.append(mode.name);

        header.click(function () {
            $('.mode-expander').each(function(index, expander){
                expander = $(expander);

                var currentName = expander.parent().text();
                var moreClass = 'mdi-navigation-expand-more';
                var lessClass = 'mdi-navigation-expand-less';

                console.log("Current: ", currentName);

                if (currentName !== mode.name || expander.hasClass(lessClass)) {
                    expander.removeClass(lessClass);
                    expander.addClass(moreClass);
                }
                else {
                    expander.removeClass(moreClass);
                    expander.addClass(lessClass);
                }
            });
        });

        li.append(header);
        li.append(body);

        mode.tenses.forEach(function(tense) {
            body.append(createTenseBlock(tense));
        });

        return li;
    }

    function createTenseBlock(tense) {
        //var title = $('<p></p>').append(tense.name);

        var table = $('<table class="hoverable"></table>').append(
            $('<thead></thead>'),
            $('<tbody></tbody>')
        );

        var names = tense.conjugations.every(function(conjugation) {
           return Boolean(conjugation.name);
        });

        if (Boolean(tense.name)) {
            $('thead', table).append(
                $('<tr></tr>').append(
                    $('<th data-field="tense-name"></th>').append(tense.name),
                    $('<th data-field="empty"></th>')
                )
            );
        }

        $('tbody', table).append(tense.conjugations.map(function(conjugation) {
            var tr = $('<tr></tr>');

            if (names) {
                tr.append($('<td></td>').append(conjugation.name));
            }

            tr.append($('<td></td>').append(conjugation.options.join(', ')));

            return tr;
        }));

        return $('<p></p>').append(table);
    }

    function onConjugationFailed() {
        var errorMsg = "Sorry, we couldn't find any conjugations for that" +
            " verb. Make sure to use the infinitive.";

        var errorBlock = $('<div class="col"></div>').append(
            $('<div class="card-panel red darken-4"></div>').append(
                $('<div class="row"></div>').append(
                    $('<div class="col l2"></div>').append(
                        $('<i class="medium mdi-alert-error"></i>')
                    ),
                    $('<div class="col l10"></div>').append(
                        $('<div class="valign-wrapper"></div>').append(
                            $('<p class="valign"></p>').append(
                                $('<span class="white-text"></span>').append(errorMsg)
                            )
                        )
                    )
                )
            )
        );

        updateConjugationsContainer(errorBlock);
    }

    function updateConjugationsContainer(element) {
        var conjugationsContainer = $('#conjugations');
        conjugationsContainer.empty();
        element.css('display', 'none');
        element.appendTo(conjugationsContainer).fadeIn('slow');
    }

});