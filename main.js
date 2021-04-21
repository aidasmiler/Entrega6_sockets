
const user = require("./cmds_user.js");
const quiz = require("./cmds_quiz.js");
const favs = require("./cmds_favs.js");
const readline = require('readline');

let net = require('net');
let port = process.argv[3] || 8080;
let host = process.argv[2] || "localhost";

//let socket = net.createConnection(port, host);

var server = net.createServer((socket) => {
  /*socket.write('Welcome (Echo server)\n');
  socket.on('data', function(data){
    socket.write(data);
  });*/
  socket.on('connect', function () {
    console.log("Server at port: " + port + " of " + host);    
  })


const rl = readline.createInterface({
  input: socket,
  output: socket,
  prompt: "> "
});

rl.log = (msg) => socket.write(msg);  // Add log to rl interface
rl.questionP = function (string) {   // Add questionP to rl interface
  return new Promise ( (resolve) => {
    this.question(`  ${string}: `, (answer) => resolve(answer.trim()))
  })
};

/*
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});
*/

/*rl.log = (msg) => console.log(msg);  // Add log to rl interface
//rl.log = (msg) => socket.write(msg+"\n");
rl.questionP = function (string) {   // Add questionP to rl interface
  return new Promise ( (resolve) => {
    this.question(`  ${string}: `, (answer) => resolve(answer.trim()))
  })
};
*/

rl.prompt();

rl.on('line', async (line) => {
  try{
    let cmd = line.trim()

    if      ('' ===cmd)   {}
    else if ('h' ===cmd)  { user.help(rl);}

    else if (['lu', 'ul', 'u'].includes(cmd)) { await user.list(rl);}
    else if (['cu', 'uc'].includes(cmd))      { await user.create(rl);}
    else if (['ru', 'ur', 'r'].includes(cmd)) { await user.read(rl);}
    else if (['uu'].includes(cmd))            { await user.update(rl);}
    else if (['du', 'ud'].includes(cmd))      { await user.delete(rl);}

    else if (['lq', 'ql', 'q'].includes(cmd)) { await quiz.list(rl);}
    else if (['cq', 'qc'].includes(cmd))      { await quiz.create(rl);}
    else if (['tq', 'qt', 't'].includes(cmd)) { await quiz.test(rl);}
    else if (['uq', 'qu'].includes(cmd))      { await quiz.update(rl);}
    else if (['dq', 'qd'].includes(cmd))      { await quiz.delete(rl);}

    else if (['lf', 'fl', 'f'].includes(cmd)) { await favs.list(rl);}
    else if (['cf', 'fc'].includes(cmd))      { await favs.create(rl);}
    else if (['df', 'fd'].includes(cmd))      { await favs.delete(rl);}

    else if ('e'===cmd)  { rl.log('Bye!');/* process.exit(0);*/ socket.destroy();}
    else                 {  rl.log('UNSUPPORTED COMMAND!');
                            user.help(rl);
                         };
    } catch (err) { rl.log(`  ${err}`);}
    finally       { rl.prompt(); }
  });
});
  server.listen(port);
 