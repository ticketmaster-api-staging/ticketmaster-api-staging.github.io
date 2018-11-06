import lodashOmit from 'lodash/omit';

import CountdownClock from './CountdownClock';
import widgetAnalytics, {
  EVENT_CATEGORY,
  CUSTOM_DIMENSIONS,
  EVENT_NAME,
} from 'helpers/widgets-analytics';
import universePlugin from 'helpers/universe-plugin';

const MAX_REPEATED_REQUESTS = 15;

export default class TicketmasterCountdownWidget {

	set config(attrs) { this.widgetConfig = this.loadConfig(attrs); }
	get config() { return this.widgetConfig; }

	set event(responce){ this.eventResponce = this.parseEvent(responce);}
	get event(){ return this.eventResponce;}

	get borderSize(){ return this.config.border || 0;}

	get eventUrl(){ return "http://www.ticketmaster.com/event/"; }

	set eventId(id){ this.config.id = id;}
	get eventId(){ return this.config.id;}

	get apiUrl(){ return 'https://app.ticketmaster.com/discovery-widgets/v2/events'; }

	get themeUrl() {
		return (window.location.host === 'developer.ticketmaster.com')
			? `https://developer.ticketmaster.com/products-and-docs/widgets/countdown/1.0.0/theme/`
			: `https://ticketmaster-api-staging.github.io/products-and-docs/widgets/countdown/1.0.0/theme/`;
	}

	get isFullWidth() { return this.config.proportion === 'fullwidth';}

	get portalUrl(){
		return (window.location.host === 'developer.ticketmaster.com')
			? `https://developer.ticketmaster.com/`
			: `https://ticketmaster-api-staging.github.io/`;
	}

	get logoUrl() { return "https://www.ticketmaster.com/"; }

	get legalNoticeUrl() { return "http://developer.ticketmaster.com/support/terms-of-use/"; }

	get widgetVersion() { return `${__VERSION__}`; }

	get questionUrl() { return "http://developer.ticketmaster.com/support/faq/"; }

	get updateExceptions() { return ["width", "height", "border", "borderradius", "layout", "propotion", "seconds"]}

	get hideMessageDelay(){ return 5000; }

	get tmWidgetWhiteList(){ return ["2200504BAD4C848F", "00005044BDC83AE6", "1B005068DB60687F", "1B004F4DBEE45E47", "3A004F4ED7829D5E", "3A004F4ED1FC9B63", "1B004F4FF83289C5", "1B004F4FC0276888", "0E004F4F3B7DC543", "1D004F4F09C61861", "1600505AC9A972A1", "22004F4FD82795C6", "01005057AFF54574", "01005056FAD8793A", "3A004F4FB2453240", "22004F50D2149AC6", "01005059AD49507A", "01005062B4236D5D"]; }

  repeatedRequestsCount = 0;

	isConfigAttrExistAndNotEmpty(attr) {
		if( !this.config.hasOwnProperty(attr) || this.config[attr] === "undefined"){
			return false;
		}else if( this.config[attr] === ""){
			return false;
		}
		return true;
	}

	get eventReqAttrs(){
		let attrs = {},
			params = [
				{
					attr: 'tmapikey',
					verboseName: 'apikey'
				},
        {
          attr: 'id',
          verboseName: 'id'
        }
			];

		for(let i in params){
			let item = params[i];
			if(this.isConfigAttrExistAndNotEmpty(item.attr))
				attrs[item.verboseName] = this.config[item.attr];
		}

		return attrs;
	}

