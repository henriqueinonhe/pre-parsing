import { Token } from "./Token";
import { ProductionRule } from "./ProductionRule";
import { Utils } from "./Utils";
import { TokenSortTable, TokenSort } from "./TokenSortTable";
import { TokenString } from "./TokenString";

/**
 * Represents the grammar type in the Chomsky
 * Hierarchy.
 * 
 * The type indicates the most restrict
 * grammar class it belongs to.
 * 
 * Type 0 -> Unrestricted Grammar
 * Type 1 -> Context Sensitive
 * Type 2 -> Context Free
 * Type 3 -> Regular
 */
export enum GrammarType
{
  Type0,
  Type1,
  Type2,
  Type3
}

/**
 * Represents a grammar, ready to be used
 * by parsers.
 */
export class Grammar
{
  /**
   * Given a list of terminals and non terminals,
   * checks whether the lists are disjunct, that is,
   * both lists have no common elements.
   * 
   * @param nonTerminals 
   * @param terminals 
   */
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

  /**
   * Checks whether every token that occurs in each of
   * the [[ProductionRule]]s are present (declared either as a terminal
   * or a non terminal) in the [[tokenSortTable]].
   * 
   * @param tokenSortTable 
   * @param rules 
   */
  private static checkTokensInRulesAreIntokenSortTable(tokenSortTable : TokenSortTable, rules : Array<ProductionRule>) : void
  {
    const everyTokenInProductionRules = rules.reduce<Array<Token>>((tokenList, rule) => tokenList.concat(rule.everyTokenList()), []);

    const ruleTokenNotInTable = [] as Array<Token>;
    for(const ruleToken of everyTokenInProductionRules)
    {
      if(tokenSortTable[ruleToken.toString()] === undefined)
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

  /**
   * Initializes token table from non terminals and terminals
   * token lists.
   * 
   * @param nonTerminals 
   * @param terminals 
   */
  private static initializeTokenSortTable(nonTerminals : Array<Token>, terminals : Array<Token>) : TokenSortTable
  {
    const tokenSortTable  = {} as TokenSortTable;
    for(const nonTerminal of nonTerminals)
    {
      tokenSortTable[nonTerminal.toString()] = TokenSort.NonTerminal;
    }

    for(const terminal of terminals)
    {
      tokenSortTable[terminal.toString()] = TokenSort.Terminal;
    }

    return tokenSortTable;
  }

  /**
   * Checks whether the start symbol is
   * present (declared) in the [[tokenSortTable]].
   * 
   * @param tokenSortTable 
   * @param startSymbol 
   */
  private static checkStartSymbolIsInTable(tokenSortTable : TokenSortTable, startSymbol : Token) : void
  {
    if(tokenSortTable[startSymbol.toString()] === undefined)
    {
      throw new Error(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
    }
  }
  
  /**
   * Merge rules, so if there are any
   * rules with the same left hand side,
   * their right hand sides are merged
   * together.
   * 
   * @param rules 
   */
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
          mergedRules[index] = rule.mergeRule(mergedRule);
          continue loop; //In the mergedRules array there will be at most 1 rule with a given lhs at all times
        }
      }
      //If reaches here means that rule is not mergeble
      //with rules currently contained by mergedRules array
      mergedRules.push(rule);
    }
    return mergedRules;
  }

  constructor(tokenSortTable : TokenSortTable, rules : Array<ProductionRule>, startSymbol : Token)
  {
    Grammar.checkTokensInRulesAreIntokenSortTable(tokenSortTable, rules);
    Grammar.checkStartSymbolIsInTable(tokenSortTable, startSymbol);
    const mergedRules = Grammar.mergeRules(rules);

    this.tokenSortTable = tokenSortTable;
    this.rules = mergedRules;
    this.startSymbol = startSymbol;
  }

  /**
   * Alternative constructor using strings.
   * 
   * @param nonTerminals 
   * @param terminals 
   * @param rules 
   * @param startSymbol 
   */
  public static fromStrings(nonTerminals : Array<string>, terminals : Array<string>, rules : Array<{lhs : string; rhs : Array<string>}>, startSymbol : string) : Grammar
  {
    const tokenizedNonTerminals = nonTerminals.map(string => new Token(string));
    const tokenizedTerminals = terminals.map(string => new Token(string));
    Grammar.checkNonTerminalsAndTerminalsAreDisjunct(tokenizedNonTerminals, tokenizedTerminals);
    const tokenSortTable = Grammar.initializeTokenSortTable(tokenizedNonTerminals, tokenizedTerminals);
    const tokenizedRules = rules.map(rule => ProductionRule.fromString(rule.lhs, rule.rhs));
    const tokenizedStartSymbol = new Token(startSymbol);

    return new Grammar(tokenSortTable, tokenizedRules, tokenizedStartSymbol);
  }

  /**
   * Returns token table by value.
   */
  public getTokenSortTable() : TokenSortTable
  {
    const newtokenSortTable = {} as TokenSortTable;
    for(const token in this.tokenSortTable)
    {
      newtokenSortTable[token] = this.tokenSortTable[token];
    }
    return newtokenSortTable;
  }

  /**
   * Returns production rule list by value.
   */
  public getRules() : Array<ProductionRule>
  {
    return Utils.cloneArray(this.rules);
  }

  /**
   * Returns start symbol by value.
   */
  public getStartSymbol() : Token
  {
    return this.startSymbol.clone();
  }

  /**
   * Returns whether every production rule in the 
   * grammar is right regular.
   */
  public isRightRegular() : boolean
  {
    return this.rules.every(rule => rule.isRightRegular(this.tokenSortTable));
  }

  /**
   * Returns whether every procution rule in the 
   * grammar is left regular.
   */
  public isLeftRegular() : boolean
  {
    return this.rules.every(rule => rule.isLeftRegular(this.tokenSortTable));
  }

  /**
   * Returns whether every production rule
   * in the grammar is context free.
   */
  public isContextFree() : boolean
  {
    return this.rules.every(rule => rule.isContextFree(this.tokenSortTable));
  }

  /**
   * Returns whether every production rule 
   * in the grammar is context sensitive.
   * 
   */
  public isContextSensitive() : boolean
  {
    return this.rules.every(rule => rule.isContextSensitive(this.tokenSortTable));
  }

  /**
   * Returns whether the grammar
   * has any E rules.
   */
  public hasERules() : boolean
  {
    return this.rules.some(rule => rule.isERule(this.tokenSortTable));
  }

  /**
   * Returns the grammar type.
   */
  public type() : GrammarType
  {
    if(this.isRightRegular() || this.isLeftRegular())
    {
      return GrammarType.Type3;
    }
    else if(this.isContextFree())
    {
      return GrammarType.Type2;
    }
    else if(this.isContextSensitive())
    {
      return GrammarType.Type1;
    }
    else
    {
      return GrammarType.Type0;
    }
  }

  /**
   * Returns the [[ProductionRule]] whose left hand side
   * corresponds to the string passed.
   * 
   * If there is no such rule, returns undefined.
   * 
   * @param lhs 
   */
  public queryRule(lhs : TokenString) : ProductionRule | undefined
  {
    return this.rules.find(elem => elem.getLhs().isEqual(lhs))?.clone();
  }

  /**
   * Returns whether the grammar has 
   * Chomsky Normal Form, that is, let "A", "B"
   * and "C" be non terminals, "a" a terminal, "E" 
   * the empty string and "S" the start symbol.
   * 
   * All production rules must have the form:
   * 
   * A -> BC
   * A -> a
   * S -> E
   */
  public hasChomskyNormalForm() : boolean
  {
    const tokenSortTable = this.tokenSortTable;
    const startSymbol = this.startSymbol;
    return this.rules.every(rule =>
    {
      return rule.getLhs().size() === 1 &&
             tokenSortTable[rule.getLhs().tokenAt(0).toString()] === TokenSort.NonTerminal &&
             rule.getRhs().every(alternative => 
             {
               return (alternative.size() === 2 && alternative.every(token => tokenSortTable[token.toString()]   === TokenSort.NonTerminal)) || 
                      (alternative.size() === 1 && tokenSortTable[alternative.tokenAt(0).toString()] === TokenSort.Terminal) ||
                      (rule.getLhs().tokenAt(0).isEqual(startSymbol) && alternative.isEqual(TokenString.fromString("")));
             });
    });
  }

  /**
     * Returns the rule whose left hand side
     * corresponds to the starting symbol, if there is any
     * and undefined otherwise.
     */
  public getStartingRule() : ProductionRule | undefined
  {
    return this.getRules().find(rule => rule.getLhs().tokenAt(0).isEqual(this.getStartSymbol()) && rule.getLhs().size() === 1)?.clone();
  }

  /**
   * Deep copy
   */
  public clone() : Grammar
  {
    //Clone Token Table
    const newtokenSortTable : TokenSortTable = {};
    for(const token in this.tokenSortTable)
    {
      newtokenSortTable[token] = this.tokenSortTable[token];
    }

    //Clone Production Rules
    const newProductionRules = this.rules.map(rule => rule.clone());

    //Clone Start Symbol
    const newStartSymbol = this.startSymbol.clone();

    return new Grammar(newtokenSortTable, newProductionRules, newStartSymbol);
  }

  public isEqual(other : Grammar) : boolean
  {
    //Comparing Token Table
    let tokenSortTableIsEqual = false;
    for(const token in this.tokenSortTable)
    {
      if(this.tokenSortTable[token] !== other.getTokenSortTable()[token])
      {
        tokenSortTableIsEqual = true;
      }
    }

    return other instanceof Grammar &&
           tokenSortTableIsEqual &&
           this.rules.every((rule, index) => rule.isEqual(other.getRules()[index])) &&
           this.startSymbol.isEqual(other.getStartSymbol());
  }

  public listTerminals() : Array<Token>
  {
    const terminals = [];
    for(const token in this.tokenSortTable)
    {
      if(this.tokenSortTable[token] === TokenSort.Terminal)
      {
        terminals.push(new Token(token));
      }
    }

    return terminals;
  }

  public listNonTerminals() : Array<Token>
  {
    const nonTerminals = [];
    for(const token in this.tokenSortTable)
    {
      if(this.tokenSortTable[token] === TokenSort.NonTerminal)
      {
        nonTerminals.push(new Token(token));
      }
    }

    return nonTerminals;
  }

  public isChomskyRightRegular() : boolean
  {
    return this.rules.every(rule => rule.isChomskyRightRegular(this.getTokenSortTable()));
  }

  public isChomskyLeftRegular() : boolean
  {
    return this.rules.every(rule => rule.isChomskyLeftRegular(this.getTokenSortTable()));
  }

  public isExtendedChomskyRightRegular() : boolean
  {
    return this.rules.every(rule => rule.isExtendedChomskyRightRegular(this.getTokenSortTable()));
  }

  public isExtendedChomskyLeftRegular() : boolean
  {
    return this.rules.every(rule => rule.isExtendedChomskyLeftRegular(this.getTokenSortTable()));
  }

  private readonly tokenSortTable : TokenSortTable;
  private readonly rules : Array<ProductionRule>;
  private readonly startSymbol : Token;
}
