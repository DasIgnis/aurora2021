import BaseFuzzyFunction from "../FuzzyLogicFunctions/BaseFuzzyFunction";
import LeftShoulderFuzzyFunction from "../FuzzyLogicFunctions/LeftShoulderFuzzyFunction";
import RightShoulderFuzzyFunction from "../FuzzyLogicFunctions/RightShoulderFuzzyFunction";

const EPS = 0.00001;

export default class Validator {
    static validate(rules) {
        if (!rules.every(({func}) => func instanceof(BaseFuzzyFunction))) {
            throw new Error("All rules should be instance of BaseFuzzyFunction");
        }
    
        let sections = [];
        let areaSum = 0;
        let rightShoulderEnd = Number.MAX_VALUE;
    
        rules.forEach(({func}) => {
            if (func instanceof(LeftShoulderFuzzyFunction)) {
                if (sections.some(sec => sec.left === 0)) {
                    throw new Error("must be only one left shoulder function");
                }
            } else if (func instanceof(RightShoulderFuzzyFunction)) {
                if (rightShoulderEnd !== Number.MAX_VALUE) {
                    throw new Error("must be only one right shoulder function");
                }
                rightShoulderEnd = func.p2;
            }
    
            sections.push(func.getSegment());
            areaSum += func.getArea();
        });
    
        combinedSections = combineSections(sections);
    
        if (combinedSections.right < rightMaximum) {
            throw new Error("there is a segment section without any defined functions");
        }
        if (Math.abs(rightMaximum - areaSum) > EPS) {
            throw new Error("function sum must be 1 at any point");
        }
    }
    
    combineSections(sections) {
        sections.sort((a, b) => a.left - b.left);
    
        let combinedSections = {left: 0, right: 0};
        let rightMaximum = Number.MIN_VALUE;
    
        sections.forEach(sec => {
            if (sec.left <= combinedSections.right && combinedSections.right <= sec.right) {
                combinedSections.right = sec.right;
            }
            if (rightMaximum < sec.right) {
                rightMaximum = sec.right;
            }
        })
    
        return combinedSections;
    }
} 