	constructor(root) {
		this.widgetRoot = root;

		this.eventsRootContainer = document.createElement("div");
		this.eventsRootContainer.classList.add("events-root-container");
		this.widgetRoot.appendChild(this.eventsRootContainer);

		this.eventsRoot = document.createElement("ul");
		this.eventsRoot.classList.add("events-root");
		this.eventsRootContainer.appendChild(this.eventsRoot);

		this.config = this.widgetRoot.attributes;
		this.eventId = this.config.id;

		if(this.config.theme !== null && !document.getElementById(`widget-theme-${this.config.theme}`)){
      this.addStylesheetForWidgetTheme();
		}

		this.widgetRoot.style.height = `${this.config.height}px`;
		this.widgetRoot.style.width  = `${this.config.width}px`;

		this.eventsRootContainer.style.height = `${this.config.height}px`;
		this.eventsRootContainer.style.width  = `${this.config.width}px`;
		this.eventsRootContainer.style.borderRadius = `${this.config.borderradius}px`;
		this.eventsRootContainer.style.borderWidth = `${this.borderSize}px`;

		this.initBuyBtn();

		this.AdditionalElements();

		this.initMessage();

		this.buildCountdown();

		if(this.apiUrl && this.eventId){
			this.makeRequest( this.eventsLoadingHandler, `${this.apiUrl}/${this.eventId}`, this.eventReqAttrs );
		}else{
			this.showMessage("Please enter event ID.", true, null );
		}

		universePlugin.embedUniversePlugin();

		this.countDownWrapper.classList.add("events-count-down");

		this.countdownClock = new CountdownClock({
			onChange: this.onCountdownChange.bind(this)
		});

		this.toggleSecondsVisibility();

		if (this.isFullWidth) { this.initFullWidth(); }

    this.defaultAnalyticsProperties = {
      eventCategory: EVENT_CATEGORY.COUNTDOWN_WIDGET,
      [CUSTOM_DIMENSIONS.API_KEY]: this.eventReqAttrs.apikey,
    };

    widgetAnalytics.sendEvent({
      eventAction: EVENT_NAME.RENDERED,
      ...this.defaultAnalyticsProperties,
    });
	}

	getNormalizedDateValue(val){
		return (val < 0 || val > 9 ? "" : "0") + val
	}

	toggleSecondsVisibility(){
		if(this.countDownMonth.innerHTML > 0){
			this.countDownWrapper.classList.add("hide-seconds");
			this.countDownWrapper.classList.remove("hide-days");
			this.countDownWrapper.classList.remove("hide-month");//Removing a class that does not exist, does NOT throw an error
		}else if(this.countDownDays.innerHTML <= 0){
			this.countDownWrapper.classList.add("hide-month");
			this.countDownWrapper.classList.add("hide-days");
			this.countDownWrapper.classList.remove("hide-seconds");
		}else {
			this.countDownWrapper.classList.add("hide-month");
			this.countDownWrapper.classList.remove("hide-days");
			this.countDownWrapper.classList.remove("hide-seconds");
		}
	}

	showStatusMessage(data){
		let me = this;
		if(this.event.date && this.event.date.dateTime){
			chenHeaderEvent(this.event.date);
		}

		function chenHeaderEvent(eventT){
			let now = new Date(),
				msecsNow = Date.parse(now),
				eventDateStart = new Date(eventT.dateTime),
				msecsStart = Date.parse(eventDateStart),
				eventDateEnd = new Date(eventT.dateTimeEnd),
				msecsEnd = Date.parse(eventDateEnd);

			if (msecsNow > msecsEnd || isNaN(msecsEnd)) {
				me.showMessage(`This event has taken place`, false , "event-message-started");
			} else if (msecsStart < msecsNow < msecsEnd) {
				me.showMessage(`Event is in progress`, false , "event-message-started");
			}
		}
	}

	onCountdownChange(data){
		let timeLeft = this.getNormalizedDateValue(data.total),
			now = Date.parse( new Date() );

		/*toggle CountDown-Box Visibility*/
		if(timeLeft <= 0 || now < timeLeft){
			this.countDownWrapper.classList.add("hide-countDownBox");
			if(this.eventId && this.event){
				this.showStatusMessage(data);
				return false; //exit if event has taken place
			}
		}else this.countDownWrapper.classList.remove("hide-countDownBox");

		if(data.monthLeft > 99){
			this.showMessage(`This event starts in more than ${data.monthLeft} month, ${data.days} days, ${data.hours} hours`, false , "event-message-started");
			this.countDownWrapper.classList.add("hide-countDownBox");
			return false;
		}

		this.countDownMonth.innerHTML = this.getNormalizedDateValue(data.monthLeft);
		this.countDownDays.innerHTML = this.getNormalizedDateValue(data.days);
		this.countDownHours.innerHTML = this.getNormalizedDateValue(data.hours);
		this.countDownMinute.innerHTML = this.getNormalizedDateValue(data.minutes);
		this.countDownSecond.innerHTML = this.getNormalizedDateValue(data.seconds);

		this.toggleSecondsVisibility();

	}

