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

    const formatValue = pangu.spacing(value);
    editor.setValue(formatValue);
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
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText(text =>
        text
          .setPlaceholder("Enter your secret")
          .setValue("")
          .onChange(async value => {
            console.log("Secret: " + value);
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
