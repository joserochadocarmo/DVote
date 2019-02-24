import { h } from 'hyperapp';
import Iota from '../helperFunctions/iota/Iota';
import '../../css/survey.css';

const createSurvey = (state, event) => {
	let required = !!(state.iotaAdd && state.title && state.optA && state.optB);
	if ('URLSearchParams' in window && required) {
		var searchParams = new URLSearchParams(window.location.search);
		searchParams.set('iotaAdd', state.iotaAdd);
		searchParams.set('title', state.title);
		searchParams.set('optA', state.optA);
		searchParams.set('optB', state.optB);
		window.location.search = searchParams.toString();
	}
};

export default state => {
	state.iotaAdd = Iota.generateSurveyAddress();
	return (
		<div class="form-wrapper">
			<div class="form-container">
				<h1 class="logo">
					<span class="blu">D</span>
					<span class="purp">Vote</span>
				</h1>
				<p class="subtitle">Your IOTA survey address:</p>
				<form onsubmit={(state, event) => event.preventDefault()} class="form">
					<input
						type="text"
						readonly="readonly"
						class="form-input iotaAddress"
						placeholder="IOTA address"
						required
						value={state.iotaAdd}
					/>

					<hr style="border-top: black; width: 50%;" />
					<input
						type="text"
						class="form-input"
						placeholder="survey-title"
						minlength="3"
						required
						oninput={(state, e) => ({ ...state, title: e.target.value })}
						value={state.title}
					/>

					<input
						type="text"
						class="form-input"
						placeholder="Option A"
						maxlength="15"
						required
						oninput={(state, e) => ({ ...state, optA: e.target.value })}
						value={state.optA}
					/>

					<input
						type="text"
						class="form-input"
						placeholder="Option B"
						maxlength="15"
						required
						oninput={(state, e) => ({ ...state, optB: e.target.value })}
						value={state.optB}
					/>

					<button type="submit" class="btn-submit" onclick={createSurvey}>
						Create Survey
					</button>
				</form>
			</div>
		</div>
	);
};