	buildCountdown(){
		this.countDownWrapper = document.createElement("div");
		this.countDownWrapper.classList.add("events-count-down");
		this.countDownMonth = document.createElement("span");
		this.countDownDays = document.createElement("span");
		this.countDownHours = document.createElement("span");
		this.countDownMinute = document.createElement("span");
		this.countDownSecond = document.createElement("span");

		this.countDownMonth.innerHTML = '00';
		this.countDownDays.innerHTML = '00';
		this.countDownHours.innerHTML = '00';
		this.countDownMinute.innerHTML = '00';
		this.countDownSecond.innerHTML = '00';

		this.countDownMonth.classList.add("events-count-down__month");
		this.countDownDays.classList.add("events-count-down__day");
		this.countDownHours.classList.add("events-count-down__hour");
		this.countDownMinute.classList.add("events-count-down__minute");
		this.countDownSecond.classList.add("events-count-down__second");

		this.countDownWrapper.appendChild(this.countDownMonth);
		this.countDownWrapper.appendChild(this.countDownDays);
		this.countDownWrapper.appendChild(this.countDownHours);
		this.countDownWrapper.appendChild(this.countDownMinute);
		this.countDownWrapper.appendChild(this.countDownSecond);

		this.eventsRootContainer.appendChild(this.countDownWrapper);
	}

	initBuyBtn(){
		this.buyBtn = document.createElement("a");
		this.buyBtn.appendChild(document.createTextNode('BUY NOW'));
		this.buyBtn.classList.add("event-buy-btn");
		this.buyBtn.target = '_blank';
		this.buyBtn.href = '';
		this.buyBtn.addEventListener('click', (e) => {
      ga('send', 'event', 'CountdownClickBuyButton', 'click');
      widgetAnalytics.sendEvent({
        eventAction: EVENT_NAME.BUY_BUTTON_CLICK,
        eventLabel: this.buyBtn.href,
        ...this.defaultAnalyticsProperties,
      });
		});
		this.eventsRootContainer.appendChild(this.buyBtn);
	}

	setBuyBtnUrl(){
		if(this.buyBtn && this.event && this.event.url){
      this.buyBtn.href = this.event.url;
		}
	}

	// Message
	initMessage(){
		this.messageDialog = document.createElement('div');
		this.messageDialog.classList.add("event-message");
		this.messageContent = document.createElement('div');
		this.messageContent.classList.add("event-message__content");

		/*let messageClose = document.createElement('div');
    messageClose.classList.add("event-message__btn");
    messageClose.addEventListener("click", ()=> {
      this.hideMessage();
    });*/

		this.messageDialog.appendChild(this.messageContent);
		/*this.messageDialog.appendChild(messageClose);*/
		this.eventsRootContainer.appendChild(this.messageDialog);
	}

	showMessage(message, hideMessageWithoutDelay , /*string togleClassName*/className ){
		if(message.length){
			this.hideMessageWithoutDelay = hideMessageWithoutDelay;
			this.messageContent.innerHTML = message;
			this.messageDialog.className = "";
			this.messageDialog.classList.add("event-message");
			this.messageDialog.classList.add("event-message-visible");
			// this.messageDialog.classList.remove("event-message-started");
		}

		if( className ){
			this.messageDialog.classList.add(className);
		}else {
			this.messageDialog.classList.add("event-message-visible");
			this.messageDialog.classList.remove(className);
		}

		className = null;

	}

	hideMessage(){
		if(this.messageTimeout) clearTimeout(this.messageTimeout); // Clear timeout and hide message immediately.
		this.messageDialog.classList.remove("event-message-visible");
	}
	// End message

