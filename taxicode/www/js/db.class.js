var DBMC = {
	
	db: window.openDatabase(Config.app, Config.version, Config.title+" Database", 1024*1024*2),

	createTable: function(name, cols, overwrite, success, error) {
		DBMC.db.transaction(function(tx) {
			if (overwrite) {
				tx.executeSql('DROP TABLE IF EXISTS `'+name+'`');
			}
			tx.executeSql('CREATE TABLE IF NOT EXISTS '+name+' ('+cols+')');
		}, error, success);
	},

	deleteTable: function(name, success, error) {
		DBMC.db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS '+name);
		}, error, success);
	},

	insert: function(table, rows, success, error) {
		DBMC.db.transaction(function(tx) {
			$.each(rows, function(i, row) {
				var keys = '';
				var escapes = '';
				var values = [];
				$.each(row, function(key, value) {
					keys += (keys==''?'':', ') + '`'+key+'`';
					escapes += escapes==''?'?':', ?';
					values.push(value);
				});
				tx.executeSql('INSERT INTO `'+table+'` ('+keys+') VALUES ('+escapes+')', values);
			});
		}, error, success);
	},

	select: function(table, selector, where, success, error) {
		DBMC.db.transaction(function(tx) {
			tx.executeSql('SELECT '+selector+' FROM `'+table+'` WHERE '+(where?where:1), [], function(tx, results) {
				var data = [];
				for (var i = 0; i < results.rows.length; i++) {
					data.push(results.rows.item(i));
				}
				success(data);
			}, null, error);
		}, error);
	},

	query: function(query, data, success, error) {
		DBMC.db.transaction(function(tx) {
			tx.executeSql(query, data, success, error);
		});
	},

	update: function(success, error) {
		alert('DBMC.update() support is coming soon. You can currently use DBMC.db to access the database directly.');
	},

	replace: function(success, error) {
		alert('DBMC.replace() support is coming soon. You can currently use DBMC.db to access the database directly.');
	},

	delete: function(success, error) {
		alert('DBMC.delete() support is coming soon. You can currently use DBMC.db to access the database directly.');
	}

};