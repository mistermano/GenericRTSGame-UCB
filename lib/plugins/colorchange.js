/*
Thanks to quidmonkey
http://pointofimpactjs.com/tutorials/view/11/so-you-wanna-scale-individual-entities
*/
    ig.module(
    'plugins.colorchange'
    )
    .requires(
    'impact.entity'
    )
    .defines(function(){
     
    ig.Entity.inject({
    ctx: 0,
    imageData: 0,
    pixels: 0,
    numPixels: 0,
	 
    init: function( x, y, settings ){
		this.parent( x, y, settings );
    },
     
	changeImage: function(){
    // you have to put the onclick part here because jsfiddle is silly
		this.ctx = ig.context.getContext('2d');
		this.imageData = ctx.getImageData(0,0, can.width, can.height);
		this.pixels = imageData.data;
		this.numPixels = pixels.length;
    
    for (this.i = 0; i < numPixels; i++) {
        //this.average = (pixels[i*4] + pixels[(i*4)+1] + pixels[(i*4)+2]) /3;
        // set red green and blue pixels to the average value
        //pixels[i*4] = average;
        pixels[i*4+1] += 30;
        //pixels[i*4+2] = average;
    }
		ctx.putImageData(imageData, 0, 0);
	}
	 
  });
     
});