	AdditionalElements(){
		var legalNoticeContent = document.createTextNode('Legal Notice'),
			legalNotice = document.createElement("a");
		legalNotice.appendChild(legalNoticeContent);
		legalNotice.classList.add("legal-notice");
		legalNotice.target = '_blank';
		legalNotice.href = this.legalNoticeUrl;
		this.widgetRoot.appendChild(legalNotice);

		var logo = document.createElement('a');
		logo.classList.add("event-logo","right-logo");
		logo.target = '_blank';
		logo.href = this.logoUrl;
		logo.innerHTML = 'Powered by ';

		var logoBox = document.createElement('div');
		logoBox.classList.add("event-logo-box");
		logoBox.appendChild(logo);
		this.eventsRootContainer.appendChild(logoBox);

		let question = document.createElement('span'),
			toolTip = document.createElement('div'),
			tooltipHtml = `
				<div class="tooltip-inner"> 
					<a href="${this.questionUrl}" target = "_blank" >About widget</a>
					<div class="place">version: <b>${this.widgetVersion}</b></div>
				</div>`;
		question.classList.add("event-question");
		question.addEventListener('click', toolTipHandler);
		toolTip.classList.add("tooltip-version");
		toolTip.classList.add("left");
		toolTip.innerHTML = tooltipHtml;
		this.eventsRootContainer.appendChild(question);
		this.eventsRootContainer.appendChild(toolTip);

		function toolTipHandler(e) {
			e.preventDefault();
			e.target.nextSibling.classList.toggle('show-tip');
		}
	}

	formatDate(date) {
		var result = '';
		if(!date.day) return result; // Day is required

		var MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
			dayArray = date.day.split('-'),
			d = parseInt(dayArray[2]),
			M = parseInt(dayArray[1]);

		// var E = new Date(date.day).getDay();
		var E = new Date(+date.day.split('-')[0],(+date.day.split('-')[1])-1,+date.day.split('-')[2]).getDay();
		result = DAY_NAMES[E] + ', ' + MONTH_NAMES[M - 1] + ' ' + d + ', ' + dayArray[0];

		if(!date.time) return result;

		var timeArray = date.time.split(':'),
			H = parseInt(timeArray[0]),
			m = timeArray[1],
			a = "AM";

		if (H > 11) a = "PM";
		if (H === 0) {
			H = 12;
		} else if (H > 12) {
			H = H - 12;
		}

		return result + ' ' + this.getNormalizedDateValue(H) + ':' + m + ' ' + a;
	}

	clearEvents(){
		this.eventsRoot.innerHTML = "";
	}

	clear(){
		var modificatorList = this.widgetRoot.getElementsByClassName('modificator');
		while (modificatorList.length) {
			let el = modificatorList[0],
				parent = el.parentNode;
			parent.removeChild(el);
		}
		this.clearEvents();
	}

	update(isFullWidthTheme) {

		let oldTheme = this.config.constructor();
		for (let attr in this.config) {
			if (this.config.hasOwnProperty(attr)) oldTheme[attr] = this.config[attr];
		}

		this.config = this.widgetRoot.attributes;
		this.widgetRoot.style.height = `${this.config.height}px`;
		this.widgetRoot.style.width  = `${this.config.width}px`;
		this.eventsRootContainer.style.height = `${this.config.height}px`;
		this.eventsRootContainer.style.width  = `${this.config.width}px`;
		this.eventsRootContainer.style.borderRadius = `${this.config.borderradius}px`;
		this.eventsRootContainer.style.borderWidth = `${this.borderSize}px`;



		if(this.needToUpdate(this.config, oldTheme, this.updateExceptions) || isFullWidthTheme){
			this.clear();

			if(this.config.theme !== null){
				//set new styles
				this.makeRequest( this.styleLoadingHandler, this.themeUrl + this.config.theme + ".css" );
			}

			if(this.widgetConfig.theme !== 'simple_countdown') {
				let heightStatic = '700px';
				//draw inline style
				//border
				this.eventsRootContainer.style.borderRadius = `${this.config.borderradius}px`;
				this.eventsRootContainer.style.borderWidth = `${this.borderSize}px`;

				//set width
				this.widgetRoot.style.width = `100%`;
				this.widgetRoot.style.height = heightStatic;
				this.widgetRoot.style.display = `block`;
				this.eventsRootContainer.style.width  = `100%`;
				this.eventsRootContainer.style.height = heightStatic;
				this.widgetConfig.width = `100%`;
			}

			/*if( this.themeModificators.hasOwnProperty( this.widgetConfig.theme ) ) {
        this.themeModificators[ this.widgetConfig.theme ]();
      }*/

			if(this.apiUrl && this.eventId){
				this.makeRequest( this.eventsLoadingHandler, this.apiUrl, this.eventReqAttrs );
			}else{
				// this.showMessage("No results were found.", true);
				this.showMessage("No events were found", true, 'cactus');
				this.countdownClock.update(null);
			}
		}else{
			let events = this.widgetRoot.getElementsByClassName("event-wrapper");
			for(let i in events){
				if(events.hasOwnProperty(i) && events[i].style !== undefined){
					events[i].style.width = `${this.config.width - this.borderSize * 2}px`;
					events[i].style.height = `${this.config.height - this.borderSize * 2}px`;
				}
			}
		}

		if (this.isFullWidth) { this.initFullWidth(); }
		//this.toggleSecondsVisibility();
	}

