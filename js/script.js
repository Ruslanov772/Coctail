$(() => {
    let data;

    const getDetails = cocktail => {
        let detailsHtml = '';
        detailsHtml += '<h3>Info</h3>';
        if (cocktail.strCategory) {
            detailsHtml += '<div><b>Category: </b>' + cocktail.strCategory + '</div>';
        }
        if (cocktail.strAlcoholic) {
            detailsHtml += '<div><b>Type: </b>' + cocktail.strAlcoholic + '</div>';
        }
        if (cocktail.strGlass) {
            detailsHtml += '<div><b>Glass: </b>' + cocktail.strGlass + '</div>';
        }
        detailsHtml += '<h3 class="mt-5">Ingridients</h3><ul class="ingridients">';
        for(let i = 1; i <= 15; i++) {
            if (!cocktail['strIngredient' + i]) {
                break;
            }
            detailsHtml += '<li class="ingridient" id="' + cocktail['strIngredient' + i] + '">' +
                '<img src="https://www.thecocktaildb.com/images/ingredients/' + cocktail['strIngredient' + i] +
                '-Small.png" /><span class="ingridient-name">' + cocktail['strIngredient' + i] + '</span>';
            if (cocktail['strMeasure' + i]) {
                detailsHtml += ' (' + cocktail['strMeasure' + i] + ')';
            }
            detailsHtml += '<div class="ingridient-info" id="' + cocktail['strIngredient' + i] + '-info"></div></li>'
        }
        detailsHtml += `</ul><h3 class="mt-5">Instructions</h3><div>${cocktail.strInstructions}</div>`
        $('.modal-title').html(cocktail.strDrink + ' cocktail info');
        $('.modal-body').html(detailsHtml);
        $('#infoModal').modal();
    }

    const getIngridientDetails = ingridient => {
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i=' + ingridient;
        $.ajax({
            method: 'GET',
            url: url,
            success: response => {
                showIngridientInfo(response['ingredients'][0]);
            },
            error: error => {
                $('.modal-title').html('Error' + error.responseJSON.status);
                $('.modal-body').html(error.responseJSON.message);
                $('#infoModal').modal();
            },
        });
    }

    const showCocktailInfo = data => {
        $('#result_cards').empty();
        data.forEach((item, key) => {
            const card = `<div class="col-6 col-md-4 my-4">
                <div class="card h-100 cocktail-info" data-id="${key}">
                    <img src="${item.strDrinkThumb}" class="card-img-top" alt="${item.strDrink}">
                    <div class="card-body">
                        <h5 class="card-title">${item.strDrink}</h5>
                    </div>
                </div>
            </div>`
            $('#result_cards').append(card);
        })
    };

    const showIngridientInfo = data => {
        $('#' + data['strIngredient'] + '-info').html(data['strDescription']).toggle('fast');
    }

    const getInfo = url => {
        $.ajax({
            method: 'GET',
            url: url,
            success: response => {
                showCocktailInfo(response['drinks']);
                data = response['drinks'];
            },
            error: error => {
                $('.modal-title').html('Error' + error.responseJSON.status);
                $('.modal-body').html(error.responseJSON.message);
                $('#infoModal').modal();
            },
        });
    };

    $('#search_form').on('submit', e => {
        e.preventDefault();
        const text = $('#cocktail').val();
        getInfo('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + text);
    });

    $('#result_cards').on('click', '.cocktail-info', e => {
        getDetails(data[$(e.currentTarget).data('id')]);
    })

    $('html').on('click', '.ingridient', e => {
        const ingridient = $(e.currentTarget).attr('id');
        $('.ingridient-info').hide('fast');
        getIngridientDetails(ingridient);
    })
})