class Page {
	constructor() {
		const _ = this;
		_.body = document.querySelector('body');
		_.header = _.body.querySelector('header');
		_.burgerCondition = false;

		document.querySelector('.head-burger-btn').addEventListener('click',_.burgerClick)

		_.init();
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

	burgerClick(){
		const _ = this;

		let burgerBtn = document.querySelector('.head-burger-btn');
		let headLinks = document.querySelectorAll('.head-burger-link');

		let oneTime = 100;
		let time = oneTime * headLinks.length;


		let int = _.burgerCondition ? headLinks.length - 1 : 0;
		let interval = setInterval(function () {
			if (!_.burgerCondition){
				headLinks[int].classList.add('active');
				int++;
			} else {
				headLinks[int].classList.remove('active');
				int--;
			}
		}, oneTime);

		burgerBtn.classList.toggle('active');
		_.burgerCondition = !_.burgerCondition;

		setTimeout(function (e) {
			clearInterval(interval)
		},time)
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
			let button = document.createElement('BUTTON');
			button.append(document.createElement('SPAN'));
			button.className = 'slider-control-btn';
			if (index === 0) button.classList.add('active');
			section.append(button);
		})
	}




	init(){
		const _ = this;
		_.sliderPrepare()
	}
}

let page = new Page();