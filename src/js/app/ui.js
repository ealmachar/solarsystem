app.service('ui', ['planets', 'camera', 'state', 'attributes', 'audio', function(planets, camera, state, attributes, audio){
	var ui = document.getElementById("ui");
	var frustum = new THREE.Frustum();
	
	var exhibitPreDelay = true;
	var exhibitPostDelayTarget = null;
	
	var furled = true;
	
	var panelTarget = angular.element('#panelTargetText');
	var panelx = angular.element('#panelx');
	var panely = angular.element('#panely');
	var panelz = angular.element('#panelz');
	var panelvel = angular.element('#panelVelocity');
	var panelUnit = angular.element('#panelUnit');

	var panelTime = angular.element('#panelTime');
	
	var panelflyon = angular.element('#panelFlyOn');
	var panelflyoff = angular.element('#panelFlyOff');
	
	var paneltextbttn = angular.element('#panelTextAnim');
	
	this.panelTickTime = 0;
	this.panelTickRate = 0.1;
	
	
	var textProgress = 0;
	var textMax = 100;
	
	var stats, note, table, des, obj;
	
	var animateText = false;


	
	var clock = new THREE.Clock();
	
	this.init = function(){
		
		for(var body in planets.celestials){
			this.add(body);
			
			var obj = angular.element('#' + body + 'tag');
			var stats = descriptions[body].stats;
			
			// initialize
			stats.forEach(function(ele, i){
				var newline = '<tr><td></td><td></td></tr>';
				obj.find('.stats').append(newline);

			});

		}
		
		angular.element('.panelParent').mouseenter(function(){
			$(this).children().addClass( "show" )
		});
		
		angular.element('.panelParent').mouseleave(function(){
			$(this).children().removeClass( "show" )
		});
		
		angular.element('.panelTarget').click(function(){
			var id = angular.element(this).attr('id');
			id = id.substr(0, id.length-3);
			select(id);
		});
		
		angular.element('.exhibit').mouseenter(function(){
			camera.mouseOverExhibit = true;
		});
		
		angular.element('.exhibit').mouseleave(function(){
			camera.mouseOverExhibit = false;
		});
		
		angular.element('#navPanel').mouseenter(function(){
			camera.mouseOverPanel = true;
		});
		
		angular.element('#navPanel').mouseleave(function(){
			camera.mouseOverPanel = false;
		});
		
		angular.element('#panel08').click(function(){
			changeTime(state.t * 0.8);
		});
		
		angular.element('#panel10').click(function(){
			changeTime(1);
		});
		
		angular.element('#panel12').click(function(){
			changeTime(state.t * 1.2);
		});
		
		angular.element('#panelVolOn').click(function(){
			audio.mute();
		});
		
		angular.element('#panelVolOff').click(function(){
			audio.unmute();
		});
		
		angular.element('#panelFlyOn').click(function(){
			state.options.flying = false;
			panelflyon.hide();
			panelflyoff.show();
		});
		
		angular.element('#panelFlyOff').click(function(){
			state.options.flying = true;
			panelflyon.show();
			panelflyoff.hide();
		});

		angular.element('#panelTextAnim').click(function(){
			if(state.options.textAnimation){
				state.options.textAnimation = false;
				paneltextbttn.removeClass('textOn');
			}
			else{
				state.options.textAnimation = true;
				paneltextbttn.addClass('textOn');
			}
		});
		
		angular.element('.exbuttontxt').click(function(){
			var obj = angular.element('#' + state.target + 'tag');

			if(furled){
				unfurl(obj);
			}
			else{
				furl(obj);
			}
		});

		
		angular.element('.panelTarget, .panelParent, .panelButton').mouseenter(function(){
			var sound = audio.sounds.tick;
			
			if(!state.options.isMuted){
				if(sound.isPlaying){
					sound.stop();
					sound.play();
				}
				else{
					sound.play();
				}
			}
		});
		
		angular.element('.tagName').mouseenter(function(){
			var sound = audio.sounds.boop;
			
			if(!angular.element(this).hasClass('selected') && !state.options.isMuted){
				if(sound.isPlaying){
					sound.stop();
					sound.play();
				}
				else{
					sound.play();
				}
			}
		})
		
		panelClear();
		
		if(state.options.flying){
			panelflyon.show();
			panelflyoff.hide();
		}
		else{
			panelflyon.hide();
			panelflyoff.show();
		}
		
		if(state.options.textAnimation){
			paneltextbttn.addClass('textOn');
		}
		else{
			paneltextbttn.removeClass('textOn');
		}
	}

	
	var changeTime = function(time){
		state.t = Math.max(0, Math.min(time, state.tMax));
		panelTime.text(state.t.toFixed(2) + 'x');
		angular.element('#panelSlider').val(state.t);
		angular.element('.mdl-slider__background-lower').css('mdl-slider__background-lower', 'flex: ' + ( state.t / state.tMax ).toFixed(3) + '1 0%;');
	};
	
	
	this.add = function(celestial){
				
		var tag = '<div id="' + celestial + 'tag" class="tags">' +
						'<div class="tagMid">' +
							'<div id="' + celestial + '" class="tagName">' + celestial.charAt(0).toUpperCase() + celestial.slice(1) + '</div>' +
						'</div>' +
						'<div class="exhibit">' +
							'<div class="exhibitBody">' +
								'<div id="' + celestial + 'image" class="image"></div>' +
								'<div class="description"></div>' +
								'<table class="stats"></table>' +
								'<div class="ornament2"></div>' +
							'</div>' +
							'<div class="ornament1"></div>' +
						'</div>' +
						'<div class="tagBot">' +
							'<div class="exbutton">' + 
								'<span class="exbuttontxt">Close</span>' +
							'</div>' +
						'</div>' +
					'</div>'
				
		
		var el = angular.element(tag).appendTo('#ui');
		el.click(function(event){
			var id = event.target.id;
			this.select(id);
		}.bind(this));
	};
	
	
	
	
	
	
	//
	// translate 3d world coordinates to 2d window coordinates
	//
	// help: http://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
	//
	this.project = function(renderer, cam, obj, tag, stats) {
		var vector = new THREE.Vector3();

		var widthHalf = 0.5 * renderer.context.canvas.width;
		var heightHalf = 0.5 * renderer.context.canvas.height;

		obj.updateMatrixWorld();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(cam);
		
		vector.x = ( vector.x * widthHalf ) + widthHalf;
		vector.y = - ( vector.y * heightHalf ) + heightHalf;
		
		div = document.getElementById( tag + 'tag' );
		
		var offset = 0;
		if(tag == "deimos" || tag == "moon" || tag == 'io' || tag == 'mimas' || tag == 'ariel' || tag == 'triton'){
			offset += 25;
		}
		else if(tag == "phobos" || tag == 'europa' || tag == 'enceladus' || tag == 'umbriel'){
			offset += 50;
		}
		else if(tag == 'ganymede' || tag == 'tethys' || tag == 'titania'){
			offset += 75;
		}
		else if(tag == 'callisto' || tag == 'dione' || tag == 'oberon'){
			offset += 100;
		}
		else if(tag == 'rhea' || tag == 'miranda'){
			offset += 125;
		}
		else if(tag == 'titan'){
			offset += 150;
		}
		else if(tag == 'iapetus'){
			offset += 175;
		}

		if(offset > 0){
			offset = disv(camera.camera.getWorldPosition(), planets.celestials[tag].getWorldPosition()) < attributes.au/2 ? 0 : offset;
		}
		
		// make ui plates follow planets at all times except:
		// directly after clicking them, AFTER exhibit (description) panel has displayed
		// and directly after deselecting AFTER exhibit panel has folded away
		if((state.target != tag && exhibitPostDelayTarget != tag) ||
			(state.target == tag && exhibitPreDelay)){

			div.style.top = vector.y + offset + "px";
			div.style.left = vector.x + "px";
		}
    }
	
	
	
	
		
	this.select = function(id){
		if((typeof planets.celestials[id] !== 'undefined') && (id != state.target)){
			
			var sound = audio.sounds.select;
			if(!state.options.isMuted){
				if(sound.isPlaying){
					sound.stop();
					sound.play();
				}
				else{
					sound.play();
				}
			}
			
			// determine if the camera is moving to a focused target
			// from a focused target or not. Important for camera.flyTick()
			if( state.target != null ){
				camera.targetLast = state.target;
				this.deselect();
			}

			state.target = id;
			
			angular.element('#' + id + 'tag').find('.tagMid, .tagName').addClass('selected');
			angular.element('#' + id + 'nav').addClass('selected');
			
			// flash numbers on select
			angular.element('.panelNumber').addClass('flash');
			
			camera.addPauseAnim = setTimeout(function(){
				angular.element('#' + id + 'nav').addClass('pauseAnim');
				angular.element('.panelNumber').removeClass('flash');
			}, 600);
			
			camera.camfocus(id);
			
			var name = state.target.charAt(0).toUpperCase() + state.target.slice(1)
			panelTarget.text(name);

		}
	}.bind(this);
	

	
	this.deselect = function(){
		var obj = angular.element('#' + state.target + "tag");
		var target = state.target;
		
		clearTimeout(this.addPauseAnim);
		
		// deselect panel
		angular.element('#' + target + 'nav').removeClass('selected pauseAnim');
		
		// fold exhibit panel in steps
		// fade out contents
		furl(obj);
		
		setTimeout(function(){
			
			// shrink nameplate
			obj.find('.tagName, .tagMid, .tagBot, .exhibit, .ornament1, .ornament2, .exbutton, .exbuttontxt').removeClass('phase1');
			setTimeout(function(){
				
				// deselect nameplate
				obj.find('.tagMid').removeClass('selected').find('.tagName').removeClass('selected');
			}, 500)
		}, 500);

		exhibitPreDelay = true;		
		
		// once exhibit panel has folded, remove transition
		// if transition property persists, ui plates would lag
		setTimeout(function(){
			exhibitPostDelayTarget = null || state.target;
			obj.css('transition', '');
		}.bind(this), 1500);

		panelClear();
		state.target = null;
	}
	


	
	this.exhibit = function(){
		obj = angular.element('#' + state.target + 'tag');

		exhibitPreDelay = false;
		exhibitPostDelayTarget = state.target;
		
		// exhibit panel contents

		
		// unfold exhibit panel, enter phase 1 of animations (winden width of nameplate, pin nameplate to top right)
		obj.find('.tagName, .tagMid, .tagBot, .exhibit, .ornament1, .ornament2, .exbutton, .exbuttontxt').addClass('phase1');
		
		// pin exhibit (description) panel top right
		obj.css('transition', 'top 1s, left 1s');
		obj.css('top', '100px');
		obj.css('left', ( window.innerWidth - 550 ) + 'px');
		
		setTimeout(function(){
			if(state.options.unfurl){
				unfurl(obj);
			}
		}, 500);
	}
	
	this.exhibitRealign = function(){
		if(state.target){
			obj.css('left', ( window.innerWidth - 550 ) + 'px');
			obj.find('.exhibit').css('height', ( window.innerHeight - 200 ) + 'px');
			obj.find('.exhibitBody').css('height', ( window.innerHeight - 200 - 50 ) + 'px');
		}
	}
	
	

	
	function unfurlTick(){
		var progress, desProgress;
		
		if(textProgress <= textMax){
			progress = textProgress/textMax;
			
			// increment
			if(state.options.textAnimation)
				textProgress += 1;
			else
				textProgress = textMax;
			
			desProgress = Math.round( ( textProgress/textMax ) * note.length );
			
			// fill out description
			var str = note.substr(0, desProgress) + '<span class="hide">' + note.substr(desProgress, note.length) + '</span>';
			des.html(str);
			
			// fill out stats
			stats.forEach(function(ele, index){
				var line = $(table[index]);
				var stat = line.find('td:nth-child(' + 1 + ')');
				var value = line.find('td:nth-child(' + 2 + ')');

				var statProg = Math.round(ele.stat.length * progress);
				var valueProg = Math.round(ele.value.length * progress);
				
				var statstr = ele.stat.substr(0, statProg) + '<span class="hide">' + ele.stat.substr(statProg , ele.stat.length) + '</span>';
				var valuestr = ele.value.substr(0, valueProg) + '<span class="hide">' + ele.value.substr(valueProg, ele.value.length) + '</span>';
				
				stat.html(statstr);
				value.html(valuestr);
			});
		}
		else{
			textProgress = 0;
			animateText = false;
		}
	}
	
	function unfurl(obj){

		
		// because css can't do window height arithmatic
		obj.find('.exhibit').css('height', ( window.innerHeight - 200 ) + 'px');
		obj.find('.exhibitBody').css('height', ( window.innerHeight - 200 - 50 ) + 'px');
		
		// enter phase 2 of window unfolding animations (drop down panel)
		obj.find('.exhibit, .image, .description, .stats').addClass('phase2');
		
		setTimeout(function(){
			
			// enter final phase of window unfolding animations (fade in contents)
			obj.find('.exhibitBody').addClass('phase3');
			obj.find('.exbuttontxt').text('Close');
			
			stats = descriptions[state.target].stats;
			note = descriptions[state.target].note;
			
			table = obj.find('tr');
			des = obj.find('.description')
			
			animateText = true;
		}, 500);
		
		furled = false;
	}
	
	
	
	function furl(obj){
		obj.find('.exhibitBody').removeClass('phase3');
		
		setTimeout(function(){
			obj.find('.exbuttontxt').text('Open');
			
			// fold up panel
			obj.find('.exhibit').css('height', '0px');
			obj.find('.exhibitBody').css('height', '0px');
			
			obj.find('.exhibit, .ornament1, .image, .description, .stats').removeClass('phase2');

			// restart panel content progress meter
			textProgress = 0;
		}, 500);
		
		furled = true;
	}
	

	function panelClear(){
		panelTarget.text('---');
		panelx.text('-');
		panely.text('-');
		panelz.text('-');
		panelvel.text('-');
		panelUnit.text('<0.--, 0.--, 0.-->');
		
		panelTime.text(state.t.toFixed(2) + 'x');
	}
	
	
	this.panelTick = function(obj){

		var x = ( obj.x / attributes.au ).toFixed(8);
		var y = ( obj.y / attributes.au ).toFixed(8);
		var z = ( obj.z / attributes.au ).toFixed(8);
		
		var vel = magv(obj.vx, obj.vy, obj.vz);
		
		var uvx = obj.vx / vel;
		var uvy = obj.vy / vel;
		var uvz = obj.vz / vel;

		var unitvel = '<x: ' + 
			uvx.toFixed(2) + 
			', y: ' + 
			uvy.toFixed(2) + 
			', z: ' + 
			uvz.toFixed(2) + 
		'>';
		
		panelx.text(x);
		panely.text(y);
		panelz.text(z);
		panelvel.text(vel.toFixed(3));
		panelUnit.text(unitvel);
	}
	
	
	
	// tick function for ui elements
	// cam is the camera rendering object in mainjs
	// camera is the angularjs service object
	this.tick = function(renderer, cam){
		for(var body in planets.celestials){
			this.project(renderer, cam, planets.celestials[body], body);	
		}

		// check to see if ui plates need to be displayed
		// depending whether a celestial is within the camera's perspective or not
		frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( cam.projectionMatrix, cam.matrixWorldInverse ) );
		for(var body in planets.celestials){
			if(frustum.containsPoint(planets.celestials[body].getWorldPosition())){
				document.getElementById( body + 'tag' ).style.display = 'inline';
			}
			else{
				// don't remove exhibit panel from display until postdelay has expired
				if(exhibitPostDelayTarget != body){
					document.getElementById( body + 'tag' ).style.display = 'none';
				}
			}
		};
		
		if(animateText){
			unfurlTick();
		}
		
		this.panelTickTime += clock.getDelta();

	}.bind(this)
	
	// camera needs access to these
	state.exhibit = this.exhibit;
	state.deselect = this.deselect;
	
	// avoid 'this' confusion with jquery
	var select = this.select;
}]);