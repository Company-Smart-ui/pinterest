function get_card(image, title, price) {
    card = '<figure class="figure"> \
        <img src='+image+' class="rounded" width="236" height="306" > \
        <figcaption class="figure-caption text-truncate"> \
          <img src="img/lululemon-logo.png" style="max-width:100px;width:100%"> \
          <span class="text-truncate">'+title+'</span> \
          <span>'+price+'€</span> \
        </figcaption> \
      </figure>'
    return card;
}
function get_card2(image, title, price) {
    card = '<img src='+image+' class="rounded" width="236" height="306" > \
        <div class="row"> \
          <div class="col-6"> \
            <img src="img/lululemon-logo.png" style="max-width:100px;width:100%"> \
          </div> \
          <div class="col-6"> \
            <div class="row"> \
              <div class="col-6 text-truncate">'+title+'</div> \
            </div> \
            <div class="row"> \
              <div class="col-6 text-truncate">'+price+'€</div> \
            </div> \
          </div> \
        </div>'
    return card;
}

$(document).ready(function() {

    $.getJSON( "../crawler/products.json", function( data ) {
      let cards = [];
      var id_idx = 1
      $.each(data['products'], function( key, val ) {
        card = get_card(val['image'], val['name'], val['offers']['price'])
        if(id_idx > 6) {
          id_idx=1;
        }
        $("#col"+id_idx).append(card);
        id_idx +=1
      });

    });
});
