export default class eventUrlCountdownClock {
	set endTime(endTime) { this.config.endTime = endTime; }
	get endTime(){ return this.config.endTime || new Date();}

	set interval(interval) { return this.config.interval = interval; }
	get interval(){ return this.config.interval || 1000;}

	set onChange(fn) { return this.config.onChange = fn; }
	get onChange(){ return this.config.onChange || ((time) => {})}

	constructor(config = {}) {
		this.config = config;
		this.updateClock();
		if(this.config.endTime) this.initInterval();
	}

	initInterval(){
		this.timeinterval = setInterval(this.updateClock.bind(this), this.interval);
	}

	update(endTime){
		clearInterval(this.timeinterval);
		this.endTime = endTime;
		this.updateClock();
		if(endTime) this.initInterval();
	}

	updateClock() {
		let timeRemaining = this.getTimeRemaining();
		this.onChange(timeRemaining);
		if (timeRemaining.total <= 0) clearInterval(this.timeinterval);
	}

	/*
  //Covert datetime by GMT offset
  //If toUTC is true then return UTC time other wise return local time
  convertLocalDateToUTCDate(date, toUTC) {
    date = new Date(date);
    //Local time converted to UTC
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    (toUTC)
      ? date = localTime + localOffset
      : date = localTime - localOffset;
    date = new Date(date);
    return date;
  }
  */

	getTimeRemaining() {
		let total = Date.parse(this.endTime) - Date.parse(new Date());
		if(total <= 0) total = 0;
		let seconds = Math.floor((total / 1000) % 60),
			minutes = Math.floor((total / 1000 / 60) % 60),
			hours = Math.floor((total / 3600000 /* (1000 * 60 * 60) */) % 24),
			days = Math.floor(total / 86400000 /* (1000 * 60 * 60 * 24) */),
			monthLeft = 0;
		//years = 0;

		let daysInMonth = function(year,month){
			var D=new Date(year, month-1, 1, 12);
			return parseInt((-Date.parse(D)+D.setMonth(D.getMonth()+1)+36e5)/864e5);
		};

		let today = new Date(),
			curr_day = today.getUTCDate(),
			curr_month = today.getUTCMonth(),
			curr_year = today.getUTCFullYear(),
			curr_days_in_month = daysInMonth(curr_year, curr_month);

		if(days > curr_days_in_month){
			let servYear = new Date(this.endTime).getUTCFullYear(),
				servMonth = new Date(this.endTime).getUTCMonth(),
				servDay = new Date(this.endTime).getUTCDate(),
				serv_days_in_month = daysInMonth(servYear, servMonth);

			monthLeft = Math.floor( days/daysInMonth(servYear,servMonth) );

			days = Math.abs(servDay - curr_day);

			/*if(monthLeft > 99){
        years = servYear - curr_year;
        monthLeft = monthLeft-1 - years*12;
        //console.log( 'monthLeft ',monthLeft );
      }*/
		}

		return {
			total,
			//years,
			monthLeft,
			days,
			hours,
			minutes,
			seconds
		};
	}
}
