class UniqueNumber {

  constructor(length) {
    this.length = length;
    this.hash = {};
    this.minValue = 10 ** (length - 1) + 1;
    this.maxValue = 10 ** length - 1;
    this.intervalValue = this.maxValue - this.minValue + 1;
  }

  generate() {
    let maxLoop = 150000;
    while (maxLoop-- > 0) {
      const value = Math.floor(this.minValue + Math.random() * this.intervalValue);
      if (!this.hash[value]) {
        this.hash[value] = 1;
        return value;
      }
    }
    return -1;
  }

  isValid(value) {
    return this.hash[value] != null;
  }

  inValidate(value) {
    this.hash[value] = null;
  }

  initValues(values = []) {
    console.log('UniqueNumber.initValues');
    const p = [];
    values.forEach((v) => {
      try {
        const n = parseInt(v, 10);
        if (this.minValue <= n && n <= this.maxValue) {
          this.hash[n] = 1;
          p.push(n);
        }
      } catch (err) {
        console.log(err);
      }
    });
    console.log(p);
  }
}

module.exports = {
  UniqueNumber
};
