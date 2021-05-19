import BaseFuzzyFunction from "./BaseFuzzyFunction";

/**
 * S-function function (from point)
 */
class SFunctionFuzzyFunction extends BaseFuzzyFunction {

    /**
     * The constructor takes one point:
     * @param {number} p Point - function center (at y = 1) 
     */
    constructor({p}) {
		super();
		this.p = p;
	}

    /**
     * Calculate the value of a function
     * @param {number} x Input parameter
     * @returns {number} Calculated function value
     */
	evaluate(x) {
		if (x <= this.p - 1 || x >= this.p + 1)
            return 0;
        return 1;
        /*
            Note:
            Solution from condition: 1 - (x - p)^2 = 0
        */
	}

    getArea() {
        return 1/2 * (this.p3 - this.p2);
    }

    getSegment() {
        const x1 = this.p - 1;
		const x2 = this.p + 1;
        return {left: x1, right: x2};
    }
}

export default SFunctionFuzzyFunction;