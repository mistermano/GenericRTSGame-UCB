/*
Thanks to Matt Lautz
http://www.pointofimpactjs.com/tutorials/view/14/screen-movement-with-arrow-keys
*/
ig.module('plugins.map-size').
requires('impact.map')
.defines(function(){
	ig.Map.inject({
		//found at http://impactjs.com/forums/help/how-to-find-map-size-in-pixels
		init: function( tilesize, data ) {
			this.parent( tilesize, data );
			this.pxWidth = this.width * tilesize;
			this.pxHeight = this.height * tilesize;
		}
	});
});