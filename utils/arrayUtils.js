Array.prototype.random = function () {
  const r = Math.floor(Math.random() * this.length);
  return this[r];
};

module.exports = Array.prototype;
