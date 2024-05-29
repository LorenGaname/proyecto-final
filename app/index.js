document.addEventListener("DOMContentLoaded", () => {
  const albumsContainer = document.getElementById("albums-container");
  const cartButton = document.getElementById("cart-button");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const closeCartButton = document.getElementById("close-cart-button");
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
  };

  const renderCart = () => {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((album) => {
      const cartItem = document.createElement("li");
      cartItem.innerHTML = `
                <span>${album.title} - $${album.price.toFixed(2)}</span>
                <button class="remove-from-cart-btn" data-id="${
                  album.id
                }">Remove</button>
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
      const albumId = parseInt(event.target.getAttribute("data-id"));
      cart = cart.filter((album) => album.id !== albumId);
      updateCart();
    }
  });

  // Close cart when clicking outside
  window.addEventListener("click", (event) => {
    if (!cartOverlay.contains(event.target) && event.target !== cartButton) {
      cartOverlay.classList.remove("show-cart");
    }
  });
});
