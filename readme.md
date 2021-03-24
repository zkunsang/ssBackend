## How to run test code with **Terminal**

NODE_ENV=apiLocal mocha test/controllerTest.spec.js --exit

## How to run test code with **Debug** on Visual studio

write on `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "args": [
        "--timeout",
        "999999",
        "--colors",
        "${workspaceFolder}/test/controller/authLogin.spec.js",
        "--exit"
      ],
      "internalConsoleOptions": "openOnSessionStart",
      "name": "[test]API",
      "program": "${workspaceFolder}\\node_modules\\mocha\\bin\\mocha",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "env": {
        "NODE_ENV": "apiLocal"
      },
      "type": "pwa-node"
    }
  ]
}
```
