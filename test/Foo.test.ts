import {Foo} from '../src/Foo'

describe('Foo', () => {
  it('bar', () => {
    expect(new Foo().bar()).toEqual('bar')
  })
})
