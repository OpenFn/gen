This is a Typescript that can return a representation of the API of any given
adaptor.

## Useage

Pass an adaptor name and version in the payload:

```
{
  adaptor: '@openfn/language-http@2.0.0
}
```

And it'll return a representation of that adaptor (and dependencies):

```
{
  '@openfn/language-common': {
      version: '1.0.0',
      description: ' /* d.ts files merged into one */
  }
  '@openfn/language-http': {
    version: '1.0.0',
    description: ' /* d.ts files merged into one */
  }
}
```

Right now it'll only support one adaptor, but it woudl be easy to support an
array of inputs

## Representation formats

Right now the function will only return the raw d.ts representation of the
adaptor (which is what our current AI services require).

Later, we should also return a proprietary docs format used by adaptor-docs in
Lightning (If there's a solid and simple standard for describing a JS library in
JSON, I'm all for it)
