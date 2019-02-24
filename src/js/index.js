import '../css/style.scss';
import { h, app } from 'hyperapp';
import DVote from './components/DVote';
import { getURLParameter, onLoad } from './helperFunctions';

app({
	init: {
		iotaAdd: getURLParameter('iotaAdd'),
		title: getURLParameter('title'),
		optA: getURLParameter('optA'),
		optB: getURLParameter('optB'),
	},
	view: state => <DVote {...state} />,
	subscriptions: state => [onLoad],
	container: document.body,
});
