import {expect, test} from '@oclif/test'

describe('encodeBuffer', () => {
  test
  .stdout()
  .command(['encodeBuffer'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['encodeBuffer', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
