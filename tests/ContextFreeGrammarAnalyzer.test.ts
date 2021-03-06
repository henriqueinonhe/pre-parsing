import { Grammar } from "../src/Core/Grammar";
import { ContextFreeGrammarAnalyzer } from "../src/Analyzers/ContextFreeGrammarAnalyzer";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Grammar analyzed must be context free", () =>
    {
      //TODO
    });
  });
});

describe("Adjacency matrix and transitive closure matrix", () =>
{
  test("", () =>
  {
    const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
    const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
    const rules = [
      {lhs: "<expr>", rhs: ["<prim>", "<comp>"]},
      {lhs: "<prim>", rhs: ["i", "o"]},
      {lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"]},
      {lhs: "<prod>", rhs: ["[ <expr> <more> ]"]},
      {lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"]}
    ];
    const startSymbol = "<expr>";
    const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
    const analyzer = new ContextFreeGrammarAnalyzer(grammar);
    const adjacencyMatrix = analyzer.getTokenAdjacencyMatrix();
    const transitiveClosureMatrix = analyzer.getTokenReachabilityMatrix();

    //Adjacency matrix
    expect(adjacencyMatrix["<expr>"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["<prim>"]).toBe(true);
    expect(adjacencyMatrix["<expr>"]["<comp>"]).toBe(true);
    expect(adjacencyMatrix["<expr>"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["["]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["("]).toBe(false);
    expect(adjacencyMatrix["<expr>"][")"]).toBe(false);
    expect(adjacencyMatrix["<expr>"][","]).toBe(false);

    expect(adjacencyMatrix["<prim>"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["i"]).toBe(true);
    expect(adjacencyMatrix["<prim>"]["o"]).toBe(true);
    expect(adjacencyMatrix["<prim>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["["]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["("]).toBe(false);
    expect(adjacencyMatrix["<prim>"][")"]).toBe(false);
    expect(adjacencyMatrix["<prim>"][","]).toBe(false);

    expect(adjacencyMatrix["<comp>"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["<prim>"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["<comp>"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["<prod>"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["->"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["["]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["("]).toBe(true);
    expect(adjacencyMatrix["<comp>"][")"]).toBe(true);
    expect(adjacencyMatrix["<comp>"][","]).toBe(false);

    expect(adjacencyMatrix["<more>"]["<expr>"]).toBe(true);
    expect(adjacencyMatrix["<more>"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["<more>"]).toBe(true);
    expect(adjacencyMatrix["<more>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["["]).toBe(false);
    expect(adjacencyMatrix["<more>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["("]).toBe(false);
    expect(adjacencyMatrix["<more>"][")"]).toBe(false);
    expect(adjacencyMatrix["<more>"][","]).toBe(true);

    expect(adjacencyMatrix["<prod>"]["<expr>"]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["<more>"]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["["]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["]"]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["("]).toBe(false);
    expect(adjacencyMatrix["<prod>"][")"]).toBe(false);
    expect(adjacencyMatrix["<prod>"][","]).toBe(false);

    expect(adjacencyMatrix["i"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["i"]["i"]).toBe(false);
    expect(adjacencyMatrix["i"]["o"]).toBe(false);
    expect(adjacencyMatrix["i"]["->"]).toBe(false);
    expect(adjacencyMatrix["i"]["["]).toBe(false);
    expect(adjacencyMatrix["i"]["]"]).toBe(false);
    expect(adjacencyMatrix["i"]["("]).toBe(false);
    expect(adjacencyMatrix["i"][")"]).toBe(false);
    expect(adjacencyMatrix["i"][","]).toBe(false);

    expect(adjacencyMatrix["o"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["o"]["i"]).toBe(false);
    expect(adjacencyMatrix["o"]["o"]).toBe(false);
    expect(adjacencyMatrix["o"]["->"]).toBe(false);
    expect(adjacencyMatrix["o"]["["]).toBe(false);
    expect(adjacencyMatrix["o"]["]"]).toBe(false);
    expect(adjacencyMatrix["o"]["("]).toBe(false);
    expect(adjacencyMatrix["o"][")"]).toBe(false);
    expect(adjacencyMatrix["o"][","]).toBe(false);

    expect(adjacencyMatrix[","]["<expr>"]).toBe(false);
    expect(adjacencyMatrix[","]["<prim>"]).toBe(false);
    expect(adjacencyMatrix[","]["<comp>"]).toBe(false);
    expect(adjacencyMatrix[","]["<more>"]).toBe(false);
    expect(adjacencyMatrix[","]["<prod>"]).toBe(false);
    expect(adjacencyMatrix[","]["i"]).toBe(false);
    expect(adjacencyMatrix[","]["o"]).toBe(false);
    expect(adjacencyMatrix[","]["->"]).toBe(false);
    expect(adjacencyMatrix[","]["["]).toBe(false);
    expect(adjacencyMatrix[","]["]"]).toBe(false);
    expect(adjacencyMatrix[","]["("]).toBe(false);
    expect(adjacencyMatrix[","][")"]).toBe(false);
    expect(adjacencyMatrix[","][","]).toBe(false);

    expect(adjacencyMatrix["->"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["->"]["i"]).toBe(false);
    expect(adjacencyMatrix["->"]["o"]).toBe(false);
    expect(adjacencyMatrix["->"]["->"]).toBe(false);
    expect(adjacencyMatrix["->"]["["]).toBe(false);
    expect(adjacencyMatrix["->"]["]"]).toBe(false);
    expect(adjacencyMatrix["->"]["("]).toBe(false);
    expect(adjacencyMatrix["->"][")"]).toBe(false);
    expect(adjacencyMatrix["->"][","]).toBe(false);

    expect(adjacencyMatrix["["]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["["]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["["]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["["]["<more>"]).toBe(false);
    expect(adjacencyMatrix["["]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["["]["i"]).toBe(false);
    expect(adjacencyMatrix["["]["o"]).toBe(false);
    expect(adjacencyMatrix["["]["->"]).toBe(false);
    expect(adjacencyMatrix["["]["["]).toBe(false);
    expect(adjacencyMatrix["["]["]"]).toBe(false);
    expect(adjacencyMatrix["["]["("]).toBe(false);
    expect(adjacencyMatrix["["][")"]).toBe(false);
    expect(adjacencyMatrix["["][","]).toBe(false);

    expect(adjacencyMatrix["]"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["]"]["i"]).toBe(false);
    expect(adjacencyMatrix["]"]["o"]).toBe(false);
    expect(adjacencyMatrix["]"]["->"]).toBe(false);
    expect(adjacencyMatrix["]"]["["]).toBe(false);
    expect(adjacencyMatrix["]"]["]"]).toBe(false);
    expect(adjacencyMatrix["]"]["("]).toBe(false);
    expect(adjacencyMatrix["]"][")"]).toBe(false);
    expect(adjacencyMatrix["]"][","]).toBe(false);

    expect(adjacencyMatrix["("]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["("]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["("]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["("]["<more>"]).toBe(false);
    expect(adjacencyMatrix["("]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["("]["i"]).toBe(false);
    expect(adjacencyMatrix["("]["o"]).toBe(false);
    expect(adjacencyMatrix["("]["->"]).toBe(false);
    expect(adjacencyMatrix["("]["["]).toBe(false);
    expect(adjacencyMatrix["("]["]"]).toBe(false);
    expect(adjacencyMatrix["("]["("]).toBe(false);
    expect(adjacencyMatrix["("][")"]).toBe(false);
    expect(adjacencyMatrix["("][","]).toBe(false);

    expect(adjacencyMatrix[")"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<more>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix[")"]["i"]).toBe(false);
    expect(adjacencyMatrix[")"]["o"]).toBe(false);
    expect(adjacencyMatrix[")"]["->"]).toBe(false);
    expect(adjacencyMatrix[")"]["["]).toBe(false);
    expect(adjacencyMatrix[")"]["]"]).toBe(false);
    expect(adjacencyMatrix[")"]["("]).toBe(false);
    expect(adjacencyMatrix[")"][")"]).toBe(false);
    expect(adjacencyMatrix[")"][","]).toBe(false);

    //Transitive Closure Matrix
    expect(transitiveClosureMatrix["<expr>"]["<expr>"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["<prim>"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["<comp>"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["<more>"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["<prod>"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["i"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["o"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["->"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["["]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["]"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"]["("]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"][")"]).toBe(true);
    expect(transitiveClosureMatrix["<expr>"][","]).toBe(true);

    expect(transitiveClosureMatrix["<prim>"]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["i"]).toBe(true);
    expect(transitiveClosureMatrix["<prim>"]["o"]).toBe(true);
    expect(transitiveClosureMatrix["<prim>"]["->"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["["]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["]"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"]["("]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"][")"]).toBe(false);
    expect(transitiveClosureMatrix["<prim>"][","]).toBe(false);

    expect(transitiveClosureMatrix["<comp>"]["<expr>"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["<prim>"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["<comp>"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["<more>"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["<prod>"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["i"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["o"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["->"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["["]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["]"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"]["("]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"][")"]).toBe(true);
    expect(transitiveClosureMatrix["<comp>"][","]).toBe(true);

    expect(transitiveClosureMatrix["<more>"]["<expr>"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["<prim>"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["<comp>"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["<more>"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["<prod>"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["i"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["o"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["->"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["["]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["]"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"]["("]).toBe(true);
    expect(transitiveClosureMatrix["<more>"][")"]).toBe(true);
    expect(transitiveClosureMatrix["<more>"][","]).toBe(true);

    expect(transitiveClosureMatrix["<prod>"]["<expr>"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["<prim>"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["<comp>"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["<more>"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["<prod>"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["i"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["o"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["->"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["["]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["]"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"]["("]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"][")"]).toBe(true);
    expect(transitiveClosureMatrix["<prod>"][","]).toBe(true);

    expect(transitiveClosureMatrix["i"]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["i"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["o"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["->"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["["]).toBe(false);
    expect(transitiveClosureMatrix["i"]["]"]).toBe(false);
    expect(transitiveClosureMatrix["i"]["("]).toBe(false);
    expect(transitiveClosureMatrix["i"][")"]).toBe(false);
    expect(transitiveClosureMatrix["i"][","]).toBe(false);

    expect(transitiveClosureMatrix["o"]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["i"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["o"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["->"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["["]).toBe(false);
    expect(transitiveClosureMatrix["o"]["]"]).toBe(false);
    expect(transitiveClosureMatrix["o"]["("]).toBe(false);
    expect(transitiveClosureMatrix["o"][")"]).toBe(false);
    expect(transitiveClosureMatrix["o"][","]).toBe(false);

    expect(transitiveClosureMatrix[","]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix[","]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix[","]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix[","]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix[","]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix[","]["i"]).toBe(false);
    expect(transitiveClosureMatrix[","]["o"]).toBe(false);
    expect(transitiveClosureMatrix[","]["->"]).toBe(false);
    expect(transitiveClosureMatrix[","]["["]).toBe(false);
    expect(transitiveClosureMatrix[","]["]"]).toBe(false);
    expect(transitiveClosureMatrix[","]["("]).toBe(false);
    expect(transitiveClosureMatrix[","][")"]).toBe(false);
    expect(transitiveClosureMatrix[","][","]).toBe(false);

    expect(transitiveClosureMatrix["->"]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["i"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["o"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["->"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["["]).toBe(false);
    expect(transitiveClosureMatrix["->"]["]"]).toBe(false);
    expect(transitiveClosureMatrix["->"]["("]).toBe(false);
    expect(transitiveClosureMatrix["->"][")"]).toBe(false);
    expect(transitiveClosureMatrix["->"][","]).toBe(false);

    expect(transitiveClosureMatrix["["]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["["]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["["]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["["]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["["]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["["]["i"]).toBe(false);
    expect(transitiveClosureMatrix["["]["o"]).toBe(false);
    expect(transitiveClosureMatrix["["]["->"]).toBe(false);
    expect(transitiveClosureMatrix["["]["["]).toBe(false);
    expect(transitiveClosureMatrix["["]["]"]).toBe(false);
    expect(transitiveClosureMatrix["["]["("]).toBe(false);
    expect(transitiveClosureMatrix["["][")"]).toBe(false);
    expect(transitiveClosureMatrix["["][","]).toBe(false);

    expect(transitiveClosureMatrix["]"]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["i"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["o"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["->"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["["]).toBe(false);
    expect(transitiveClosureMatrix["]"]["]"]).toBe(false);
    expect(transitiveClosureMatrix["]"]["("]).toBe(false);
    expect(transitiveClosureMatrix["]"][")"]).toBe(false);
    expect(transitiveClosureMatrix["]"][","]).toBe(false);

    expect(transitiveClosureMatrix["("]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix["("]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix["("]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix["("]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix["("]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix["("]["i"]).toBe(false);
    expect(transitiveClosureMatrix["("]["o"]).toBe(false);
    expect(transitiveClosureMatrix["("]["->"]).toBe(false);
    expect(transitiveClosureMatrix["("]["["]).toBe(false);
    expect(transitiveClosureMatrix["("]["]"]).toBe(false);
    expect(transitiveClosureMatrix["("]["("]).toBe(false);
    expect(transitiveClosureMatrix["("][")"]).toBe(false);
    expect(transitiveClosureMatrix["("][","]).toBe(false);

    expect(transitiveClosureMatrix[")"]["<expr>"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["<prim>"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["<comp>"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["<more>"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["<prod>"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["i"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["o"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["->"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["["]).toBe(false);
    expect(transitiveClosureMatrix[")"]["]"]).toBe(false);
    expect(transitiveClosureMatrix[")"]["("]).toBe(false);
    expect(transitiveClosureMatrix[")"][")"]).toBe(false);
    expect(transitiveClosureMatrix[")"][","]).toBe(false);
  });
});

describe("computeUnreachableTokens()", () =>
{
  describe("Post Conditions", () =>
  {
    const nonTerminals = ["S", "A", "B", "C"];
    const terminals = ["a", "b", "c", "d"];
    const rules = [
      {lhs: "S", rhs: ["A", "A S"]},
      {lhs: "A", rhs: ["a", "B"]},
      {lhs: "B", rhs: ["b"]},
      {lhs: "C", rhs: ["c"]}
    ];
    const startSymbol = "S";
    const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
    const analyzer = new ContextFreeGrammarAnalyzer(grammar);
    expect(analyzer.computeUnreachableTokens()).toStrictEqual(["C", "c", "d"]);
  });
}); 

describe("computeUndefinedNonTerminals()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A", "A B"]},
        {lhs: "A", rhs: ["a"]},
        {lhs: "B", rhs: ["B"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const analyzer = new ContextFreeGrammarAnalyzer(grammar);

      expect(analyzer.computeUndefinedNonTerminals()).toStrictEqual([]);

      const rules2 = [
        {lhs: "S", rhs: ["A", "A B"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const grammar2 = Grammar.fromStrings(nonTerminals, terminals, rules2, startSymbol);
      const analyzer2 = new ContextFreeGrammarAnalyzer(grammar2);

      expect(analyzer2.computeUndefinedNonTerminals()).toStrictEqual(["A", "B"]);
    });
  });
});

describe("computeNonProductiveTokens()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C", "D", "E", "F", "G"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A", "A B", "D"]},
        {lhs: "A", rhs: ["a"]},
        {lhs: "B", rhs: ["B"]},
        {lhs: "C", rhs: ["c"]},
        {lhs: "E", rhs: [""]},
        {lhs: "F", rhs: ["F", "G"]},
        {lhs: "G", rhs: ["F"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const analyzer = new ContextFreeGrammarAnalyzer(grammar);
  
      expect(analyzer.computeNonProductiveNonTerminals()).toStrictEqual(["B", "D", "F", "G"]);
    });
  });
});

describe("computeTokensShortestStringsLength()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
      const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
      const rules = [
        {lhs: "<expr>", rhs: ["<prim>", "<comp>"]},
        {lhs: "<prim>", rhs: ["i", "o"]},
        {lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"]},
        {lhs: "<prod>", rhs: ["[ <expr> <more> ]"]},
        {lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"]}
      ];
      const startSymbol = "<expr>";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const analyzer = new ContextFreeGrammarAnalyzer(grammar);
      const table = analyzer.computeTokensShortestStringsLength();

      expect(table["<expr>"]).toBe(1);
      expect(table["<prim>"]).toBe(1);
      expect(table["<prod>"]).toBe(5);
      expect(table["<more>"]).toBe(2);
      
      expect(table["i"]).toBe(1);
      expect(table["o"]).toBe(1);
      expect(table["->"]).toBe(1);
      expect(table[","]).toBe(1);
      expect(table["("]).toBe(1);
      expect(table[")"]).toBe(1);
      expect(table["["]).toBe(1);
      expect(table["]"]).toBe(1);
    });
  });
});