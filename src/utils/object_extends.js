export default function etd() {

	if (arguments.length == 0) {
		return {};
	}

	if (!arguments[0] || (arguments[0] && arguments[0] !== true && arguments[0].constructor !== Object)) {
		return {};
	}

	var len = arguments.length,
		start = 1,
		j = len - 1,
		target = arguments[0],
		replace = true;

	if (target === true) {
		target = {};
	}

	if (arguments[j] === false) {
		j--;
		replace = false;
	}

	for (var i = start; i <= j; i++) {
		var cur = arguments[i];
		for (var f in cur) {
			if (typeof cur[f] !== 'object') {
				target[f] = cur[f];
			} else {
				if (replace !== false) {
					target[f] = cur[f].constructor === Object ? (target[f].constructor !== Object ? {} : target[f]) : (target[f].constructor !== Array ? [] : target[f]);
					target[f] = ets(target[f], cur[f]);
				}
			}
		}

	}


	return target;
};