app.service('state', function(){
	this.target = null;
	this.exhibit;
	this.deselect;
	this.tMax = 5000;
	this.t = 10;
	
	this.options = {
		flying: true,
		flyingRotate: false,
		textAnimation: false,
		isMuted: false,
		unfurl: true
	}
	
	
	// http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
	
	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	this.isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]" 
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

	// Internet Explorer 6-11
	this.isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	this.isEdge = !this.isIE && !!window.StyleMedia;

	// Chrome 1+
	this.isChrome = !!window.chrome && !!window.chrome.webstore;

	// Blink engine detection
	var isBlink = (this.isChrome || isOpera) && !!window.CSS;
});