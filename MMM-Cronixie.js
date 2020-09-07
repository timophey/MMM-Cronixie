/* Magic Mirror
 * Module: HelloWorld
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("MMM-Cronixie", {
	// Default module config.
	defaults: {
		width: "90vw",
		orientation: "landscape", // landscape | not!portrait
		reroll: 1,
		functions: [1,1,1,1,1,0]
	},
	values:   [0,0,0,0,0,0], // Current values
	valuesTo: [0,0,0,0,0,0], // Current valuesTo
	valuesFx: [0,0,0,0,0,0], // Function
	valuesPr: [0,0,0,0,0,0], // FunctionProcess
	valuesLk: [0,0,0,0,0,0], // Values locked
	start: function () {
		Log.info("Starting module: " + this.name);
		if(this.config.width == this.defaults.width && this.config.orientation == "portrait"){
			this.config.width = "calc(90vh * 0.5 / 1.3)";
		}
		// Schedule update interval.
		var self = this;
		self.now = {};
		self.now.second = moment().second();
		self.now.minute = moment().minute();
		self.now.hour = moment().hour();
		this.valuesFx = this.config.functions;
		Log.info(self);

		/*
		 * Timer
		 * */
		var setValueToRoll = function(i,data){
			this.valuesTo[i] = data.ds[i];
			this.valuesPr[i] = 1;
			this.valuesLk[i] = 0;
			}
		var notificationTimer = function(){
			var data = this.getTemplateData();
			// reroll 2
			if(this.config.reroll == 2 && data.ds[3] != this.valuesTo[3]){
				Log.info('reroll 2');
				for(var j=0; j<3; j++){
					for(var k=0; k<2; k++){
						var i = k + j*2;
						if(this.valuesPr[i] || this.valuesLk[i]) continue;
						var timeout = 255 * (1-k);
						this.valuesLk[i]=1;
						setTimeout(setValueToRoll.bind(this),timeout,i,data);
						}
					}
				return;
				}
			// reroll 1
			if(this.config.reroll == 1 && data.ds[3] != this.valuesTo[3]){
				Log.info('reroll 1');
				for(var i in data.ds){
					if(this.valuesPr[i] || this.valuesLk[i]) continue;
					if(this.valuesPr[i]) continue;
					var timeout = 255 * (5-i);
					this.valuesLk[i]=1;
					setTimeout(setValueToRoll.bind(this),timeout,i,data);
					}
				return;
				}
			// reroll off
			for(var i in data.ds){
				if(this.valuesTo[i] == data.ds[i]) continue;
				if(this.valuesPr[i] || this.valuesLk[i]) continue;
				this.valuesPr[i] = this.valuesFx[i];
				this.valuesTo[i] = data.ds[i];
			}
			//Log.info("self.updateDom");
		}
		/*
		 * Frame
		 * */
		var renderFrame = function(){
			for(var i=0; i<6; i++){
				//if(this.valuesTo[i] != this.values[i]){
					switch(this.valuesPr[i]){
						case 0: this.nixieSet(i,this.valuesTo[i]); break;
						case 1: this.nixieRoll(i); break;
						}
					}
				//}
			}

		setInterval(notificationTimer.bind(this), 500);
		setInterval(renderFrame.bind(this), 50);
	},
	nixieSet: function(i,v){
		this.getNixie(i).dataset.d = v;
		this.values[i] = v;
		if(this.values[i] == this.valuesTo[i]) this.valuesPr[i]=0;
		},
	nixieRoll: function(i,v){
		var goTo = this.values[i] - 1; if(goTo < 0) goTo = 9;
		this.nixieSet(i,goTo);
		},
	getNixie(i){
		return document.querySelector("#"+this.identifier+" .nixie"+i);
		},
	getTemplate: function () {
		return "MMM-Cronixie.njk";
	},

	getTemplateData: function () {
		var h = moment().hour();
		var i = moment().minute();
		var s = moment().second();
		return {
			ds: [
				Math.floor(h / 10),
				Math.floor(h % 10),
				Math.floor(i / 10),
				Math.floor(i % 10),
				Math.floor(s / 10),
				Math.floor(s % 10)
			],
			config: this.config,
			identifier: this.identifier,
		};
	},

	getStyles: function() {
		return [
			this.file("css/style.css")
		]
	},
	// Define required scripts.
	getScripts: function () {
		return ["moment.js", "moment-timezone.js"];
	},

});
