import {expect, test} from '@oclif/test'

describe('decodeObject', () => {
  test
  .stdout()
  .command(['decodeObject'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['decodeObject', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
