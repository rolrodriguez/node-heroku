const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/math', (req, res) => {
  var op1 = Number(req.query.op1);
  var op2 = Number(req.query.op2);
  var oper = req.query.operation;
  var result = 0;
  switch (oper) {
    case "add":
      result = op1 + op2;
      break;
    case "sub":
      result = op1 - op2;
      break;
    case "mul":
      result = op1 * op2;
      break;
    case "div":
      result = op1 / op2;
      break;
    default:
      break;
  }
  // console.log(result);
  res.render('result', {oper, result});
});

app.get('/math_service', (req, res) => {
  var op1 = Number(req.query.op1);
  var op2 = Number(req.query.op2);
  var oper = req.query.operation;
  var result = 0;
  switch (oper) {
    case "add":
      result = op1 + op2;
      break;
    case "sub":
      result = op1 - op2;
      break;
    case "mul":
      result = op1 * op2;
      break;
    case "div":
      result = op1 / op2;
      break;
    default:
      break;
  }
  // console.log(result);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ oper, result }));
  // res.render('result', {oper, result});
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
})