	needToUpdate(newTheme, oldTheme, forCheck = []){
		return Object.keys(newTheme).map(function(key){
			if(forCheck.indexOf(key) > -1) return true;
			//console.warn([key, newTheme[key], oldTheme[key], newTheme[key] === oldTheme[key]])
			return newTheme[key] === oldTheme[key] ;
		}).indexOf(false) > -1
	}

	loadConfig(NamedNodeMap){
		var config = {};
		Object.keys(NamedNodeMap).map(function(value){
			if( typeof(NamedNodeMap[value].name) !== "undefined" && NamedNodeMap[value].name.indexOf("w-") !== -1){
				config[ NamedNodeMap[value].name.replace(/w-/g, "").replace(/-/g, "") ] = NamedNodeMap[value].value;
			}
		});
		return config;
	}

  addStylesheetForWidgetTheme() {
    const styleLinkElem = document.createElement('link');
    styleLinkElem.setAttribute('rel', 'stylesheet');
    styleLinkElem.setAttribute('type', 'text/css');
    styleLinkElem.setAttribute('href', `${this.themeUrl}${this.config.theme}.css`);
    styleLinkElem.setAttribute('id', `widget-theme-${this.config.theme}`);
    document.getElementsByTagName('head')[0].appendChild(styleLinkElem);
  }

	onEventLoadError(){
	  if(this.repeatedRequestsCount <= MAX_REPEATED_REQUESTS) {
      const REPEATED_REQUEST_DELAY = Math.round(Math.random()*1000+500);

      setTimeout(() => {
        this.makeRequest(this.eventsLoadingHandler, `${this.apiUrl}/${this.eventId}`, this.eventReqAttrs);
      }, REPEATED_REQUEST_DELAY);

      this.repeatedRequestsCount++;
    } else {
      this.showMessage("No results were found.", true, null);
    }

	}

	eventsLoadingHandler(){
		let widget = this.widget;
		widget.clearEvents(); // Additional clearing after each loading
		if (this && this.readyState == XMLHttpRequest.DONE ) {
			if(this.status == 200){
				widget.event = JSON.parse(this.responseText);
				if(widget.event){
					widget.publishEvent(widget.event);
					widget.hideMessage();
				}
			}
			else if(this.status == 400) {
				widget.onEventLoadError.call(widget, this.status);
			}
			else {
				widget.onEventLoadError.call(widget, this.status);
			}
			// http://js2coffee.thomaskalka.de/ - widget.event?.date?.dateTime
			let _ref, _ref2;
			widget.countdownClock.update((_ref = widget.event) != null ? (_ref2 = _ref.date) != null ? _ref2.dateTime || _ref2.day : void 0 : void 0);
		}
		widget.setBuyBtnUrl();
	}

	publishEvent(event, parentNode){
		parentNode = parentNode || this.eventsRoot;
		let DOMElement = this.createDOMItem(event);
		parentNode.appendChild(DOMElement);
	}

	getImageForEvent(images){
		var width = this.config.width,
			height = this.config.height;

		if(width === '100%') { width = this.widgetRoot.offsetWidth }
		images.sort(function(a,b) {
			if (a.width < b.width)
				return -1;
			else if (a.width > b.width)
				return 1;
			else
				return 0;
		});

		var myImg = "";
		images.forEach(function(element){
			if(element.width >= width && element.height >= height && !myImg){
				myImg = element.url;
			}
		});
		if(myImg === "") {
			myImg = images[images.length-1].url;
		}
		return myImg;
	}

