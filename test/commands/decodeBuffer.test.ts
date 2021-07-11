import {expect, test} from '@oclif/test'

describe('decodeBuffer', () => {
  test
  .stdout()
  .command(['decodeBuffer'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['decodeBuffer', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
