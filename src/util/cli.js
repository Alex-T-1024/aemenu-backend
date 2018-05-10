process.stdin.setEncoding('utf8')

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    receiveAndRun(chunk)
  }
})

process.stdin.on('end', () => {
  process.stdout.write('stdin end')
})

function receiveAndRun(cmd) {
  cmd = cmd.trim()
  var cmdFunc = cmdList[cmd]
  if (cmdFunc != null) {
    cmdFunc()
  }else {
    console.error('Command not exists!')
  }
}

var cmdList = {}
function addCliCommand(cmdName, cmdFunc) {
  if (typeof cmdFunc === 'function') {
    cmdList[cmdName] = cmdFunc
  } else {
    console.error('Add CLI command failed!')
  }
}

export default addCliCommand
