import { h } from 'hyperapp';
import Iota from '../helperFunctions/iota/Iota';
import Signature from '../helperFunctions/crypto/Signature';
import { getURLParameter } from '../helperFunctions';
import '../../css/vote.css';

const iota = new Iota();
const sig = new Signature();
var keys = undefined;

const onCreate = async () => {
	await iota.nodeInitialization();
	keys = await sig.getKeys();
	await getFromTangle();
};

const getFromTangle = async () => {
	let vote = {
		publicHexKey: await sig.exportPublicKey(keys.publicKey),
		pointA: 1,
		pointB: 1,
	};

	const transactions = await iota.getTransactionByAddress(getURLParameter('iotaAdd'));
	if (typeof transactions !== 'undefined' && transactions.length > 0) {
		const awaitMessages = [];

		transactions.forEach(transaction => {
			awaitMessages.push(iota.getMessage(transaction));
		});

		const messages = await Promise.all(awaitMessages);

		for (let j = 0; j < messages.length; j += 1) {
			const mesSignature = messages[j].signature;
			delete messages[j].signature;
			// eslint-disable-next-line no-await-in-loop
			const isVerified = await sig.verify(
				await sig.importPublicKey(messages[j].publicKey || ''),
				mesSignature,
				JSON.stringify(messages[j])
			);

			if (isVerified) {
				if (messages[j].vote === getURLParameter('optA')) {
					vote.pointA += 1;
				} else if (messages[j].vote === getURLParameter('optB')) {
					vote.pointB += 1;
				} else {
					console.log('Invalid Vote!!');
				}
			}
		}
	}
	window.updateState(state => ({ ...state, ...vote }));
};

const vote = async (state, { voteLetter }) => {
	if (!state.publicHexKey) return;
	console.log('Voted!!');
	const voteObj = { time: new Date().toLocaleString(), vote: voteLetter, publicKey: state.publicHexKey };
	const signature = await sig.sign(keys.privateKey, JSON.stringify(voteObj));
	voteObj.signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
	iota.vote(state.iotaAdd, voteObj);
	voteLetter === getURLParameter('optA') && (state.pointA += 1);
	voteLetter === getURLParameter('optB') && (state.pointB += 1);
	//await getFromTangle();
	return { ...state };
};

export default state => {
	let { title, pointA = 1, pointB = 1, optA, optB, publicHexKey, iotaAdd } = state;
	let total = pointA + pointB;
	let percentA = Math.round((pointA / total) * 100) || 0;
	let percentB = Math.round((pointB / total) * 100) || 0;
	return (
		<div class="survey-wrapper" onCreate={onCreate}>
			<h1 class="survey-title">{title}</h1>

			<p class="survey-info">
				Click on the desired side to vote. <br />
				Share the above URL with others to let them vote.
			</p>

			<div class="container" style={{ gridTemplateColumns: `${percentA}% ${percentB}%` }}>
				<div class="left ripple purple" onclick={[vote, { voteLetter: optA }]}>
					<div class="text">
						<span class="option-size">{percentA}%</span>
						<br />
						<span class="option-title">{optA}</span>
					</div>
				</div>
				<div class="right ripple blue" onclick={[vote, { voteLetter: optB }]}>
					<div class="text">
						<span class="option-size">{percentB}%</span>
						<br />
						<span class="option-title">{optB}</span>
					</div>
				</div>
			</div>
			<div class="box flex">
				<a onclick={() => navigator.share({ title: 'DVote ', url: window.location.href })} class="share">
					Share
				</a>
			</div>
			<div class="fill" />
			<div class="stats-container">
				<span>
					{optA}: {pointA - 1}
				</span>
				<span>
					{optB}: {pointB - 1}
				</span>
				<span>Total Votes Casted: {total - 2}</span>
				<span class="wrap">
					Your public signature key:<a href={`https://thetangle.org/address/${iotaAdd}`}>{publicHexKey}</a>
				</span>
			</div>
		</div>
	);
};
