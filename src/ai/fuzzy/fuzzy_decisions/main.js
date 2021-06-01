// singleton instantiation
import Reducers from "./ScaleResultReducers/Reducers";
import Validator from "./validation/validator";


class FuzzyDecisions {
	constructor() {
		this.scales = [
			// {
			// 	name: string,
			// 	rules: [
			// 		{
			// 			func: FuzzyLogicFunction,
			// 			outcome: string
			// 		}
			// 	]
			// },
		];
		this.reducer = null;
	}

	addScale(scaleName, rules) {
		// TODO: check scaleName for uniqueness
		this.validateRules(rules);
		this.scales.push({scaleName, rules});
	}

	setScaleResultsReducer(type) {
		this.reducer = Reducers.get(type);
	}

	validateRules(rules) {
		Validator.validate(rules);
	}

	getDecision(parameters) {
		if (this.reducer === null) {
			throw new Error("scaleResultsReducer is not set");
		}

		const fuzzyDecisions = [];
		parameters.forEach(({scaleName, value}) => {
			const scale = this.scales.find((scale) => scale.scaleName === scaleName);

			if (!scale) {
				throw new Error("scale not exists")
			}

			scale.rules.forEach((rule) => {
				fuzzyDecisions.push({
					probability: rule.func.evaluate(value),
					outcome: rule.outcome
				});
			});
		});

		return this.reducer.reduce(fuzzyDecisions);

	}
}


export default FuzzyDecisions;
