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
	},
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

		var notificationTimer = function(){
			//self.updateDom();
			/*
			self.now.second = moment().second();
			self.now.minute = moment().minute();
			self.now.hour = moment().hour();*/
			var data = this.getTemplateData();
			for(var i in data.ds){
				document.querySelector("#"+this.identifier+" .nixie"+i).dataset.d = data.ds[i];
			}
			console.log("self.updateDom");
		}
		setInterval(notificationTimer.bind(this), 500);
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