	parseEvent(eventSet){
		if(!eventSet.id){
			return false;
		}

		let currentEvent = {};

		currentEvent.id = eventSet.id;
		currentEvent.url = eventSet.url;
		currentEvent.name = eventSet.name;

		currentEvent.date = {
			day: eventSet.dates.start.localDate,
			time: eventSet.dates.start.localTime,
			dateTime: eventSet.dates.start.dateTime
		};

		if(eventSet.dates.end){
			(eventSet.dates.end.localDate) ? currentEvent.date.dayEnd = eventSet.dates.end.localDate : '';
			(eventSet.dates.end.localTime) ? currentEvent.date.timeEnd = eventSet.dates.end.localTime : '';
			(eventSet.dates.end.dateTime) ? currentEvent.date.dateTimeEnd = eventSet.dates.end.dateTime : '';
		}

		if(eventSet.hasOwnProperty('_embedded') && eventSet._embedded.hasOwnProperty('venues')){
			let venue = eventSet._embedded.venues[0];
			if(venue){
				if(venue.address)
					currentEvent.address = venue.address;

				if(venue.name){
					if(!currentEvent.address) currentEvent.address = {};
					currentEvent.address.name = venue.name;
				}
			}
		}

		currentEvent.img = this.getImageForEvent(eventSet.images);
		return currentEvent;
	}

	changeDefaultId(){
		Date.prototype.addDays = function(days) {
			this.setDate(this.getDate() + parseInt(days));
			return this;
		};
		let zipVegas='89109',
			url=`https://app.ticketmaster.com/discovery-widgets/v2/events.json`,
			newAttr = Object.assign({},this.eventReqAttrs),
			d = new Date(0),
			convertedNewStartDate;

		d.setUTCSeconds(Math.round(new Date().addDays(30).getTime())/1000);
		convertedNewStartDate = d.toJSON().slice(0,17)+'00Z';
		if(d.toJSON().length <= 20) convertedNewStartDate = d.toJSON();
		newAttr.startDateTime = convertedNewStartDate;
		newAttr.zipcode = zipVegas;

		this.makeRequest(this.changeDefaultIdHandler, url, newAttr );
	}

	changeDefaultIdHandler(){
		function getValidId(events){
			let id = '',
				newStartDate = new Date().addDays(30);

			for(let ii=0;ii<events.length;ii++){
				if ( Math.round(new Date(events[ii].dates.start.dateTime).getTime()/1000) >= Math.round(new Date(newStartDate).getTime()/1000) ){
					id = events[ii].id;
					break;
				}
			}
			return id;
		}
		function setEventId(){
			return ()=> this.makeRequest( this.eventsLoadingHandler, this.apiUrl, this.eventReqAttrs );
		}
		let widget = this.widget;
		let loadOnce = false;
		widget.clearEvents(); // Additional clearing after each loading

		if (this && this.readyState == XMLHttpRequest.DONE ) {
			if(this.status == 200 && this.responseText != ''){
				let eventsWrap = JSON.parse(this.responseText);
				if(eventsWrap){
					let events = eventsWrap['_embedded']['events'],
						newId = getValidId(events);
					widget.eventId = newId;
					if(document.getElementById('w-id')){
						document.getElementById('w-id').value = widget.eventId;
					}
					setEventId.call(widget,newId)();
				}
			}
			else if(this.status == 400) {
				loadOnce = true;
				widget.onEventLoadError.call(widget, this.status,loadOnce);
			}
			else {
				console.log('this error',this);
				loadOnce = true;
				widget.onEventLoadError.call(widget, this.status,loadOnce);
			}
			// http://js2coffee.thomaskalka.de/ - widget.event?.date?.dateTime
			let _ref, _ref2;
			widget.countdownClock.update((_ref = widget.event) != null ? (_ref2 = _ref.date) != null ? _ref2.dateTime || _ref2.day : void 0 : void 0);
		}
		widget.setBuyBtnUrl();

	}

	makeRequest(handler, url=this.apiUrl, attrs={}, method="GET"){
	  //TODO: This method does too many things, and is not reusable. Refactor it in a way where it would not violate the single responsibility principle
	  const paramsWithoutEventID = lodashOmit(attrs, 'id');
		const params = Object.keys(paramsWithoutEventID).map(function(key){
			return `${key}=${paramsWithoutEventID[key]}`;
		}).join("&");

		const requestUrl = `${url}?${params}`;

		this.xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		if(method == "POST") {
			this.xmlHTTP.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		}
		this.xmlHTTP.widget = this;
		this.xmlHTTP.onreadystatechange = handler;
		this.xmlHTTP.open(method, requestUrl, true);
		this.xmlHTTP.send();
	}

