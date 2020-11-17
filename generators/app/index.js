const Generator = require('yeoman-generator');
const path = require("path");
const {
  dependencies,
  devDependencies
} = require("./constants/dependencies");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
  }

  async doPrompting () {
    this.answers = await this.prompt([{
      type    : "input",
      name    : "appName",
      message : "Name of your project",
      default: this.config.get("appName")
    }, {
      type: "confirm",
      name: "isPM2Enabled",
      message: "Would you like to have PM2 enabled? (Not recommended for containerized infastructures such as kubernates)",
      default: this.config.get("isPM2Enabled")
    }]);
  }

  createPackageJson () {
    const pkgJson = { dependencies, devDependencies };

    const {
      isPM2Enabled
    } = this.answers;

    if (!isPM2Enabled) {
      delete pkgJson.dependencies.pm2;
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  generateInitialStructure () {
    const {
      appName,
      isPM2Enabled
    } = this.answers;

    this.config.set("appName", appName);
    this.config.set("isPM2Enabled", isPM2Enabled);

    const templatePath = this.templatePath("initial-project-structure/**/(*|.*)");
    
    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationRoot(),
      {
        appName,
        isPM2Enabled
      }
    );

    if (isPM2Enabled) {
      const pm2TemplatePath = this.templatePath("pm2/**/(*|.*)");

      this.fs.copyTpl(
        this.templatePath(pm2TemplatePath),
        this.destinationRoot(),
        {
          appName
        }
      );
    }

    this.createPackageJson();
    this.config.save();
  }

  install () {
    this.npmInstall();
  }
};
