<html>
	<header>
		<title>test</title>
	</header>
	<script>
		var Utils = {
			'microId': function () {
				return Math.round((1+Math.random())*0xffff).toString(32)
			}
		}
		var Cookie = function () {
			this.set = function (name, value, expireDays) {
				var exdate = new Date();
				exdate.setDate(exdate.getDate() + expireDays);
				var value = escape(value) + ((expireDays==null) ? "" : "; expires="+expireDays.toUTCString());
				document.cookie = name + "=" + value;
			}

			this.get = function (name, defaultValue) {
				var i , x, y, ARRcookies=document.cookie.split(";");
				for (i=0; i<ARRcookies.length; i++) {
					x=ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
					y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
					x=x.replace(/^\s+|\s+$/g,"");
					if (x==name) {
						return unescape(y);
					}
				}
				return defaultValue;
			}

			this.increment = function(name, by, startVal) {
				if(!startVal) startVal = 0;
				if (!by) by = 1;
				val = parseInt(this.get(name, startVal));
				this.set(name, val+1);
				return val;
			}
		}

		var WindowStore = function (storeId, expDays) {

			this.cookie = new Cookie();

			this._mkKey = function (name) {
				return 'wt.[' + this.id + '].' + this.storeId + '.' + name;
			}

			this._set = function (name, value, expDays) {
				if (!expDays) expDays = this.expDays;
				this.cookie.set(this._mkKey(name), value, expDays);
			}

			this._get = function(name, defaultValue) {
				return this.cookie.get(this._mkKey(name), defaultValue); 
			}

			this.set = function(name, value, expDays) {
				this._set(name, JSON.stringify(value), expDays);
			}

			this.get = function(name, defaultValue) {
				var val = this._get(name);
				if (!val) {
					return defaultValue;
				} else {
					return JSON.parse(val);
				}
			}

			this.push = function(name, value, expDays) {
				var arr = this.get(name, []);
				arr.push(value);
				this.set(name, arr, expDays);
				return arr;
			}

			this._init = function (expDays, storeId) {
				if (!storeId) storeId='';
				this.storeId = storeId;
				this.expDays = expDays;
				if(!window.name) this._create();
				this.id = window.name;
			}

			this._create = function () {
				window.name = Utils.microId();
			}

			this._init(expDays, storeId);

		}

		function push_history(len) {
			if(!len) len=3;
			var st = new WindowStore('wh');
			var h = st.get('wh', []).splice(-len+1);
			h.push({'url':location.href});
			st.set('wh', h);
			return h;
		}

		var ws = new WindowStore();
		var ws_history = new WindowStore('b');
		//ws_history.set('h', []);
		//var h = ws_history.push('h', {'url':location.href, 'title':window.title});
	</script>
	<body>
		<pre>
		<script>
			// document.write(Utils.microId());
			var h = push_history(5);
			document.write(ws.id + '\n');
			for(h_id in h) {
				var h_val = h[h_id];
				document.write(h_val.title + ': ' + h_val.url + '\n');
			}
		</script>
		</pre>

	</body>
</html>
