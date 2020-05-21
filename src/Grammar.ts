import { Token } from "./Token";
import { ProductionRule } from "./ProductionRule";
import { Utils } from "./Utils";

enum TokenSort
{
  NonTerminal,
  Terminal
}

interface TokenTable
{
  [tokenString : string] : TokenSort;
}

export class Grammar
{
  private static checkNonTerminalsAndTerminalsAreDisjunct(nonTerminals : Array<Token>, terminals : Array<Token>) : void
  {
    const duplicates = [];
    for(const nonTerminal of nonTerminals)
    {
      if(terminals.some(terminal => terminal.isEqual(nonTerminal)))
      {
        duplicates.push(nonTerminal);
      }
    }
    
    if(duplicates.length !== 0)
    {
      const duplicatesStringList = duplicates.map(elem => elem.toString());
      throw new Error(`Tokens "${duplicatesStringList.join(`", "`)}" appear both as terminals and non terminals!`);
    }
  }

  private static checkTokensInRulesAreInTokenTable(tokenTable : TokenTable, rules : Array<ProductionRule>) : void
  {
    const everyTokenInProductionRules = rules.reduce<Array<Token>>((tokenList, rule) => tokenList.concat(rule.everyTokenList()), []);

    const ruleTokenNotInTable = [] as Array<Token>;
    for(const ruleToken of everyTokenInProductionRules)
    {
      if(tokenTable[ruleToken.toString()] === undefined)
      {
        ruleTokenNotInTable.push(ruleToken);
      }
    }

    const ruleTokenNotInTableWithoutDuplicates = Utils.removeArrayDuplicates(ruleTokenNotInTable, (token1, token2) => token1.isEqual(token2));

    if(ruleTokenNotInTableWithoutDuplicates.length !== 0)
    {
      const stringnizedTokensNotFound = ruleTokenNotInTableWithoutDuplicates.map(token => token.toString());
      throw new Error(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "${stringnizedTokensNotFound.join(`", "`)}"!`);
    }
  }

  private static initializeTokenTable(nonTerminals : Array<Token>, terminals : Array<Token>) : TokenTable
  {
    const tokenTable  = {} as TokenTable;
    for(const nonTerminal of nonTerminals)
    {
      tokenTable[nonTerminal.toString()] = TokenSort.NonTerminal;
    }

    for(const terminal of terminals)
    {
      tokenTable[terminal.toString()] = TokenSort.Terminal;
    }

    return tokenTable;
  }

  private static checkStartSymbolIsInTable(tokenTable : TokenTable, startSymbol : Token) : void
  {
    if(!tokenTable[startSymbol.toString()])
    {
      throw new Error(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
    }
  }
  
  private static mergeRules(rules : Array<ProductionRule>) : Array<ProductionRule>
  {
    const mergedRules = [] as Array<ProductionRule>;
    loop:
    for(const rule of rules)
    {
      for(let index = 0; index < mergedRules.length; index++)
      {
        const mergedRule = mergedRules[index];
        if(rule.getLhs().isEqual(mergedRule.getLhs()))
        {
          mergedRules[index] = Grammar.mergeRuleRhs(rule, mergedRule);
          continue loop; //In the mergedRules array there will be at most 1 rule with a given lhs at all times
        }
      }
      mergedRules.push(rule);
    }
    return mergedRules;
  }

  private static mergeRuleRhs(rule1 : ProductionRule, rule2 : ProductionRule) : ProductionRule
  {
    const rule1Rhs = rule1.getRhs();
    const rule2Rhs = rule2.getRhs();
    const mergedRhs = [... rule1Rhs];
    for(const option of rule2Rhs)
    {
      if(mergedRhs.every(elem => !elem.isEqual(option)))
      {
        mergedRhs.push(option);
      }
    }
    //NOTE Maybe fix this by incrementing ProductionRule API
    return new ProductionRule(rule1.getLhs().toString(), mergedRhs.map(elem => elem.toString()));
  } 

  constructor(nonTerminals : Array<Token>, terminals : Array<Token>, rules : Array<ProductionRule>, startSymbol : Token)
  {
    if(nonTerminals.length === 0)
    {
      throw new Error("Non terminals list is empty!");
    }

    if(terminals.length === 0)
    {
      throw new Error("Terminals list is empty!");
    }

    Grammar.checkNonTerminalsAndTerminalsAreDisjunct(nonTerminals, terminals);
    const tokenTable = Grammar.initializeTokenTable(nonTerminals, terminals);
    Grammar.checkTokensInRulesAreInTokenTable(tokenTable, rules);
    Grammar.checkStartSymbolIsInTable(tokenTable, startSymbol);
    const mergedRules = Grammar.mergeRules(rules);

    this.tokenTable = tokenTable;
    this.rules = mergedRules;
    this.startSymbol = startSymbol;
  }

  public static stringBasedConstructor(nonTerminals : Array<string>, terminals : Array<string>, rules : Array<{lhs : string; rhs : Array<string>}>, startSymbol : string) : Grammar
  {
    const tokenizedNonTerminals = nonTerminals.map(string => new Token(string));
    const tokenizedTerminals = terminals.map(string => new Token(string));
    const tokenizedRules = rules.map(rule => new ProductionRule(rule.lhs, rule.rhs));
    const tokenizedStartSymbol = new Token(startSymbol);

    return new Grammar(tokenizedNonTerminals, tokenizedTerminals, tokenizedRules, tokenizedStartSymbol);
  }

  private readonly tokenTable : TokenTable;
  private readonly rules : Array<ProductionRule>;
  private readonly startSymbol : Token;
}