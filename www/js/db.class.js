// window.openDatabase = null; // Comment out this line to test browsers that don't support WebSQL

/**
 * This class is used to fake WebSQL behaviour.
 * It emulates basic WebSQL queries storing the DB as a Javascript object.
 * When the database updates, it stores a JSON string of the DB object and
 * saves it to local storage. If you don't have local storage then it still
 * isn't supported.
 * IndexedDB support could also be added as a save method in future to
 * increase compatibility even more.
 */
var WebSQLFaker = {
	db: {},
	ready: false,
	init: function() {
		// Check if we can load db from local storage
		if (typeof localStorage.getItem("taxicode") == "string") {
			WebSQLFaker.db = JSON.parse(localStorage.getItem("taxicode"));
		}
		// Set ready state
		WebSQLFaker.ready = true;
	},
	openDatabase: function() {
		if (!WebSQLFaker.ready) {
			WebSQLFaker.init();
		}
		return {
			transaction: function(transaction, error1, success1) {
				transaction({
					executeSql: function(sql, args, success2, error2) {
						// Process SQL
						var query = WebSQLFaker.parseSQL(sql, args);
						switch (query.type) {
							case "ERROR":
								if (typeof error == "function") {
									error();
								}
								break;
							default:
								if (query.result) {
									if (typeof success1 == "function") {
										success1(transaction, {
											rows: query.result.rows ? query.result.rows : query.result
										});
									}
									if (typeof success2 == "function") {
										success2(transaction, {
											rows: query.result.rows ? query.result.rows : query.result
										});
									}
								} else {
									if (typeof error1 == "function") {
										error1();
									}
									if (typeof error2 == "function") {
										error2();
									}
								}
								break;
						}
					},
				});
			},
		};
	},
	parseSQL: function(sql, args) {
			
		// SQL Components
		var select = "(SELECT) ";
		var insert = "(INSERT INTO) ";
		var create = "(CREATE TABLE IF NOT EXISTS) ";
		var drop = "(DROP TABLE IF EXISTS) ";
		var from = "(FROM) ";
		var where = "(WHERE) ";
		var values = "(VALUES) ";
		var atom = "(\\`[A-z0-9 \\-\\?\\*\\_\\'\\\"]*\\`) ";
		var atoms = "([A-z0-9 ,`\\-\\?\\*\\_\\'\\\"]*) ";
		var atoms_brackets = "\\(([A-z0-9 ,`\\-\\?\\*\\_\\'\\\"]*)\\) ";

		// Regexs
		var regexs = {
			SELECT: new RegExp(select + atoms + from + atoms + where + atoms.trim(), "g"),
			INSERT: new RegExp(insert + atom + atoms_brackets + values + atoms_brackets.trim(), "g"),
			CREATE: new RegExp(create + atoms + atoms_brackets.trim(), "g"),
			DROP: new RegExp(drop + atoms.trim(), "g")
		}

		// Results
		var components = null;
		var type = null;
		var result = null;
		$.each(regexs, function(t, regex) {
			if (components = regex.exec(sql)) {
				type = t;
				components = components.splice(1);
				components.push(args);
				result = WebSQLFaker[t].apply(window, components);
				return false;
			}
		});

		// Return results
		return components ? {
			type: type,
			components: components,
			result: result,
			sql: sql
		} : {
			type: "ERROR",
			sql: sql
		};
		
	},
	SELECT: function(select, selector, from, table, where, condition) {
		// Setup
		table = table.replace(/`/g,'');
		// Does table exist
		if (typeof WebSQLFaker.db[table] != "object" || WebSQLFaker.db[table] == null) {
			return false;
		}
		// Get rows
		var rows = [];
		$.each(WebSQLFaker.db[table], function(i, row) {
			// Currently always assumes selector = * (All)
			if (WebSQLFaker.condition(condition, row)) {
				rows.push(row);
			}
		});
		// Return rows
		return {status: "OK", rows: rows};
	},
	INSERT: function(insert, table, columns, values_keyword, values, args) {
		// Setup
		table = table.replace(/`/g,'');
		columns = columns.replace(/[\(\)]/g,'').split(",");
		values = values.replace(/[\(\)]/g,'').split(",");
		// Does table exist
		if (typeof WebSQLFaker.db[table] != "object" || WebSQLFaker.db[table] == null) {
			return false;
		}
		// Create row
		var row = {};
		$.each(columns, function(i, column) {
			var name = columns[i].trim().replace(/`/g, '');;
			var value = args[i]; // values[i].trim().replace(/[\'\"]/g, '');
			row[name] = value;
		});
		// Add row
		WebSQLFaker.db[table].push(row);
		// Store new database
		WebSQLFaker.save();
		// Return
		return {status: "OK", rows: []};
	},
	CREATE: function(create, table, columns) {
		// Setup
		table = table.replace(/`/g,'');
		// Create empty table
		WebSQLFaker.db[table] = [];
		// Store new database
		WebSQLFaker.save();
		// Return
		return {status: "OK", rows: []};
	},
	DROP: function(drop, table) {
		// Setup
		table = table.replace(/`/g,'');
		// Delete table
		WebSQLFaker.db[table] = null;
		// Store new database
		WebSQLFaker.save();
		// Return
		return {status: "OK", rows: []};
	},
	condition: function() {
		return true;
	},
	save: function() {
		localStorage.removeItem("taxicode");
		localStorage.setItem("taxicode", JSON.stringify(WebSQLFaker.db));
	}
}
WebSQLFaker.init();

var DBMC = {

	type: "WebSQL", // typeof window.openDatabase == "function" ? "WebSQL" : "IndexedDB",
	db: null,

	init: function() {
		if (typeof window.openDatabase != "function") {
			window.openDatabase = function() {
				return WebSQLFaker.openDatabase();
			};
		}
		DBMC.db = window.openDatabase(Config.app, 0.1, Config.title+" Database", 1024 * 1024 * 2);
	},

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
					data.push(typeof results.rows.item == "function" ? results.rows.item(i) : results.rows[i]);
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

DBMC.init();