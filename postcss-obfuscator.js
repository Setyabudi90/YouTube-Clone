const crypto = require("crypto");

const classNameMap = new Map();

function generateHash(input) {
  return crypto.createHash("md5").update(input).digest("hex").slice(0, 6);
}

module.exports = () => {
  return {
    postcssPlugin: "postcss-obfuscator",
    Rule(rule) {
      rule.selector = rule.selector.replace(/[.#][A-Za-z0-9_-]+/g, (match) => {
        if (!classNameMap.has(match)) {
          classNameMap.set(match, match[0] + generateHash(match));
        }
        return classNameMap.get(match);
      });
    },
  };
};

module.exports.postcss = true;
