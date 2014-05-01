var Views = {

	current : false,
	sub: false,
	back: false,
	back_text: false,
	refresh: false,

	render: function(view, effect, params) {

		Views.back = false;
		Views.back_text = false;
		Views.refresh = false;

		if (!User.user) {
			view = "login";
		}

		// Get view
		if (view == "console") {
			this.console();
			return false;
		} else if (typeof this["render"+ucwords(view)] == "function") {
			var block = this["render"+ucwords(view)]($("<div class='view'></div>"), params);
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
		if (typeof this["setup"+ucwords(view)] == "function") {
			this["setup"+ucwords(view)](block, params);
		}

		// Add mobiscroll elements
		Views.mobiscroll(block);

		// Transition
		Views.unsetupRefresh();
		switch (effect) {
			case 'slide':
			case 'slideFromRight':
				ViewAnimation.slide(block, +1, function() {
					Views.setupRefresh(block);
				});
				break;
			case 'slideFromLeft':
				ViewAnimation.slide(block, -1, function() {
					Views.setupRefresh(block);
				});
				break;
			case 'swap':
			default:
				App.empty().append(block);
				Views.setupRefresh(block);
				break;
		}
		return block;
	},

	refresh: function() {
		this.render(this.current);
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
	},

	setupRefresh: function($view) {
		if ($view.find(".refresh-pull")) {
			var icon = $view.find(".refresh-pull > .refresh-icon");
			icon.show();
			var offset = icon.outerHeight() + parseInt(icon.css("marginTop")) + parseInt(icon.css("marginBottom"));
			$("#main").scrollTop(offset);
			$("#main").attr("data-scroll-top", offset);
		} else {
			$("#main").attr("data-scroll-top", 0);
		}
	},

	unsetupRefresh: function() {
		var icon = $(".refresh-pull > .refresh-icon");
		var offset = icon.outerHeight() + parseInt(icon.css("marginTop")) + parseInt(icon.css("marginBottom"));
		var current = $("#main").scrollTop();
		$("#main").attr("data-scroll-top", 0).scrollTop(current - offset);
		icon.hide();
	},

	refreshView: function() {

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
