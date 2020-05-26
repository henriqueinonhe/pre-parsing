"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductionRule_1 = require("../src/ProductionRule");
const TokenTable_1 = require("../src/TokenTable");
ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", " dobs");
describe("constructor", () => {
    describe("Pre Conditions", () => {
        test("Lhs must not be empty", () => {
            expect(() => { ProductionRule_1.ProductionRule.fromString("", ["Yada", "duba"]); }).toThrow("Left hand side of rule cannot be empty!");
        });
        test("Rhs must not be empty", () => {
            expect(() => { ProductionRule_1.ProductionRule.fromString("<expr>", []); }).toThrow("Right hand side of rule cannot be empty!");
            expect(() => { ProductionRule_1.ProductionRule.fromString("<expr>", [""]); }).not.toThrow();
        });
    });
    describe("Post Conditions", () => {
        test("Duplicate rhs options are removed", () => {
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["AA", "B", "AA", "B", "AA", "C"]).getRhs().join(",")).toBe("AA,B,C");
        });
    });
});
describe("everyTokenList()", () => {
    describe("Post Conditions", () => {
        test("Lists every token", () => {
            expect(ProductionRule_1.ProductionRule.fromString("P <expr> Q", ["A + B", "C * D"]).everyTokenList().map(token => token.toString()).join(",")).toBe("P,<expr>,Q,A,+,B,C,*,D");
        });
        test("Removes duplicates", () => {
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"]).everyTokenList().map(token => token.toString()).join(",")).toBe("<expr>,(,+,),*,<digit>");
        });
    });
});
describe("isMonotonic()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "A": TokenTable_1.TokenSort.NonTerminal,
                "B": TokenTable_1.TokenSort.NonTerminal,
                "S": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "b": TokenTable_1.TokenSort.Terminal,
                "C": TokenTable_1.TokenSort.NonTerminal,
                "D": TokenTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("A", [""]).isMonotonic(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A B", ["a"]).isMonotonic(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["S S S", "a b b", "a b a", "C D"]).isMonotonic(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A", ["a"]).isMonotonic(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A", [" a b", "a b b", "S"]).isMonotonic(tokenTable)).toBe(true);
        });
    });
});
describe("isERule()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "A": TokenTable_1.TokenSort.NonTerminal,
                "B": TokenTable_1.TokenSort.NonTerminal,
                "S": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "b": TokenTable_1.TokenSort.Terminal,
                "C": TokenTable_1.TokenSort.NonTerminal,
                "D": TokenTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", [""]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", ""]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "b"]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isERule(tokenTable)).toBe(false);
        });
    });
});
describe("isContextFree()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "<expr>": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "B": TokenTable_1.TokenSort.NonTerminal,
                "S": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "d": TokenTable_1.TokenSort.Terminal,
                "C": TokenTable_1.TokenSort.NonTerminal,
                "D": TokenTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", [""]).isContextFree(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["a", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A B", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(false);
        });
    });
});
describe("isRightRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "S": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a a a a"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a a a a S"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "a S", "a a a S", "S"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S a"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S a"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a S S"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "a S", "a a a S", "S", "S a"]).isRightRegular(tokenTable)).toBe(false);
        });
    });
});
describe("isLeftRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "S": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a a a a"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S a a a a a a "]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "S a", "S a a a", "S"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S a"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S a a a"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "S a", "S a a a", "S", "S S"]).isLeftRegular(tokenTable)).toBe(false);
        });
    });
});
describe("isContextSensitive()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "S": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "b": TokenTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S a a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a a b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a S S b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a S S S S S b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a a b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a S b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a a S b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S S S b A S S a", ["a S S a a a b A S S a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S a", ["a S b a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S a", ["a b S a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A A S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S A A"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A S A"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A A b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S S b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S S S S S b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A A b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S A", ["A S b A"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S A", ["A b S A"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S a", ["S"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S", ["S a"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["b S a"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a b"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S", ["S A"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S A", ["S"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S", ["S A"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["b S A"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A b"]).isContextSensitive(tokenTable)).toBe(false);
        });
    });
});
describe("ProductionRuleParser", () => {
    describe("findSubstringIndex()", () => {
        describe("Pre Conditions()", () => {
            test("Substring must be present within searched string", () => {
                expect(() => { ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Dobs dubs alsmdasadn asd", "frakets"); }).toThrow("Couldn't find");
                expect(() => { ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Dobs dubs alsmdasadn asd", "Dobs", 1); }).toThrow("Couldn't find");
                expect(() => { ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Dobs dubs alsmdasadn asd", "dubs", 10); }).toThrow("Couldn't find");
            });
        });
        describe("Post Conditions", () => {
            test("Search from the beginning", () => {
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "Lorem")).toBe(0);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "em")).toBe(3);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "sum")).toBe(8);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", " dobs")).toBe(16);
            });
        });
    });
});
//# sourceMappingURL=ProductionRule.test.js.map