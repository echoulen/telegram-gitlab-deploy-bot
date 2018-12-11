import {autobind} from "core-decorators";
import TgBot from "node-telegram-bot-api";
import {GitExecutor} from "./GitExecutor";
import {buildTagOptions, TagType} from "./utils/buildTagOptions";
import {editButton} from "./utils/editButton";
import {showMessage} from "./utils/showMessage";

export class TelegramBot {

  private readonly bot: TgBot;
  private readonly gitExecutor: GitExecutor;
  private readonly regex: RegExp;
  private preStatus = null;

  constructor({gitlabUrl, projectNo, branch, gitToken, botCommand, botToken}) {
    this.bot = new TgBot(botToken, {polling: true});
    this.gitExecutor = new GitExecutor({gitlabUrl, gitToken, projectNo, branch});
    this.regex = new RegExp("/" + botCommand);
  }

  public start() {
    this.bot.onText(this.regex, this.onText);
    this.bot.on("callback_query", this.onCallBack);
  }

  @autobind
  private async onText(msg) {
    await this.bot.sendMessage(msg.chat.id, `please choose the deploy target`, {
      reply_markup: {
        inline_keyboard: [[
          {text: "rc", callback_data: "target-rc"},
          {text: "production", callback_data: "target-production"},
        ]],
      } as any,
    });
  }

  @autobind
  private async onCallBack(query: {data: string, message: any}) {
    const bot = this.bot;
    const callBackData = query.data;
    if (callBackData === "done") {
      return;
    } else if (callBackData.indexOf("target-") === 0) {
      const lastTag = await this.gitExecutor.getLastTag();
      const type = callBackData.split("-")[1] === "rc" ? TagType.RC : TagType.PRODUCTION;
      const options = buildTagOptions(lastTag, type);
      editButton(bot, query, options.toArray());

    } else if (callBackData === `cancel-tag`) {
      editButton(bot, query, [{text: "deployment canceled", callback_data: "done"}]);

    } else if (callBackData.indexOf(`cancel-tag-`) === 0) {
      const tag = callBackData.replace("cancel-tag-", "");
      await this.gitExecutor.cancelPipeline(tag);
      await this.gitExecutor.removeTag(tag);
      editButton(bot, query, [{text: "deployment canceled", callback_data: "done"}]);
      showMessage(bot, query, "deployment canceled");

    } else if (callBackData.indexOf(`add-tag-`) === 0) {
      const tag = callBackData.replace(`add-tag-`, "");
      await this.gitExecutor.sendNewTag(tag);
      showMessage(bot, query, `deployment ${tag}`);
      setTimeout(await this.startWorker(query), 1000);
    }
  }

  @autobind
  private startWorker(query: {data: string, message: any}): () => Promise<void> {
    const bot = this.bot;
    const callBackData = query.data;
    const tag = callBackData.replace("add-tag-", "");
    return async () => {
      const pipeline = await this.gitExecutor.getPipeline(tag);
      const status = pipeline.status;
      if (status === "pending" || status === "running") {
        if (this.preStatus !== status) {
          editButton(bot, query, [
            {text: `${tag} ${status}`, url: pipeline.web_url},
            {text: "取消", callback_data: `cancel-tag-${tag}`},
          ]);
          this.preStatus = status;
        }
        setTimeout(await this.startWorker(query), 10000);
      } else if (status === "canceled") {
        editButton(bot, query, []);
      } else {
        editButton(bot, query, []);
        const resultMessage = status === "success" ? "deployment finish" : "deployment failure";
        await bot.sendMessage(query.message.chat.id, resultMessage);
      }
    }
  }
}
