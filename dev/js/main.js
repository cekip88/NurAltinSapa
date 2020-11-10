class Page {
	constructor() {
		const _ = this;
		_.body = document.querySelector('body');
		_.header = _.body.querySelector('header');
		_.burgerCondition = false;
		_.positions = {};
		_.currentBlock = '';

		document.querySelector('.head-burger-btn').addEventListener('click',function () {
			_.burgerClick();
		});
		document.querySelector('.head-burger-menu').addEventListener('click',function () {
			_.burgerClick();
		});

		_.init();
		window.addEventListener('scroll',function () {
			_.headScroll();
			_.headLinkActive();
		});
		window.addEventListener('resize',function (){
			_.getBlocksPosition();
			_.projectsWidthAdaptive();
		});
		document.querySelector('.projects-arrows-next').addEventListener('click',function () {
			_.projectNextSlide();
		});
		document.querySelector('.projects-arrows-prev').addEventListener('click',function () {
			_.projectPrevSlide();
		});
	}

	createEl(tag,cls = null,data){
		if (!tag) return;
		let temp = document.createElement(tag);
		if (cls) temp.className = cls;
		if (data) {
			for (let attr in data) {
				temp.setAttribute(attr,data[attr]);
			}
		}

		return temp;
	}

	headScroll(){
		let header = document.querySelector('.head');
		window.scrollY > 0 ? header.classList.add('active') : header.classList.remove('active')
	}
	burgerClick(){
		const _ = this;
		if (window.innerWidth >= 768) return;

		let burgerBtn = document.querySelector('.head-burger-btn');
		let headMenu = document.querySelector('.head-burger-menu');

		burgerBtn.classList.toggle('active');
		headMenu.classList.toggle('active');
	}

	sliderPrepare(){
		const _ = this;

		let control = document.querySelector('.slider-control');

		let slides = document.querySelectorAll('.slide');
		slides.forEach(function (el,index) {
			let button = _.createEl('BUTTON','control-btn');
			if (index === 0) {
				button.classList.add('active');
				el.classList.add('active');
			}
			control.append(button);
			button.addEventListener('click',function () {
				_.swapSlide(index);
			})
		})
	}
	swapSlide(index){
		let btns = document.querySelectorAll('.slider .control-btn');
		let slides = document.querySelectorAll('.slide');

		btns.forEach(function (btn,int) {
			if (btn.classList.contains('active')){
				btn.classList.remove('active');
				if (slides[int]) slides[int].classList.remove('active');
			}
		});
		btns[index].classList.add('active');
		slides[index].classList.add('active');
	}

	formContinue(){
		let btns = document.querySelectorAll('.calc-continue');
		let style = 'opacity:1;visibility:visible;position:relative';
		let curPage = document.querySelector('.calc-page-first');
		curPage.setAttribute('style',style);

		btns.forEach(function (el,int) {
			el.addEventListener('click',function (e) {
				if (window.innerWidth > 767) e.preventDefault();
				let btn = e.target;
				if (!btn.classList.contains('calc-submit')){
					let page = btn.parentNode;
					let next = page.nextElementSibling;
					page.removeAttribute('style');
					next.setAttribute('style',style);
				}
			})
		})
	}
	formTypeChoose(){
		const _ = this;

		let btns = document.querySelectorAll('.calc-select-buttons button');
		let input = document.querySelector('.calc-select-buttons input');
		btns.forEach(function (el) {
			el.addEventListener('click',function (e) {
				btns.forEach(function (btn) {
					btn.classList.remove('active');
				});
				el.classList.add('active');
				input.value = el.getAttribute('data-value');
			})
		})
	}

	projectsWidthAdaptive(){
		const _ = this;
		if (window.innerWidth < 1170) return;
		let slider = document.querySelector('.projects-slider');
		let width = ((window.innerWidth - 1170) / 2) + 264;
		width = window.innerWidth - width;
		slider.setAttribute('style',`flex-basis:${width}px`)
	}

	getBlocksPosition(){
		const _ = this;

		let blocks = ['#projects','#calc','#about','#partners','#foot'];
		blocks.forEach(function (id) {
			let block = document.querySelector(id);
			let position = block.offsetTop;
			_.positions[id] = position;
		});
	}
	headLinkActive(){
		const _ = this;
		let links = document.querySelectorAll('.head-link');
		let block = '';
		for (let position in _.positions){
			if (window.pageYOffset >= _.positions[position] - 300) block = position;
		}
		if (_.currentBlock !== block) {
			_.currentBlock = block;
			links.forEach(function (link) {
				link.classList.remove('active');
				if (link.getAttribute('href') === _.currentBlock) link.classList.add('active')
			})
		}
	}
	headLinkHandler(){
		const _ = this;
		let links = document.querySelectorAll('.head-link');
		links.forEach(function (link) {
			link.addEventListener('click',function (e) {
				e.preventDefault();
				if (window.innerWidth < 1200) window.scrollTo(0,_.positions[link.getAttribute('href')] - 80);
				else  window.scrollTo(0,_.positions[link.getAttribute('href')] - 150);
			})
		})
	}

	aboutSlider(){
		const _ = this;
		let slides = document.querySelectorAll('.about-page'),
				buttons = document.querySelectorAll('.about-control button');
		slides.forEach(function (page,int) {
			page.setAttribute('style',`transform:translateX(${int * 100}%)`)
		});

		buttons.forEach(function (button,index) {
			button.addEventListener('click',function (e) {
				for (let i = 0; i < buttons.length; i++){
					buttons[i].classList.remove('active');
					slides[i].classList.remove('active');
				}
				button.classList.add('active');
				slides.forEach(function (page,int) {
					page.setAttribute('style',`transform:translateX(${(int - index) * 100}%)`)
				})
			})
		})
	}

	specSwipe(){
		let slides = document.querySelectorAll('.worker');
		slides.forEach(function (slide,i) {

			let startPos = 0;
			slide.addEventListener('touchstart',function (e) {
				startPos = e.changedTouches[0].clientX;
			});

			function slideSwipe(dir){
				slides.forEach(function (el) {
					let trans = el.getAttribute('data-style') * 1;
					if (dir)trans = trans - 100;
					else if (!dir) trans = trans + 100;
					el.setAttribute('style',`transform:translateX(${trans}%)`);
					el.setAttribute('data-style',`${trans}`);
				})
			}

			slide.addEventListener('touchend',function (e) {
				if (e.changedTouches[0].clientX - startPos < -50) {
					let lastSlidePos = slides[slides.length - 1].getAttribute('data-style') * 1;
					if ((window.innerWidth < 768 && lastSlidePos > 0) || (window.innerWidth >= 768 && lastSlidePos > 200)) slideSwipe(true)
				} else if (e.changedTouches[0].clientX - startPos > 50) {
					let lastSlidePos = slides[0].getAttribute('data-style') * 1;
					if ((window.innerWidth < 768 && lastSlidePos < 0) || (window.innerWidth >= 768 && lastSlidePos < 0))  slideSwipe(false)
				} else {
					let st = slide.getAttribute('data-style');
					slide.setAttribute('style',`transform:translateX(${st}%)`);
				}
			});
		})
	}
	specStart(){
		let slides = document.querySelectorAll('.worker');
		slides.forEach(function (slide,index) {
			let style = `transform:translateX(${index * 100}%)`;
			slide.setAttribute('style',style);
			slide.setAttribute('data-style',`${index * 100}`);
		})
	}

	projectSliderDotsCreate(){
		const _ = this;
		let dotsCont = document.querySelector('.projects-control');
		let slider = document.querySelector('.projects-cont');
		let desc = document.querySelector('.projects-descriptions');
		let length = slider.children.length;
		for (let i = 0; i < length; i++){
			let str = 'data-number';
			slider.children[i].setAttribute(str,i);
			desc.children[i].setAttribute(str,i);
			let btn = _.createEl('BUTTON','control-btn');
			btn.setAttribute(str,i);
			btn.addEventListener('click',function () {
				_.projectDotsClick(i);
			});
			dotsCont.append(btn);
			if (i === 0){
				btn.classList.add('active');
				desc.children[i].classList.add('active');
				slider.children[i].classList.add('active');
			}
		}
	}
	projectSliderPrepare(){
		let slider = document.querySelector('.projects-cont');
		let slides = slider.children;
		let length = slides.length;
		if (window.innerWidth >= 768){
			if (length < 5){
				for (let i = 0; i < length; i++){
					slider.append(slides[i].cloneNode(true))
				}
			}
		}

	}

	projectLastToBegin(){
		let slider = document.querySelector('.projects-cont');
		let last = slider.lastElementChild;
		last.remove();
		slider.prepend(last);
	}

	projectNextSlide(number = 1){
		const _ = this;

		let slider = document.querySelector('.projects-cont');
		let first = slider.firstElementChild;
		first.remove();
		slider.append(first);
		_.projectSliderActiveControl(1);

		function next(element){
			element = element.children;
			for (let i = 0; i < element.length; i++) {
				if (element[i].classList.contains('active')) {
					element[i].classList.remove('active');
					i++;
					if (i === element.length) i = 0;
					element[i].classList.add('active');
				}
			}
		}

		let dots = document.querySelector('.projects-control');
		next(dots);

		let desc = document.querySelector('.projects-descriptions');
		next(desc)
	}
	projectPrevSlide(){
		const _ = this;
		let slider = document.querySelector('.projects-cont');
		let last = slider.lastElementChild;
		last.remove();
		slider.prepend(last);
		_.projectSliderActiveControl(1);

		function prev(element){
			element = element.children;
			for (let i = element.length - 1; i >= 0 ; i--) {
				if (element[i].classList.contains('active')) {
					element[i].classList.remove('active');
					i--;
					if (i < 0) i = element.length - 1;
					element[i].classList.add('active');
				}
			}
		}

		let dots = document.querySelector('.projects-control');
		prev(dots);
		let desc = document.querySelector('.projects-descriptions');
		prev(desc)
	}

	projectDotsClick(curBtnNumber){
		const _ = this;
		let dots = document.querySelector('.projects-control').children;
		let activeBtnNumber = 0;
		for (let i = 0; i < dots.length; i++){
			if (dots[i].classList.contains('active')) activeBtnNumber = i;
		}
		let difference = curBtnNumber - activeBtnNumber;
		let time = 100;
		if (window.innerWidth > 767) time = 200;
		if(difference > 0) {
			_.projectNextSlide();
			let interval = setInterval(function () {
				_.projectNextSlide()
			},time);
			setTimeout(function () {
				clearInterval(interval)
			},time * (difference - 1));
		} else if (difference < 0){
			_.projectPrevSlide();
			let interval = setInterval(function () {
				_.projectPrevSlide()
			},time);
			setTimeout(function () {
				clearInterval(interval)
			},time * ((difference * -1) - 1));
		}
	}

	projectSliderActiveControl(number){
		let slider = document.querySelector('.projects-cont');
		let slides = slider.children;
		for (let i = 0; i < slides.length; i++){
			if (i === number) slides[i].classList.add('active');
			else slides[i].classList.remove('active')
		}
	}

	init(){
		const _ = this;
		_.headScroll();
		_.sliderPrepare();
		_.formContinue();
		_.formTypeChoose();
		_.projectsWidthAdaptive();
		_.getBlocksPosition();
		_.headLinkActive();
		_.headLinkHandler();
		_.aboutSlider();
		_.specStart();
		_.specSwipe();
		_.projectSliderDotsCreate();
		_.projectSliderPrepare();
		_.projectLastToBegin();
	}
}

let page = new Page();