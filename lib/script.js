new Vue({
  el: "#app",
  data: {
    equation: "0", //计算结果
    isDecimalAdded: false, //检测是否已经输入小数位，防止按多了
    isOperatorAdded: false, //检测是否已经输入运算符号，防止按多了
    isStarted: false, //检测是否已经开始输入数字
    isOver: false, //检测是否已经出来结果了
  },
  methods: {
    // 检查是否是运算符号
    isOperator(character) {
      // 将四个运算符作为数组，判断传入的参数是否在这个数组里面，如果数值是0,1,2,3中的任意一个，也就是>-1话，就存在
      var boolean = ["+", "-", "×", "÷"].indexOf(character) > -1;
      return boolean;
    },

    // 点击加减乘除或者小数点的时候
    // 一定要注意，在一个函数中调用本文件的另一个函数，要用this。
    append(character) {
      // 【自由发挥】判断：如果计算已经结束，并且输入的不是运算符，就AC一下。
      if (this.isOver === true && !this.isOperator(character)) {
        this.clear();
      }

      // 判断当前结果为0，且输入的不是运算符，则可以正常输入
      if (this.equation === "0" && !this.isOperator(character)) {
        // 判断如果是输入了小数点，则保留0
        if (character === ".") {
          // '' + charactor 的写法，是为了将结果转换为string
          this.equation += "" + character;
          // 标记已经输入了数字
          this.isDecimalAdded = true;
        } else {
          this.equation = "" + character;
          this.isDecimalAdded = false;
        }
        // 标记，已经开始计算了
        this.isStarted = true;
        // 结束
        return;
      }

      // 按多个数字按键，以输入更长的数字
      if (this.isOperator(character) === false) {
        // 如果已经输入了小数点，又输入的话，就无效
        if (character === "." && this.isDecimalAdded === true) {
          return;
        }
        // 只要输入小数点，那么就标记“已经输入了小数点”
        if (
          character === "." &&
          this.isOperator(this.equation[this.equation.length - 1])
        ) {
          // 【自由发挥】如果输入小数点的时候，检测到前面一位是运算符号，则补一个0
          this.equation += "" + "0";
          this.isDecimalAdded = true;
        } else if (character === ".") {
          // 这里上面的else不能不加条件，要不然要出大问题
          this.isDecimalAdded = true;
        }
        this.equation += "" + character;
        // 【自由发挥】标记一下这里已经重新输入了数字，就可以再输入运算符号了
        this.isOperatorAdded = false;
      }

      // 当输入的是运算符号的时候，将运算符号加入equation，并重新允许输入小数点
      if (
        this.isOperator(character) === true &&
        this.isOperatorAdded !== true
      ) {
        // 【自由发挥】增加一个小处理，如果发现运算符号前一位是一个小数点，那么补个零/或者是去掉小数点，再执行
        if (this.equation.charAt(this.equation.length - 1) === ".") {
          // this.equation += '' + '0'
          this.equation = this.equation.substring(0, this.equation.length - 1);
        }
        this.equation += "" + character;
        this.isDecimalAdded = false;
        this.isOperatorAdded = true;
      }
    },
    // 点击等于号的时候
    calculate() {
      // 首先通过正则表达式，将乘除号换成*、/号   '×', '÷'
      let result = this.equation
        .replace(new RegExp("×", "g"), "*")
        .replace(new RegExp("÷", "g"), "/");
      // 通过eval函数计算表达式结果，为避免余数太多，使用toFixed()函数做限制
      this.equation = parseFloat(eval(result).toFixed(9)).toString();
      // 【自由发挥】标记一下是否已经输出了结果，如果输出了结果，再次输入运算符号的话，就保留equation的内容；再次输入另外的按键，则清掉equation的内容
      this.isOver = true;
    },
    isNumber(character) {
      // 【自由发挥】通过正则表达式，判定当前数字是否是正负整数或者正负小数
      const regex = /^-?\d+(\.\d*)?$/gm;
      // exec是专门用在正则表达式里的验证方法，只要匹配到了，就有返回值；不然就返回null
      var result = regex.exec(character) !== null;
      console.log("result is", result);
      return result;
    },
    // 点击正负号的时候
    calculateToggle() {
      console.log("equation is", this.equation);
      // 必须保证当前equation是个数字(不分正负，可以以-开头，可以有小数)，切不为0，才能用这个正负号
      if (this.isNumber(this.equation) && this.equation !== "0") {
        this.equation += "" + "* -1";
        this.calculate();
      } else {
        return;
      }
    },
    // 点击百分比的时候
    calculatePercentage() {
      console.log("equation is", this.equation);
      // 必须保证当前equation是个数字(不分正负，可以以-开头，可以有小数)，切不为0，才能用这个正负号
      if (this.isNumber(this.equation) && this.equation !== "0") {
        this.equation += "" + "* 0.01";
        this.calculate();
      } else {
        return;
      }
    },
    // 点击AC，将所有的值设为初始化，需要注意的是，这里不是一个参数列表，其语法与Vue初始化有些区别
    clear() {
      this.equation = "0";
      this.isDecimalAdded = false;
      this.isOperatorAdded = false;
      this.isStarted = false;
      this.isOver = false;
    },
  },
});
