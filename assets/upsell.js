async function addTocartUpsell(event, button) {
  event.preventDefault();
  button.setAttribute('aria-disabled', true);
  button.classList.add('loading');
  button.querySelector('.loading-spinner').classList.remove('hidden');
  const form =  button.closest('form');
  const form_data = new FormData(form);
  form_data.set('sections', 'cart-drawer,cart-icon-bubble');
  const config = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Access-Control-Allow-Origin': 'no-cors',
    },
    body: form_data,
  }
  const response = await fetch(`${routes.cart_add_url}.js`, config)
  const result = await response.json();
  if (response.ok) {
    document.dispatchEvent(new CustomEvent('cart-update', {detail: {productVariantId: form_data.get('id')} }));
    button.removeAttribute('aria-disabled', true);
    button.classList.remove('loading');
    button.querySelector('.loading-spinner').classList.add('hidden');
    const cart_drawer = document.querySelector('.cart-drawer');
    const bubble = document.getElementById('cart-icon-bubble');

    const cart_drawer_parsed = new DOMParser()
    .parseFromString(result.sections['cart-drawer'], 'text/html')
    .querySelector('.cart-drawer');
    
    const bubble_parsed = new DOMParser()
    .parseFromString(result.sections['cart-icon-bubble'], 'text/html')
    .getElementById('shopify-section-cart-icon-bubble');


    cart_drawer.innerHTML = cart_drawer_parsed.innerHTML;
    bubble.innerHTML = bubble_parsed.innerHTML
    
    setTimeout(() => {
      cart_drawer.parentNode.classList.add('active');
      document.body.classList.add('overflow-hidden');
      cart_drawer.querySelector('#CartDrawer-Overlay').addEventListener('click',()=> {
        cart_drawer.parentNode.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
}

const upsell_add_to_cart_buttons = document.querySelectorAll('.js-add-upsell');
for (const button of upsell_add_to_cart_buttons) {
  button.addEventListener('click', async (e)=> {addTocartUpsell(e, button)})
}

function upsellSlider() {
  let settings = {
    type: 'slide',
    perPage: 3,
    perMove: 1,
    gap: 10,
    arrows: true,
    pagination: false,
    focus    : 0,
		omitEnd  : true,
    mediaQuery: 'min',
    breakpoints: {
      750: {
        perPage: 2.5,
      }
    }
  }
  let slider = new Splide('.upsell-slider', settings);
  slider.mount();
}

document.addEventListener('DOMContentLoaded', ()=> {
  upsellSlider()
})