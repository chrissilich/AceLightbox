console.log("acelightboxify!");

jQuery(document).ready(function(){

	$(".acelightbox").on("click", function(e) {
		e.preventDefault();
		if (!$(this).attr("href") && !$(this).attr("src")) {
			console.log("Can't find an href or src on this link. Cancelling lightbox.");
			return
		}

		var href = $(this).attr("href") || $(this).attr("src");



		var zoom = 1;
		var maxZoom = 6;
		var zoomIncrement = 1.25;
		var dragging = false;
		var startDragX, startDragY, startImageX, startImageY;
		var w,h,r;

		// console.log("open LB");
		$("<div class='acelightbox_overlay'></div>").appendTo("body");
		$("<div class='acelightbox_container'></div>").appendTo("body");
		$("<div class='acelightbox_content'></div>").appendTo(".acelightbox_container");
		$("<div class='acelightbox_controls'><a href='javascript:;' class='acelightbox_controls_minus'></a><a href='javascript:;' class='acelightbox_controls_plus'></a><a href='javascript:;' class='acelightbox_controls_close'></a></div>").appendTo(".acelightbox_content");
		
		$("<img class='acelightbox_image' src='"+href+"'>").on("load", function() {
			$(this).appendTo("body").css("display" ,"none");
			w = $(this).width();
			h = $(this).height();
			r = w/h;
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

			$(".acelightbox_overlay").animate({opacity: 0.8}, {duration: 300});
			$(".acelightbox_content").animate({opacity: 1}, {duration: 300});

			$(".acelightbox_controls").on("click", function(event) {
				event.stopPropagation();
			})

			$(".acelightbox_image").on("click", function(event) {
				event.stopPropagation();
			}).on("mousedown touchstart", function(event) {
				//console.log("mousedown touchstart", event);
				event.preventDefault();
				event.stopPropagation();
				dragging = true;
				if (event.clientX) {
					startDragX = event.clientX;
					startDragY = event.clientY;
				} else if (event.originalEvent && event.originalEvent.changedTouches && event.originalEvent.changedTouches[0] && event.originalEvent.changedTouches[0].clientX) {
					startDragX = event.originalEvent.changedTouches[0].clientX;
					startDragY = event.originalEvent.changedTouches[0].clientY;
				}
				startImageX = parseInt( $(this).css("margin-left") );
				startImageY = parseInt( $(this).css("margin-top") );
			})

			
			$(window).on("mouseup touchend", endDrag).on("mousemove touchmove", doDrag);
			$(document).on("keyup", keyboardHandler);


			// prezoom two levels
			//zoom = 1*zoomIncrement*zoomIncrement;
			//changeZoom(true);

		})
	


		function endDrag() {
			dragging = false;
			console.log("mouseup");
		}

		function doDrag(event) {
			//console.log("doDrag (mousemove touchmove)", event);
			
			if (!dragging || zoom == 1) return;
			var distanceX, distanceY;

			if (event.clientX) {
				distanceX = event.clientX - startDragX;
				distanceY = event.clientY - startDragY;
			} else if (event.originalEvent && event.originalEvent.changedTouches && event.originalEvent.changedTouches[0] && event.originalEvent.changedTouches[0].clientX) {
				distanceX = event.originalEvent.changedTouches[0].clientX - startDragX;
				distanceY = event.originalEvent.changedTouches[0].clientY - startDragY;
			}
			//console.log(startDragX, startDragY, distanceX, distanceY);

			$(".acelightbox_image").css("margin-left", startImageX + distanceX);
			$(".acelightbox_image").css("margin-top", startImageY + distanceY);
		}

		function changeZoom(instant) {
			console.log("zooming to " + zoom);

			var values = {
				width: zoom * 100 + "%",
				height: zoom * 100 + "%"
			};

			if (zoom == 1) {
				values.marginLeft = 0;
				values.marginTop = 0;
				$(".acelightbox_image").removeClass("zoomed");
			} else {
				values.marginLeft = -0.5 * ((w * zoom) - w);
				values.marginTop = -0.5 * ((h * zoom) - h);
				$(".acelightbox_image").addClass("zoomed");
			}

			var delay = 300;
			var duration = 400;
			if (instant) {
				delay = 0;
				duration = 0;
			}

			$(".acelightbox_image").stop(true, false).delay(delay).stop(true, false).animate(values, {
				duration: duration, 
				easing: "easeOutBack"
			});			
		}


		function keyboardHandler(e) {
			console.log("keyboardHandler");
			if (e.keyCode == 187 || e.keyCode == 107) {
				// +
				zoom *= zoomIncrement;
				if (zoom > maxZoom) zoom = maxZoom;
				changeZoom();
			} else if (e.keyCode == 189 || e.keyCode == 109) {
				// -
				zoom *= (1/zoomIncrement);
				if (zoom < 1) zoom = 1;
				changeZoom();
			}
		}

		$("a.acelightbox_controls_plus").on("click", function() {
			zoom *= zoomIncrement;
			if (zoom > maxZoom) zoom = maxZoom;
			changeZoom();
		})
		$("a.acelightbox_controls_minus").on("click", function() {
			zoom *= (1/zoomIncrement);
			if (zoom < 1) zoom = 1;
			changeZoom();
		})


		$(".acelightbox_overlay, .acelightbox_content a.acelightbox_controls_close, .acelightbox_container").on("click", function(e) {
			e.preventDefault();
			closeLightbox();
		});

		$(document).on("keyup", function(e) {
			if (e.keyCode == 27) {
				// escape key
				closeLightbox();
			}
		})


		function closeLightbox() {
			console.log("closeLightbox");

			$(window).off("mouseup", endDrag).on("mousemove", doDrag);
			$(document).off("keyup", keyboardHandler);

			$(".acelightbox_overlay, .acelightbox_container").animate({opacity: 0}, {duration: 300, complete: function() {
				$(".acelightbox_overlay, .acelightbox_container").remove();
			}})
		}
		
	})

});