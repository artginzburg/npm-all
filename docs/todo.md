- Think about using the following in root tsconfig.json:

```json
{
  "compilerOptions": {
    "outDir": "./lib",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["./packages/*/src"]
}
```
