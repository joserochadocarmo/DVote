/**
 * Returns Url Parameter specific to input string
 * @param {string} sParam
 */
export function getURLParameter(sParam) {
	const sPageURL = decodeURIComponent(window.location.search.substring(1));
	const sURLVariables = sPageURL.split('&');
	for (let i = 0; i < sURLVariables.length; i += 1) {
		const sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) {
			return replaceAll(sParameterName[1], '+', ' ');
		}
	}
	return undefined;
}

export const onLoad = [
	(_, dispatch) => {
		window.updateState = dispatch;
	},
];

/**
 * Pre-processing it to escape special regular expression characters
 * @param {string} str
 */
function escapeRegExp(str) {
	return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

/**
 * Replace all occurrences of a string
 * @param {string} str
 * @param {string} find
 * @param {string} replace
 */
export function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
