ig.module(
    'game.entities.player2'
)
.requires(
    'impact.entity'
)
.defines(function(){
    EntityPlayer2 = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/charset/template.png', 24, 32 ),
        size: {x: 24, y: 32},
        offset: {x: 0, y: 0},
        flip: false,
        maxVel: {x: 200, y: 200},
		speed: 100,
		collides: ig.Entity.COLLIDES.ACTIVE,

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'idle', 1, [0] );
            this.addAnim( 'left', 0.15, [12,13,14,13] );
            this.addAnim( 'right', 0.15, [6,7,8,7] );
            this.addAnim( 'up', 0.15, [3,4,5,4] );
            this.addAnim( 'down', 0.15, [0,1,2,1] );
        },
		
		inFocus: function() {
			return ((this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
				((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
				(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
				((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		)},
		
        update: function() {

		if( ig.input.pressed( 'rclick' ) ) {
			console.log('un-clicked');
			this.selected = false;
        }
		
		if (ig.input.pressed('lclick') && this.inFocus()) {
			console.log('clicked');
			ig.log('clicked');
			this.selected = true;
		} 
		
        //MOUSEINPUT
        /*if( ig.input.state( 'lclick' ) ) {
			if (this.selected){
				this.destinationx = ig.input.mouse.x + ig.game.screen.x;
				this.destinationy = ig.input.mouse.y + ig.game.screen.y;
			}
        }*/
		//Get only the point where the mouse clicked. The above changes the destination with every update call
		if (this.selected && ig.input.pressed('lclick')){
			this.destinationx = ig.input.mouse.x + ig.game.screen.x;
			this.destinationy = ig.input.mouse.y + ig.game.screen.y;
		}

        // Cursor position
        if( this.destinationx < 9999999 && this.destinationy < 9999999 ) {
        // Accounts for center of character's collision area
			this.distancetotargetx = this.destinationx - (this.pos.x + (this.size.x/2));
			this.distancetotargety = this.destinationy - (this.pos.y + (this.size.y/2));
                    
					//Math.abs retorna o valor absoluto, o módulo, do numero.
                    if( Math.abs(this.distancetotargetx) > 10 || Math.abs(this.distancetotargety) > 10 ) {
                        if( Math.abs(this.distancetotargetx) > Math.abs(this.distancetotargety) ) {
                            // Move right
                            if( this.distancetotargetx > 1 ) {
                                this.vel.x = this.speed;
                                this.xydivision = this.distancetotargety / this.distancetotargetx;
                                this.vel.y = this.xydivision * this.speed;
                                this.currentAnim = this.anims.right;
                            }else { // Move left
                                this.vel.x = -this.speed;
                                this.xydivision = this.distancetotargety / Math.abs(this.distancetotargetx);
                                this.vel.y = this.xydivision * this.speed;
                                this.currentAnim = this.anims.left;
                            }

                        }else {
                            // Move down
                            if( this.distancetotargety > 1 ) {
                                this.vel.y = this.speed;
                                this.xydivision = this.distancetotargetx / this.distancetotargety;
                                this.vel.x = this.xydivision * this.speed;
                                this.currentAnim = this.anims.down;
                            }else { // Move up
                                this.vel.y = -this.speed;
                                this.xydivision = this.distancetotargetx / Math.abs(this.distancetotargety);
                                this.vel.x = this.xydivision * this.speed;
                                this.currentAnim = this.anims.up;
                            }
                        }
                        // No movement on either axis?
                        if( !this.vel.x && !this.vel.y ) {
                            // Not already idle? Set 'idle' anim
                            if( !this.idle ) {
                                this.idle = true;
                                if( this.currentAnim == this.anims.up ) {
                                    this.currentAnim = this.anims.up.rewind();
                                }else if( this.currentAnim == this.anims.down ) {
                                    this.currentAnim = this.anims.down.rewind();
                                }else if( this.currentAnim == this.anims.left ) {
                                    this.currentAnim = this.anims.left.rewind();
                                }else if( this.currentAnim == this.anims.right ) {
                                    this.currentAnim = this.anims.right.rewind();
                                }else {
                                    this.currentAnim = this.anims.down.rewind();
                                }    
                            }
                        }else {
                            this.idle = false;    
                        }
                        // ..end no movement on either axis
                    }
                    //Stoping mouse movement animation
                    if ( this.vel.x == 0 && this.vel.y == 0 ) {
                        this.currentAnim.rewind();
                      }
                }else { // ..end where the click magic happens
                    this.vel.y = 0;
                    this.vel.x = 0;
                    
                    this.destinationx = 99999999;
                    this.destinationy = 99999999;
                    if ( this.vel.x == 0 && this.vel.y == 0 ) {
                        
                        //keyboard movement
                        if( ig.input.state('left') ) {
                            this.currentAnim = this.anims.left;

                        }else if( ig.input.state('right') ) {
                            this.currentAnim = this.anims.right;

                        }else if( ig.input.state('up') ) {
                            this.currentAnim = this.anims.up;

                        }else if( ig.input.state('down') ) {
                            this.currentAnim = this.anims.down;

                        }/* Keyboard */else{ //Keyboard. Stopping keyboard movement animation
                            this.currentAnim.rewind();
                        } //keyboard
                    }
                    
                }
                // move!
                this.parent();
                // END MOUSE INPUT

            //used for movement, using just mouse or keyboard at once
            //}else if( ig.input.state( 'left' ) || ig.input.state( 'right' ) || ig.input.state( 'up' ) || ig.input.state( 'down' )  ) {
                
                //original keyboard movement, works fine alone, needed now to implement mouse movement
                // INIT Keyboard input
                if( ig.input.state('left') ) {
                      this.currentAnim = this.anims.left;
                      this.vel.x = -this.speed;      
                      this.destinationx = 99999999;
                      this.destinationy = 99999999;

                }else if( ig.input.state('right') ) {
                      this.currentAnim = this.anims.right;
                      this.vel.x = this.speed;
                      this.destinationx = 99999999;
                      this.destinationy = 99999999;
                } else{
                      this.vel.x = 0;
                      /*if ( this.vel.x == 0 && this.vel.y == 0 ) {
                        this.currentAnim.rewind();
                      }*/
                      
                } 
                // move up and down
                if( ig.input.state('up') ) {
                    this.currentAnim = this.anims.up;
                    this.vel.y = -this.speed;
                    this.destinationx = 99999999;
                    this.destinationy = 99999999;

                }else if( ig.input.state('down') ) {
                    this.currentAnim = this.anims.down;
                    this.vel.y = this.speed;
                    this.destinationx = 99999999;
                    this.destinationy = 99999999;
                }else {
                    this.vel.y = 0;    
                }

                // move!
                this.parent();
                // END Keyboard input
            
            
            //used for movement, using just mouse or keyboard at once
            //}

        }

    });
});