const bst = require("bespoken-tools");
const BSTProxy = bst.BSTProxy;
const homeDir = require("os").homedir();
const path = require("path");
const fs = require("fs");

class ServerlessPluginBespoken {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.BespokeServerHost = "proxy.bespoken.tools";
    this.SpokesPipeDomain = "bespoken.link";
    this.SpokesDashboardHost = "bespoken.tools/dashboard";

    this.commands = {
      proxy: {
        commands: {
          start: {
            usage: "Plugin to call bespoken bst lambda service",
            lifecycleEvents: ["proxyStart"],
            options: {
              location: {
                usage: "The root location of the handlers' files.",
                required: false,
                shortcut: "l"
              },
              function: {
                usage: "The name of the function handler",
                required: false,
                shortcut: "f"
              }
            }
          }
        }
      }
    };

    this.proxy = BSTProxy.lambda(
      serverless.service.functions.handler || options.l || options.location,
      options.f || options.function
    );
    this.handleProxyOptions(this.proxy, options);

    this.hooks = {
      "proxy:start:proxyStart": this.proxyStart.bind(this),
      "before:offline:start:init": this.proxyStart.bind(this),
      "before:offline:start": this.proxyStart.bind(this),
      "before:offline:start:end": this.proxyEnd.bind(this)
    };
  }

  handleProxyOptions(proxy, options) {
    if (options.bstHost) {
      proxy.bespokenServer(options.bstHost, options.bstPort);
    }

    if (options.targetDomain) {
      proxy.targetDomain(options.targetDomain);
    }

    if (options.secure) {
      proxy.activateSecurity();
    }
  }

  proxyEnd() {
    this.proxy.stop(() => {
      this.serverless.cli.log("stopped proxy");
    });
  }

  proxyStart() {
    this.proxy.start(() => {
      const config = JSON.parse(
        fs.readFileSync(path.join(homeDir, ".bst/config"), "utf8")
      );
      this.serverless.cli.log(
        `Your public URL for accessing your local service:
          https://${config.sourceID}.${this.SpokesPipeDomain}

          Your URL for viewing requests/responses sent to your service:
          https://${this.SpokesDashboardHost}?id=${config.sourceID}&key=${
          config.secretKey
        }
          Copy and paste this to your browser to view your transaction history and summary data.`
      );
    });
  }
}

module.exports = ServerlessPluginBespoken;
