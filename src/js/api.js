const API_KEY = 'AIzaSyD6Jofy6yrroK5_p-UbbqSNT4b48Xbq5qw';

let booksList = document.querySelector('.books__list');
let shoppingAmount = document.querySelector('.inform__shop-bag').querySelector('span');
let infoBuyOfBooks = localStorage.infoBuyOfBooks ? JSON.parse(localStorage.infoBuyOfBooks) : [];

module.exports = function api() {
  let categoriy = 'Architecture', amount = 6;

  async function getBooks(categoriy = 'Architecture', amount = 6) {
    booksList.innerHTML = '';
    let dataJson = await fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${categoriy}"&key=${API_KEY}&printType=books&startIndex=0&maxResults=${amount}&langRestrict=en`);
    let data = await dataJson.json();
    let bookArr = data.items;
    bookArr.forEach(book => {
      let { title, authors } = book.volumeInfo
      let { thumbnail } = book.volumeInfo.imageLinks
      let price = book.saleInfo.listPrice ? book.saleInfo.listPrice.amount + ' ' + book.saleInfo.listPrice.currencyCode : '';
      let description = book.searchInfo ? book.searchInfo.textSnippet : '';

      let getRating = () => {
        if (book.volumeInfo.averageRating) {
          let ratingStar = book.volumeInfo.averageRating;
          let ratingCount = book.volumeInfo.ratingsCount;
          let star = '';

          for (let i = 0; i < Math.floor(ratingStar); i++) {
            star += `<svg svg svg width = "12" height = "11" viewBox = "0 0 12 11" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
                      <path d="M6 0L7.80568 3.5147L11.7063 4.1459L8.92165 6.9493L9.52671 10.8541L6 9.072L2.47329 10.8541L3.07835 6.9493L0.293661 4.1459L4.19432 3.5147L6 0Z" fill="#F2C94C" />
                    </svg >`;
          }
          return `${star} ${ratingCount} review`
        }
        return '';
      }
      let rating = getRating();

      let bookCard = { title, authors, thumbnail, price, description }
      let bookItem = document.createElement('div');
      bookItem.classList.add('book__item');
      bookItem.innerHTML =
        `<div class="book__item_image">
            <img src="${bookCard.thumbnail}" alt="">
          </div>
          <div class="book__item_info">
            <p class="book-autor">${bookCard.authors}</p>
            <strong class="book-name">${bookCard.title}</strong>
            <div class="book-rating">
              <span>
                ${rating}</span>
            </div>
            <p class="book-description">${bookCard.description}</p>
            <strong class="book-price">${bookCard.price}</strong>
            <button class="book-buy pointer uppercase">buy now</button>
          </div>`;

      booksList.appendChild(bookItem);
    });

    let bookBuyBtn = document.querySelectorAll('.book-buy');

    bookBuyBtn.forEach(btnName => {
      let btn = btnName.parentNode.querySelector('.book-name');
      if (infoBuyOfBooks.includes(btn.textContent)) {
        btnName.innerHTML = 'in the cart';
        btnName.classList.add('book-buy-active');
      }
    });

    if (infoBuyOfBooks.length > 0) {
      shoppingAmount.style.display = 'block';
      shoppingAmount.innerHTML = infoBuyOfBooks.length;
    } else {
      shoppingAmount.style.display = 'none';
    }
  }

  getBooks();

  function loaderOn() {
    document.querySelector('.container-book').classList.add('opacity');
    document.querySelector('.loader').style.display = 'block';
  }

  function loaderOff() {
    document.querySelector('.container-book').classList.remove('opacity');
    document.querySelector('.loader').style.display = 'none';
  }

  let shoppingAmountCount = 0;

  document.addEventListener('click', async (event) => {

    if (event.target.classList.contains('books__nav-item')) {
      loaderOn()

      document.querySelectorAll('.books__nav-item').forEach(element => {
        element.classList.remove('books__nav-item-active');
      });

      event.target.classList.add('books__nav-item-active');
      categoriy = event.target.innerHTML;
      amount = 6;
      await getBooks(categoriy, amount);
      loaderOff();
    }

    if (event.target.classList.contains('book-buy')) {
      event.target.classList.toggle('book-buy-active');
      if (event.target.innerHTML === 'buy now') {

        let bookBuy = event.target.parentNode.querySelector('.book-name').textContent.split();

        if (localStorage.infoBuyOfBooks === undefined) {
          localStorage.setItem('infoBuyOfBooks', JSON.stringify(bookBuy))
        }
        else {
          localStorage.setItem('infoBuyOfBooks', JSON.stringify(
            JSON.parse(localStorage.infoBuyOfBooks).concat(bookBuy)
          ))
        }

        let booksBuyArr = JSON.parse(localStorage.infoBuyOfBooks);
        booksBuyArr = [... new Set(booksBuyArr)];
        localStorage.setItem('infoBuyOfBooks', JSON.stringify(booksBuyArr));
        event.target.innerHTML = 'in the cart';

      } else {

        let infoBuyOfBooks = JSON.parse(localStorage.infoBuyOfBooks);

        let bookBuy = event.target.parentNode.querySelector('.book-name').textContent.split();

        let filteredBuy = infoBuyOfBooks.filter(el => el != bookBuy);
        filteredBuy = [... new Set(filteredBuy)];

        localStorage.setItem('infoBuyOfBooks', JSON.stringify(filteredBuy))

        event.target.innerHTML = 'buy now';
      }
      shoppingAmountCount = JSON.parse(localStorage.infoBuyOfBooks);
      shoppingAmount.innerHTML = shoppingAmountCount.length;

      if (JSON.parse(localStorage.infoBuyOfBooks).length > 0) {
        shoppingAmount.style.display = 'block';
      } else {
        shoppingAmount.style.display = 'none';
      }
    }
  })

  document.querySelector('.more-books').addEventListener('click', async (event) => {
    event.preventDefault();
    loaderOn()
    amount += 6;
    await getBooks(categoriy, amount)
    loaderOff()
  })
}