
jQuery(document).ready(function(){

	$(".acelightbox").on("click", function(e) {
		e.preventDefault();
		if (!$(this).attr("href") && !$(this).attr("src")) {
			console.log("Can't find an href or src on this link. Cancelling lightbox.");
			return
		}

		var href = $(this).attr("href") || $(this).attr("src");

		// console.log("open LB");
		$("<div class='acelightbox_overlay'></div>").appendTo("body");
		$("<div class='acelightbox_content'><a class='close' href='#'></a></div>").appendTo("body");
		$("<img src='"+href+"'>").on("load", function() {
			$(this).appendTo("body").css("display" ,"none");
			var w = $(this).width();
			var h = $(this).height();
			var r = w/h;
			//console.log("w: " + w);
			//console.log("h: " + h);
			
			if (w > $(window).innerWidth()*0.9) {
				w = $(window).innerWidth()*0.9;
				h = w*(1/r);
				//console.log("too wide. reduced w to " + w + " h to " + h);
			}
			if (h > $(window).innerHeight()*0.9) {
				h = $(window).innerHeight()*0.9;
				w = h*r;
				//console.log("too tall. reduced w to " + w + " h to " + h);
			}
			
			$(this).appendTo(".acelightbox_content").css("display" ,"block");

			$(".acelightbox_content").css({
				width: w,
				height: h,
				marginLeft: -w/2,
				marginTop: -h/2
			});

			$(".acelightbox_overlay, .acelightbox_content").animate({opacity: 1}, {duration: 300});
		})

		$(".acelightbox_overlay, .acelightbox_content a.close").on("click", function(e) {
			e.preventDefault();
			$(".acelightbox_overlay, .acelightbox_content").animate({opacity: 0}, {duration: 300, complete: function() {
				$(".acelightbox_overlay, .acelightbox_content").remove();
			}})
		});

		$(document).on("keyup", function(e) {
			if (e.keyCode == 27) {
				// escape key
				$(".acelightbox_overlay, .acelightbox_content").animate({opacity: 0}, {duration: 300, complete: function() {
					$(".acelightbox_overlay, .acelightbox_content").remove();
				}})
			}
		})
		
	})

});