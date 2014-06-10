var Views = {

	current : false,
	sub: false,
	back: false,
	back_text: false,

	render: function(view, effect, params) {

		Views.back = false;
		Views.back_text = false;

		if (!User.user) {
			view = "login";
		}

		// Get view
		if (view == "console") {
			Views.console();
			return false;
		} else if (typeof Views["render"+ucwords(view)] == "function") {
			var block = Views["render"+ucwords(view)]($("<div class='view'></div>"), params);
		} else if (typeof Template.templates[view] != "undefined") {
			var block = Template.render(view);
		} else {
			App.alert("View doesn't exist: '"+view+"'");
			return false;
		}

		// Set current view
		Views.current = view;
		Views.sub = false;

		// Setup interactivity
		if (typeof Views["setup"+ucwords(view)] == "function") {
			Views["setup"+ucwords(view)](block, params);
			console.log("setup"+ucwords(view));
		}

		// Add mobiscroll elements
		Views.mobiscroll(block);

		// Transition
		switch (effect) {
			case 'slide':
			case 'slideFromRight':
				ViewAnimation.slide(block, +1, function() {
				});
				break;
			case 'slideFromLeft':
				ViewAnimation.slide(block, -1, function() {
				});
				break;
			case 'swap':
			default:
				App.empty().append(block);
				break;
		}
		return block;
	},

	refresh: function() {
		Views.render(Views.current);
	},

	setupNew: function() {
		Views.back = function() {
			App.alert('No');
		};
		Views.back_text = "Refresh";
	},

	console: function() {
		App.alert("<div class='console'><input type='text' autocapitalize='off' autocorrect='off' style='width: 255px;'/></div>", {
			title: "Console",
			options: {
				Cancel: function() {
					$(this).closest(".alert").remove();
				},
				Execute: function() {
					$(this).closest(".alert").find(".console input").change();
				}
			}
		});
	},

	mobiscroll: function($view) {
		var options = {
			theme: Config.theme ? Config.theme : 'ios7',
			display: 'bottom',
		};
		$view.find("[data-type=date]").scroller('destroy').scroller($.extend({
			preset: 'date',
			dateFormat: 'dd/mm/yy',
			dateOrder: 'ddMyy',
			minDate: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 1),
			maxDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 2)
		}, options));
		$view.find("[data-type=time]").scroller('destroy').scroller($.extend({
			preset: 'time',
			timeFormat: 'HH:ii',
			timeWheels: 'HHii',
			stepMinute: 5
		}, options));
		$view.find("[data-type=month]").each(function() {
			$(this).scroller('destroy').scroller($.extend({
				preset: 'date',
				dateOrder: 'MMyy',
				dateFormat: 'mm/yy',
				minDate: $(this).is("[data-date-min]") ? new Date(parseInt($(this).attr('data-date-min'))) : undefined,
				maxDate: $(this).is("[data-date-max]") ? new Date(parseInt($(this).attr('data-date-max'))) : undefined
			}, options));
			console.log($(this), $.extend({
				preset: 'date',
				dateOrder: 'MMyy',
				dateFormat: 'mm/yy',
				minDate: $(this).is("[data-date-min]") ? new Date(parseInt($(this).attr('data-date-min'))) : undefined,
				maxDate: $(this).is("[data-date-max]") ? new Date(parseInt($(this).attr('data-date-max'))) : undefined
			}, options));
		});
		$view.find("[data-type=datetime]").scroller('destroy').scroller($.extend({
			preset: 'datetime',
			minDate: new Date(),
			maxDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
			stepMinute: 5
		}, options));
		$view.find("select").scroller('destroy').scroller($.extend({
			preset: 'select'
		}, options));
	}

};

var ViewAnimation = {
	offset: parseInt(App.element.css('marginTop')),
	slide: function (panel, d, complete) {

		var shift = $(document).width() * d;
		var height = App.element.height();

		var panel = $("<div class='view'></div>").append(panel).attr({id: 'app2'}).css({left: shift, top: -height-ViewAnimation.offset});

		var duration = 600;
		$("#app").after(panel);

		$("#main").animate({scrollTop: 0}, duration);
		$("#app2").animate({left: 0}, {duration: duration, queue: false});
		$("#app").animate({left: -shift}, {duration: duration, queue: false, complete: function() {
			$("#app").css({left: 0}).empty().append($("#app2").children());
			$("#app2").remove();
			if (complete) {
				complete();
			}
		}});

	}
}
