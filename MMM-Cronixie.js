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
		reroll: 1
	},
	values: [0,0,0,0,0,0],
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
		Log.info(self);

		/*
		 * Timer
		 * */
		var notificationTimer = function(){
			var data = this.getTemplateData();
			for(var i in data.ds){
				this.values[i] = data.ds[i];
				//document.querySelector("#"+this.identifier+" .nixie"+i).dataset.d = data.ds[i];
			}
			console.log("self.updateDom");
		}
		/*
		 * Frame
		 * */
		var renderFrame = function(){
			//if(this.config.reroll > 1) this.nixieRollChain();
			var $nixie3 = this.getNixie(3);
			for(var i=0; i<6; i++){
				var $nixie = this.getNixie(i);
				if($nixie.dataset.d != this.values[i]){
					if(i==5 && $nixie3.dataset.d == this.values[3]){this.nixieSet(i,this.values[i]); /* do not roll seconds each time */ continue;}
					//$nixie.dataset.d = this.values[i];
					if(this.config.reroll != 1) this.nixieSet(i,this.values[i]);
					if(this.config.reroll == 1) this.nixieRoll(i,this.values[i]);
					}
				}
			}

		setInterval(notificationTimer.bind(this), 500);
		setInterval(renderFrame.bind(this), 50);
	},
	nixieSet: function(i,v){
		this.getNixie(i).dataset.d = v;
		},
	nixieRoll: function(i,v){
			var $nixie = this.getNixie(i);
			var $nixieDisplayValue = parseInt($nixie.dataset.d);
			var goTo = $nixieDisplayValue - 1; if(goTo < 0) goTo = 9;
			this.nixieSet(i,goTo);
			//$nixie.dataset.d = goTo;
			//if($nixie.dataset.d == v) return;
			},
	nixieRollChain: function(){
		var nixieRollLocal = this.nixieRoll.bind(this);
		var $nixie3 = this.getNixie(3);
		for(var i=0; i<6; i++){
			var $nixie = this.getNixie(i);
			if($nixie.dataset.d != this.values[i]){
				var $nixie = this.getNixie(i);
				this.nixieSet(i,this.values[i]);
				}
			}
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
