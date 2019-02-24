import { h } from 'hyperapp';
import Vote from './Vote';
import Survey from './Survey';
import { getURLParameter } from '../helperFunctions';

export default state => {
	return getURLParameter('iotaAdd') ? <Vote {...state} /> : <Survey {...state} />;
};
