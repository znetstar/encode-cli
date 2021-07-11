import {expect, test} from '@oclif/test'

describe('encodeObject', () => {
  test
  .stdout()
  .command(['encodeObject'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['encodeObject', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
