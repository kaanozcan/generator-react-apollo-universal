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
    }]);
  }

  createPackageJson () {
    const pkgJson = { dependencies, devDependencies };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  generateInitialStructure () {
    const {
      appName,
    } = this.answers;

    this.config.set("appName", appName);

    const templatePath = this.templatePath("initial-project-structure/**/(*|.*)");

    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationRoot(),
      {
        appName
      }
    );

    this.createPackageJson();
    this.config.save();
  }

  install () {
    this.npmInstall();
  }
};
