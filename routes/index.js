let express = require('express');
let router = express.Router();

/**
 * using stack will hurt nodeJS performance
 * @param n
 * @returns {number}
 */
function fiboStackBased (n) {
    return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}

/**
 * loop based algothem is faster
 * @param n
 * @returns {*}
 */
function fiboLoopBased(n) {
    let fibo = [];
    fibo[0] = 0;
    fibo[1] = 1;
    fibo[2] = 1;
    for (let i = 3; i <= n; i++) {
        fibo[i] = fibo[i-2] + fibo[i-1];
    }
    return fibo[n];
}

/**
 * This example is still using stack based to demonstrate the inefficient Fibonacci algorithm, but
 * by using setImmediate, each stage of the calculation is managed through the Node.js's event loop,
 * and the server can easily handle other requests while churning away on a calculation.
 * @param n
 * @param done
 */
function fiboAsyncBased(n, done = (/*error, result*/) => {}) {
  return n > 1 ? setImmediate(() => {
      fiboAsyncBased(n - 1, (error, value1)  =>  {
          if (error) {
              done(error);
          } else {
              setImmediate(() => {
                  fiboAsyncBased(n - 2, (error, value2) => {
                      if (error) {
                          done(error);
                      } else {
                          done(null, value1 + value2);
                      }
                  });
              });
          }
      });
  }) : done(null, 1);
}

function fibo(n) {
  return fiboLoopBased(n);
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', output: 'go to /slow to run computation heavy task \n then go to /fast'});

});

router.get('/slow', function(req, res, next) {
    res.render('index', { title: 'slow for 40', output: `result is ${fibo(40)}` });
});

router.get('/slow/:number', function(req, res, next) {
    let number = req.params.number;
    try {
        res.render('index', { title: `slow for ${number}`, output: `result is ${fibo(parseInt(number))}` });
    } catch (error) {
        res.render('index', { title: `slow for ${number}`, output: `result is ${error}` });
    }

});

router.get('/fast', function(req, res, next) {
    res.render('index', { title: 'fast', output: 'done' });
});

router.get('/async/slow', function(req, res, next) {
    fiboAsyncBased(40, (error, result) => {
        res.render('index', { title: 'slow for 40', output: `result is ${result}` });
    });

});

router.get('/async/slow/:number', function(req, res, next) {
    let number = req.params.number;
    try {
        fiboAsyncBased(parseInt(number) , (error, result) => {
            res.render('index', { title: `slow for ${number}`, output: `result is ${result}` });
        });
    } catch (error) {
        res.render('index', { title: `slow for ${number}`, output: `result is ${error}` });
    }

});


module.exports = router;
