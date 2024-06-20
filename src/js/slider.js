
module.exports = function slider() {

  let sliderArr = [
    '../src/images/banners/banner-one.jpg',
    '../src/images/banners/banner-two.jpg',
    '../src/images/banners/banner-three.jpg'
  ]

  const sliderWrap = document.querySelector('.slider');
  const slider = document.createElement('div');
  const banner = document.createElement('img');
  const sliderDots = document.createElement('div');
  const sliderLink = document.createElement('div');



  sliderLink.classList.add('slider-link');
  sliderLink.innerHTML = `
    <a href="#" class="slider-link-one slider-link-item">Change old book on new</a>
    <a href="#" class="slider-link-two slider-link-item">top 100 books 2022</a>
  `
  sliderDots.classList.add('slider-dots');
  slider.appendChild(banner);
  sliderWrap.appendChild(slider);
  sliderWrap.appendChild(sliderLink);
  sliderWrap.appendChild(sliderDots);


  sliderArr.forEach((el, i) => {
    let dot = document.createElement('div');
    dot.classList.add('dot');
    sliderDots.appendChild(dot);
  });

  const dot = document.querySelectorAll('.dot');

  let counter = 0;

  function getSlider(count) {
    banner.src = sliderArr[count]
    sliderArr.forEach((el, i) => {
      if (i === count) {
        dot[i].classList.add('dot-active')
      } else {
        dot[i].classList.remove('dot-active')
      }
    });
  }

  getSlider(counter);

  setInterval(() => {
    counter++
    getSlider(counter)
    if (counter >= sliderArr.length) {
      counter = 0
      getSlider(counter)
    }
  }, 5000);


  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('dot')) {
      dot.forEach((point, i) => {
        if (point === event.target) {
          counter = i;
          getSlider(counter);
        }
      })
    }
  })
}
