import { MainEventBus } from "/workspace/front/libs/MainEventBus.lib.js";
import { Model } from "/workspace/front/components/main/Model.js";
import { View } from "/workspace/front/components/main/View.js";
import { Ctrl } from "/workspace/front/components/main/Ctrl.js";

class Front{
	constructor(){
		const _ = this;
		_.model = new Model();
		_.view = new View(_.model);
		_.ctrl = new Ctrl(_.model, _.view, {
			container: document.querySelector('body')
		});
		_.libs = new Map();
		_.components = new Map();

		//
		MainEventBus.add('Front','registerUser',_.registerUser.bind(_));
		MainEventBus.add('Front','frontLogin',_.frontLogin.bind(_));
		MainEventBus.add('Front','frontLogout',_.frontLogout.bind(_));
		MainEventBus.add('Front','changeMonth',_.changeMonth.bind(_));
		MainEventBus.add('Front','showPrivacy',_.showPrivacy.bind(_));
		MainEventBus.add('Front','closePrivacy',_.closePrivacy.bind(_));
		MainEventBus.add('Front','chooseLang',_.chooseLang.bind(_));
		MainEventBus.add('Front','openMenu',_.openMenu.bind(_));
		MainEventBus.add('Front','changeMethod',_.changeMethod.bind(_));
		MainEventBus.add('Front','checkEmail',_.checkEmail.bind(_));
		MainEventBus.add('Front','offName',_.offName.bind(_));
		///
		MainEventBus.add('Front','generateLink',_.generateLink.bind(_));
		MainEventBus.add('Front','copyLink',_.copyLink.bind(_));
		//
		MainEventBus.add('Front','createOrder',_.createOrder.bind(_));

		// ========================
		_.init();
		// ========================

		//console.log(MainEventBus)
	}
	async getModule(name,params,page=null){
		const _ = this;
		name = name.toLowerCase();
		if (_.components.has(name)) return _.components.get(name);
		let
				moduleStr = name.charAt(0).toUpperCase() + name.substr(1);
		const module = await import(`/workspace/front/components/${name}/${moduleStr}.js`);
		const modulName = new module[moduleStr](page, params);
		_.components.set(name, modulName);
		return Promise.resolve(modulName);
	}
	async getLib(name,params={}){
		const _ = this;
		name = name.toLowerCase();
		if (_.libs.has(name)) return _.libs.get(name);
		let
				moduleStr = name.charAt(0).toUpperCase() + name.substr(1);
		const module = await import(`/workspace/front/libs/${moduleStr}.lib.js`);
		const modulName = module[moduleStr];
		_.libs.set(name, modulName);
		return Promise.resolve(modulName);
	}
	formDataCapture(form){
		let
				outData = {},
				formElements = form.elements;
		for(let element of formElements){
			if(element.type == 'radio'){
				if (element.checked){
					outData[element.name] = element.value;
				}
			}else if (element.name){
				outData[element.name] = element.value;
			}
		}
		return outData;
	}
	async registerUser(e){
		const _ = this;
		let form = e.item,
				user = await _.getModule('user',{'container':document.querySelector('body')});

		let userData =  _.formDataCapture(form);
		let response = await user.registerUser(userData);
		console.log(response);
		if (response.status == 'success'){
			location.reload();
		}
	}
	async frontLogin(e){
		const _ = this;
		let form = e.item,
				auther = await _.getModule('auther',{'container':document.querySelector('body')});
		let authData= _.formDataCapture(form);
		let response = await auther.frontLogin(authData);
		if (response.status == 'success'){
			location.reload();
		}
	}
	async frontLogout(e){
		const _ = this;
		let form = e.item,
				auther = await _.getModule('auther',{'container':document.querySelector('body')});
		let authData= _.formDataCapture(form);
		let response = await auther.logout(authData);
		console.log(response);
		if (response.status == 'success'){
			location.reload();
		}
	}
	async changeSecond(e){
		const _ = this;
		console.log('test change')
		await _.getLib("Modaler");
		MainEventBus.trigger('Modaler','showModal',e.value)
	}

	headerMinimize(){
		window.addEventListener('scroll',function () {
			let scroll = window.pageYOffset;
			if(scroll > 0) document.querySelector('header').classList.add('head-scrolled')
			else {document.querySelector('header').classList.remove('head-scrolled')}
		})
	}

