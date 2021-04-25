import {
  App,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  MarkdownView,
} from "obsidian";
import { Editor } from "codemirror";

import * as pangu from "./pangu.min.js";

import prettier from "prettier/esm/standalone";
import markdown from "prettier/esm/parser-markdown";
import babel from "prettier/esm/parser-babel";
import html from "prettier/esm/parser-html";

import * as p from "prettier";
p.format;
const REGEX_CODE = /```[\s\S]*?```/g;
interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: "default",
};

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: "format",
      name: "format",
      callback: () => {
        this.format();
      },
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  getEditor(): Editor {
    let view = this.app.workspace.activeLeaf.view as MarkdownView;
    return view.sourceMode.cmEditor;
  }

  format() {
    const editor = this.getEditor();
    const value = editor.getValue();

    let formatValue = pangu.spacing(value);
    formatValue = formatValue.replaceAll(REGEX_CODE, (match: string) => {
      const text: string = prettier.format(match, {
        parser: "markdown",
        plugins: [markdown, babel, html],
        // cursorOffset: position,
        embeddedLanguageFormatting: "auto",
        proseWrap: "always",
      });
      console.log(match.length, text.length);
      return match;
      return this.rtrim(text);
    });
    editor.setValue(formatValue);
  }
  rtrim(str: string) {
    //删除右边的空格
    return str.replace(/(\n$)/g, "");
  }

  formatCode(value: string) {
    REGEX_CODE;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

    new Setting(containerEl)
      .setName("Format on Save")
      .setDesc("")
      .addText(text =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async value => {
            // console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );

    // new Setting(this.containerEl)
    // .setName(file.path.replace(".md", ""))
    // .addToggle(cb => cb
    //   .setValue(this.templateIsEnabled(file))
    //   .onChange((value) => this.onToggleChange(value, file)));

    // saveCallback
    // private saveCallback = () => undefined;
    //   const save = (this.saveCallback = (this.app as any).commands?.commands?.[
    //     "editor:save-file"
    //   ]?.callback);

    //   if (save) {
    //     (this.app as any).commands.commands["editor:save-file"].callback = () => {
    //       if (this.settings.formatOnSave) {
    //         this.formatAll();
    //       }

    //       save();
    //     };
    //   }
    // }
  }
}