	initPretendedLink(el, url, isBlank){
		if(el && url){
			el.setAttribute('data-url', url);
			el.classList.add("event-pretended-link");
			el.addEventListener('click', function(){
				let url = this.getAttribute('data-url');
				if(url){
					let win = window.open(url, (isBlank ? '_blank' : '_self'));
					win.focus();
				}
			});
		}
		return el;
	}

	initFullWidth(){
		let heightStatic = 700;
		this.config.width = `100%`;
		this.config.height = heightStatic;
		this.widgetRoot.style.width = `100%`;
		this.widgetRoot.style.height = heightStatic + 'px';
		this.widgetRoot.style.display = `block`;
		this.eventsRootContainer.style.width  = `100%`;
		this.eventsRootContainer.style.height = `${this.widgetContentHeight}px`;
	}

	createDOMItem(itemConfig){
		var medWrapper = document.createElement("div");
		medWrapper.classList.add("event-content-wraper");

		var event = document.createElement("li");
		event.classList.add("event-wrapper");
		event.style.height = `${this.config.height - this.borderSize * 2}px`;
		event.style.width  = (!this.isFullWidth) ? `${this.config.width - this.borderSize * 2}px` : `100%`;

		var image = document.createElement("span");
		image.classList.add("bg-cover");
		image.style.backgroundImage = `url('${itemConfig.img}')`;
		event.appendChild(image);

		var nameContent = document.createTextNode(itemConfig.name),
			name = document.createElement("span");
		name.classList.add("event-name");
		name.appendChild(nameContent);
		this.initPretendedLink(name, itemConfig.url, true);
		name.addEventListener('click', (e) => {
      e.preventDefault();
      ga('send', 'event', 'CountDownClickeventName', 'click', itemConfig.url);
      widgetAnalytics.sendEvent({
        eventAction: EVENT_NAME.EVENT_NAME_CLICK,
        eventLabel: itemConfig.url,
        ...this.defaultAnalyticsProperties,
      });
    })
		medWrapper.appendChild(name);

		var dateTimeContent = document.createTextNode(this.formatDate(itemConfig.date)),
			dateTime = document.createElement("span");
		dateTime.classList.add("event-date");
		dateTime.appendChild(dateTimeContent);

		var dateWraper = document.createElement("span");
		dateWraper.classList.add("event-date-wraper");
		dateWraper.appendChild(dateTime);
		medWrapper.appendChild(dateWraper);

		if(itemConfig.hasOwnProperty("address")){
			var addressWrapper = document.createElement("span");
			addressWrapper.classList.add("address-wrapper");

			if( itemConfig.address.hasOwnProperty("name") ){
				var addressNameText = document.createTextNode(itemConfig.address.name),
					addressName =  document.createElement("span");
				addressName.classList.add("event-address");
				addressName.classList.add("event-address-name");
				addressName.appendChild(addressNameText);
				addressWrapper.appendChild(addressName);
			}

			if( itemConfig.address.hasOwnProperty("line1") ){
				var addressOneText = document.createTextNode(itemConfig.address.line1),
					addressOne =  document.createElement("span");
				addressOne.classList.add("event-address");
				addressOne.appendChild(addressOneText);
				addressWrapper.appendChild(addressOne);
			}

			if( itemConfig.address.hasOwnProperty("line2") ){
				var addressTwoText = document.createTextNode(itemConfig.address.line2),
					addressTwo =  document.createElement("span");
				addressTwo.classList.add("event-address");
				addressTwo.appendChild(addressTwoText);
				addressWrapper.appendChild(addressTwo);
			}

			medWrapper.appendChild(addressWrapper);
		}

		if(itemConfig.hasOwnProperty("categories")) {
			var categoriesWrapper = document.createElement("span");
			categoriesWrapper.classList.add("category-wrapper");

			itemConfig.categories.forEach(function (element) {
				var categoryText = document.createTextNode(element),
					category = document.createElement("span");
				category.classList.add("event-category");
				category.appendChild(categoryText);
				categoriesWrapper.appendChild(category);
			});
			medWrapper.appendChild(categoriesWrapper);
		}

		event.appendChild(medWrapper);

		return event;
	}

	/*
   * Config block
   */
	/*
  decConfig(config){
    return JSON.parse(window.atob(config));
  }
  encConfig(config){
    return window.btoa(config);
  }
  */

}
