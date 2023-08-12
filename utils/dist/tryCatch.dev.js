/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
/* eslint-disable no-undef */
exports.tryCatch = function (controller) {
  return function _callee(req, res, next) {
    return regeneratorRuntime.async((_context) => {
      // eslint-disable-next-line no-constant-condition
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(controller(req, res));

          case 3:
            _context.next = 8;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context.catch(0);
            return _context.abrupt('return', next(_context.t0));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, null, null, [[0, 5]]);
  };
};
