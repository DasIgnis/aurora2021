class BaseFuzzyFunction {
	evaluate(x) {
		throw Error("Base interfaces should not be instantiated or called!");
	}

	getArea() {
		throw Error("Base interfaces should not be instantiated or called!");
	}

	getSegment() {
		throw Error("Base interfaces should not be instantiated or called!");
	}
}

export default BaseFuzzyFunction;
