class ExpansionRule {
  ruleMap: Map<string, string> = new Map();
  constructor() {

  }

  clearRule() {
    this.ruleMap.clear();
  }

  addRule(key: string, val: string) {
    this.ruleMap.set(key, val);
  }

  process(strIn: string, iter: number): string {
    let str: string = strIn;
    for (var i = 0; i < iter; ++i) {
      let strT: string = "";
      for (var j = 0; j < str.length; ++j) {
        let curChar: string = str.substring(j, j + 1);
        if (this.ruleMap.has(curChar)) {
          strT += this.ruleMap.get(curChar);
        } else {
          strT += curChar;
        }
      }
      str = strT;
    }
    
    return str;
  }

}

export default ExpansionRule;