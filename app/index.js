document.addEventListener("DOMContentLoaded", () => {
  const albumsContainer = document.getElementById("albums-container");
  const cartButton = document.getElementById("cart-button");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const closeCartButton = document.getElementById("close-cart-button");
  const purchaseButton = document.getElementById("purchase-button");
  let albums = [];
  let cart = [];

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      albums = data;
      renderAlbums();
    })
    .catch((error) => console.error("Error fetching albums:", error));

  const renderAlbums = () => {
    albumsContainer.innerHTML = "";
    albums.forEach((album) => {
      const albumDiv = document.createElement("div");
      albumDiv.classList.add("album");
      albumDiv.innerHTML = `
        <img src="${album.image}" alt="${album.title}">
        <h3>${album.title}</h3>
        <p>Artist: ${album.artist}</p>
        <p>Price: $${album.price.toFixed(2)}</p>
        <p>Description: ${album.description}</p>
        <button class="add-to-cart-btn" data-id="${
          album.id
        }">Add to Cart</button>
      `;
      albumsContainer.appendChild(albumDiv);
    });
  };

  const updateCart = () => {
    renderCart();
    updateCartCount();
    saveCartToLocalStorage();
  };

  const renderCart = () => {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((album, index) => {
      const cartItem = document.createElement("li");
      cartItem.innerHTML = `
        <span>${album.title} - $${album.price.toFixed(2)}</span>
        <button class="remove-from-cart-btn" data-index="${index}">Remove</button>
      `;
      cartItems.appendChild(cartItem);
      totalPrice += album.price;
    });

    cartTotal.textContent = totalPrice.toFixed(2);
  };

  const updateCartCount = () => {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.length;
  };

  albumsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart-btn")) {
      const albumId = parseInt(event.target.getAttribute("data-id"));
      const albumToAdd = albums.find((album) => album.id === albumId);
      if (albumToAdd) {
        cart.push(albumToAdd);
        updateCart();
      }
    }
  });

  cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("show-cart");
  });

  closeCartButton.addEventListener("click", () => {
    cartOverlay.classList.remove("show-cart");
  });

  cartOverlay.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
      event.stopPropagation();
      const albumIndex = parseInt(event.target.getAttribute("data-index"));
      cart.splice(albumIndex, 1);
      updateCart();
    }
  });

  window.addEventListener("click", (event) => {
    if (!cartOverlay.contains(event.target) && event.target !== cartButton) {
      cartOverlay.classList.remove("show-cart");
    }
  });

  purchaseButton.addEventListener("click", () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "El carrito está vacío",
        text: "Por favor, agrega álbumes al carrito antes de proceder con la compra.",
        icon: "warning",
      });
    } else {
      sweetalert().then(() => {
        cart = [];
        updateCart();
        console.log("Cart should be empty now:", cart);
      });
    }
  });

  const saveCartToLocalStorage = () => {
    console.log("Saving cart to localStorage:", cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const loadCartFromLocalStorage = () => {
    const cartFromStorage = localStorage.getItem("cart");
    if (cartFromStorage) {
      cart = JSON.parse(cartFromStorage);
      updateCart();
    }
  };

  loadCartFromLocalStorage();
});

function sweetalert() {
  return Swal.fire({
    title: "¿Estás seguro que quieres comprar estos álbumes?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      return Swal.fire({
        title: "Compra realizada",
        text: "¡Muchas gracias por confiar en nosotros!",
        icon: "success",
      });
    }
  });
}
