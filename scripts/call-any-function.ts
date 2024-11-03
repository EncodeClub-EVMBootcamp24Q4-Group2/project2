/**
  * Calls any function from a TypeScript file using nodejs
  *
  * https://stackoverflow.com/a/76936968/946957
  *
  * $ npx ts-node call-any-Function.ts ./task-ballot.ts/test/<argument1>/<argument2>
  *
  * $ npx ts-node call-any-function.ts task-ballot.ts/assignVoter/<userWalletAddress>/<ballotContractAddress>
  * 
  * $ npx ts-node call-any-function.ts task-ballot.ts/castVote/<proposalID>/<ballotContractAddress>
  * 
  * Debugging: 
  * https://www.totaltypescript.com/concepts/type-string-cannot-be-used-to-index-type
  * https://www.w3schools.com/jsref/jsref_split.asp
  * https://www.google.com/search?q=ES6+how+to+call+a+specific+function+from+the+CLI+with+node
  * https://www.google.com/search?q=node.js+call+a+specific+typescript+function+from+command+line 
  *
  */
import * as path from 'path';
const [, , command] = process.argv; // can also use: const command = process.argv.slice(2)
const [filePath, functionName, arg1, arg2, arg3] = command.split('/');
const modulePath = path.resolve(filePath);
const module1 = require(modulePath);


async function main() {

    // // DEBUGGING CODE:
    // console.log( "Args sent: ", command )
    // console.log( "Path Resolve:", modulePath )
    // console.log( await module1 )
    // console.log( "filePath:", filePath )
    // console.log( "functionName:", functionName);
    // console.log( "First Argument:", arg1 );
    // console.log( "Second Argument:", arg2 );   


    if (typeof module1[functionName] === 'function') {

        const functionToExecute = module1[functionName];
        (() => {
            functionToExecute(arg1, arg2);
        })();

    } else {

        console.error(`Function '${functionName}' not found in '${filePath}'.`);

    }

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
