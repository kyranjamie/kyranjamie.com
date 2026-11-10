import process from 'node:process'

if (process.env.KYRANJAMIE_COM_CONTAINER !== '1' && process.env.GITHUB_ACTIONS !== 'true') {
  process.stderr.write('Run project commands from inside the kyranjamie.com devcontainer.\n')
  process.exit(1)
}