	changeMonth(){
		const _ = this;
		let monthSelect = document.querySelector('.birthday-month');
		let days = 31;
		if(monthSelect.value == 'april' || monthSelect.value == 'june' || monthSelect.value == 'september' || monthSelect.value == 'november'){
			days = 30;
		} else if (monthSelect.value == 'february'){
			days = 28;
		}
		_.fillDays(days);
	}
	fillDays(days){
		const _ = this;
		let daySelect = document.querySelector('.birthday-day');
		daySelect.innerHTML = '';
		for(let i = 1; i <= days; i++){
			let option = document.createElement('OPTION');
			let cnt = i;
			if(cnt < 10) cnt = '0' + cnt;
			option.textContent = option.value = cnt;
			daySelect.append(option);
		}
	}
	fillYear(){
		const _ = this;
		let yearSelect = document.querySelector('.birthday-year');
		let currentYear = new Date().getFullYear();
		for(let i = 0; i < 100; i++){
			let option = document.createElement('OPTION');
			option.textContent = option.value = parseInt(currentYear) - i;
			yearSelect.append(option);
		}
	}

	fillCardYear(){
		let select = document.getElementById('cardYear'),
			currentYear = new Date().getFullYear();
		if(select){
			for(let i = 0; i < 10; i++){
				let option = document.createElement('OPTION');
				option.value = option.textContent = currentYear + i;
				select.append(option);
			}
		}
	}

	chooseLang(clickObj){
		clickObj['event'].preventDefault();
		let pageSelect = document.querySelector('.page-select');
		pageSelect.classList.toggle('open')
	}
	openMenu(){
		let cabList = document.querySelector('.cabinet-list');
		cabList.classList.toggle('cabinet-hidden')
	}

	showPrivacy(){
		let privacyPage = document.querySelector('.privacy-page');
		if(document.querySelector('#header')) document.querySelector('#header').classList.add('display-none');
		if(document.querySelector('.reg')) {
			document.querySelectorAll('.reg').forEach(function (el) {
				el.classList.add('display-none');
			})
		}
		if(document.querySelector('.partner-page')){
			document.querySelectorAll('.partner-page').forEach(function (el) {
				el.classList.add('display-none')
			})
		}
		privacyPage.classList.remove('display-none');
	}
	closePrivacy(){
		let privacyPage = document.querySelector('.privacy-page');
		if(document.querySelector('#header')) document.querySelector('#header').classList.remove('display-none');
		if(document.querySelector('.reg')){
			let arr = document.querySelectorAll('.reg');
			arr[0].classList.remove('display-none');
		}
		if(document.querySelector('.partner-page')){
			let arr = document.querySelectorAll('.partner-page');
			arr[0].classList.remove('display-none');
		}
		privacyPage.classList.add('display-none');
	}

	chooseCountry(){
		let country = document.querySelector('.reg-datalist');
		if(country){
			let
				cashed = false,
				countryList = document.querySelector('.reg-country-list'),
				countryListItems = [],
				countryNewList = [];
			country.onclick = function (){
				let countryList = document.querySelector('.reg-country-list');
				if(!cashed){
					let
						outList = '',
						items = countryList.querySelectorAll('li');
					items.forEach(function (el) {
						let li = `
							<li>
								<button type="button" data-value="${el.dataset.value}" data-id="${el.dataset.id}">
									<img src="img/flags/${el.dataset.img}" class="lazyload" alt="">
									<span>${el.dataset.country}</span>
								</button>
							</li>
                    	`;
						outList += li;
					});
					countryList.innerHTML = outList;
					countryListItems = countryList.querySelectorAll('li');
					cashed = true;
				}
				countryList.classList.toggle('reg-country-list-active');
			}
			countryList.addEventListener('click',function(e){
				let element = e.target;
				if(!(element.tagName == "BUTTON") ){
					while(element.tagName != 'BUTTON'){
						element = element.parentNode;
					}
				}
				let
					listImg = element.querySelector('img'),
					img = country.querySelector('img'),
					input = country.querySelector('input[type="text"]'),
					inputCountry = country.querySelector('input[type="hidden"]');
				img.setAttribute('src',listImg.getAttribute('src'));
				input.setAttribute('data-value', element.getAttribute('data-value'));
				inputCountry.value = element.getAttribute('data-id');
				input.value = element.querySelector('span').textContent;
				if(countryList.classList.contains('reg-country-list-active')){
					countryList.classList.remove('reg-country-list-active')
				}
				let countryShowCont = document.querySelector('.reg-country');
				let countryBlock = countryShowCont.querySelector('.reg-block');
				if(countryBlock.classList.contains('error')){
					countryBlock.classList.remove('error')
				}
				countryBlock.classList.add('success');
			});
			country.querySelector('input[type="text"]').addEventListener('keyup',function(e){
				if(e.keyCode === 40){
					countryList.children[0].querySelector('button').focus();
				}
			});
			countryList.addEventListener('keyup',function(e){
				let
					elem = document.activeElement,
					nextLi = '',
					outLi = elem.parentNode;
				if(e.keyCode === 40){
					if(!outLi.nextElementSibling) return;
					nextLi = outLi.nextElementSibling;
				}
				if(e.keyCode === 38){
					if(!outLi.previousElementSibling) return;
					nextLi = outLi.previousElementSibling;
				}
				if(nextLi){
					nextLi.querySelector('button').focus();
				}
			});
			country.querySelector('input[type="text"]').addEventListener('input',function(e){
				let inputValue = this.value;
				if(!countryList.classList.contains('reg-country-list-active')){
					countryList.classList.add('reg-country-list-active');
				}
				countryNewList = [];
				countryListItems.forEach(function (li){
					let span = li.querySelector('span'),
						str = '' + span.textContent,
						finded = str.search(inputValue);
					if(finded > -1){
						countryNewList.push(li);
					}
				});
				countryList.innerHTML = '';
				countryNewList.forEach(function(li){
					countryList.append(li);
				});
				let img = country.querySelector('img');
				img.setAttribute('src','');
				country.querySelector('input').setAttribute('data-value','')
				let countryShowCont = document.querySelector('.reg-country');
				let countryBlock = countryShowCont.querySelector('.reg-block');
				if(countryBlock.classList.contains('success')){
					countryBlock.classList.remove('success')
				}
				countryBlock.classList.add('error');
			});
		}
	}

