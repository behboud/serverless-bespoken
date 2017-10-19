# Bespoken Serverless Plugin

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

A [serverless](http://www.serverless.com) plugin using [bespoken](https://bespoken.io) proxy to test your work without deploying.

# Install

```
npm install serverless-plugin-bespoken --save-dev
```

Add the plugin to your `serverless.yml` file:
```yaml
plugins:
  - serverless-plugin-bespoken
```

You're set! The plugin will run by using `sls proxy`.

Works also with serverless-offline.

Now you can use the generated url and access directly to your local server.
