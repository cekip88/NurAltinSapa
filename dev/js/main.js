class Page {
	constructor() {
		const _ = this;
		_.body = document.querySelector('body');
		_.header = _.body.querySelector('header');
		_.burgerCondition = false;

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
		window.addEventListener('scroll',_.headScroll);
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

		let control = _.createEl('DIV','slider-control');
		let section = _.createEl('DIV','section');
		let slider = document.querySelector('.slider');
		control.append(section);
		slider.append(control);

		let slides = document.querySelectorAll('.slide');
		slides.forEach(function (el,index) {
			let button = _.createEl('BUTTON','slider-control-btn');
			button.append(_.createEl('SPAN'));
			if (index === 0) {
				button.classList.add('active');
				el.classList.add('active');
			}
			section.append(button);
			button.addEventListener('click',function () {
				_.swapSlide(index);
			})
		})
	}
	swapSlide(index){
		const _ = this;

		let btns = document.querySelectorAll('.slider-control-btn');
		let slides = document.querySelectorAll('.slide');

		btns.forEach(function (btn,int) {
			if (btn.classList.contains('active')){
				btn.classList.remove('active');
				slides[int].classList.remove('active');
			}
		});
		btns[index].classList.add('active');
		slides[index].classList.add('active');
	}

	formContinue(){
		const _ = this;

		let btns = document.querySelectorAll('.calc-continue');
		btns.forEach(function (el) {
			el.addEventListener('click',function (e) {
				let btn = e.target;
				if (btn.textContent === 'Далее'){
					let page = btn.parentElement;
					page.style = 'margin-left:-100%';
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


	init(){
		const _ = this;
		_.headScroll();
		_.sliderPrepare();
		_.formContinue();
		_.formTypeChoose();
	}
}

let page = new Page();