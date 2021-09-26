var isNode = require('../utils/index.js').isNode;

module.exports = !isNode
    ? require('./browser/index.js')
    : function () {
          throw new Error("[rempl] createSundbox() doesn't supported on node.js");
      };