	changeMethod(){
		let form = [
			document.querySelector('.main-method'),
			document.querySelector('.ref-method'),
			document.querySelector('.aff-method'),
			document.querySelector('.con-method')
		]
		form.forEach(function (el) {
			if(el){
				el.classList.toggle('display-none')
			}
		})
	}

	async generateLink(clickObj){
		const _ = this;
		let btn= clickObj['item'],
				uId = btn.dataset.uid,
				type = btn.dataset.type,
				user = await _.getModule('user',{'container':document.querySelector('body')});
		let response = await user.generateLink({
			'uId': uId,
			'type': type
		});
		let userLink = document.querySelector('.user-link b');
		userLink.textContent = response['data']['link_text'];
	}
	copyLink(clickObj){
		let path =  document.querySelector('.user-link'), //clickObj['item'],
				range = document.createRange();
		range.selectNode(path);
		let selected = window.getSelection();
		selected.removeAllRanges();
		selected.addRange(range);
		let copied = document.execCommand('copy');
		if (copied){
			alert('Yeah');
		}
	}

	checkConfirm(email,cemail){
		if(email.value === cemail.value) return true;
		else return false;
	}

	async offName(e){
		const _ = this;
		let check = e,
			input = check.previousElementSibling;
		if(check.checked){
			input.setAttribute('disabled','disabled');
			input.setAttribute('data-value',input.value);
			input.value = '';
		} else {
			input.removeAttribute('disabled');
			input.value = input.getAttribute('data-value');
		}
	}

	async checkEmail(e){
		const _ = this;
		let form = e.item,
			email = form.elements['email'],
			cemail = form.elements['cemail'];
		if(_.checkConfirm(email,cemail)){
			let response = await _.requestEmail(email);
			if(!response.data.u_id){

				let firstPage = document.querySelector('.reg-email'),
					secondPage = document.querySelector('.reg-continue');
				firstPage.classList.add('display-none');
				secondPage.classList.remove('display-none');
				email.setAttribute('type','hidden');
				secondPage.append(email);
			} else {
				location.reload();
			}
		} else {
			let parent = cemail.parentElement;
			parent.classList.add('error');
			let error = parent.querySelector('.reg-block-title span');
			error.textContent = 'email not confirmed';
			console.log(parent);
		}
	}

	async requestEmail(email){
		const _ = this;
		let auther = await _.getModule('auther',{'container':document.querySelector('body')}),
			response = await auther.frontCheckLogin(
			{
				login:email.value
			}
		)
		return response;
	}
	async createOrder(submitData){
		const _ = this;
		let form = submitData['item'],
				formData = _.formDataCapture(form),
				crm = await _.getModule('crm',{'container':document.querySelector('body')});
		console.log(crm);
		console.log(await crm.createOrder(formData));
	}
	init(){
		const _ = this;
		if(document.querySelector('.birthday-year')){
			_.changeMonth();
			_.fillYear();
		}
		_.chooseCountry();
		_.headerMinimize();
		_.fillCardYear();
	}

}
new Front();



