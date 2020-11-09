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
		document.querySelectorAll('.head-burger-link').forEach(function (btn,int) {
			if (int > 0){
				btn.addEventListener('click',function () {
					_.burgerClick();
				})
			}
		});

		_.init();
		window.addEventListener('scroll',function () {
			_.headScroll();
			_.headLinkActive();
		});
		window.addEventListener('resize',_.projectsWidthAdaptive)
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
		let headLinks = document.querySelectorAll('.head-burger-link');

		let oneTime = 100;
		let time = oneTime * headLinks.length;

		let interval;
		if (!_.burgerCondition) {
			let int = 0;
			interval = setInterval(function () {
				headLinks[int].classList.add('active');
				int++;
			}, oneTime);
			_.burgerCondition = true;
			burgerBtn.classList.add('active');
		} else {
			let int = headLinks.length - 1;
			interval = setInterval(function () {
				headLinks[int].classList.remove('active');
				int--;
			},oneTime);
			_.burgerCondition = false;
			burgerBtn.classList.remove('active');
		}

		setTimeout(function (e) {
			clearInterval(interval)
		},time);
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
				window.scrollTo(0,_.positions[link.getAttribute('href')] - 150);
			})
		})
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
	}
}

let page = new Page();