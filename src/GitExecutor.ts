import axios from "axios";
import {List} from "immutable";
import {Option} from "./types/Option";
import {Pipeline} from "./types/Pipeline";
import {buildTagOptions} from "./utils/buildTagOptions";

export class GitExecutor {
  private readonly baseUrl;
  private readonly projectNo;
  private readonly branch;
  private readonly headers;

  constructor({gitlabUrl, projectNo, branch, gitToken}) {
    this.baseUrl = `${gitlabUrl}/api/v4`;
    this.projectNo = projectNo;
    this.branch = branch;
    this.headers = {headers: {"PRIVATE-TOKEN": gitToken}};
  }

  public async getTagOptions(): Promise<List<Option>> {
    const result = await axios.get(
      `${this.baseUrl}/projects/${this.projectNo}/repository/tags`,
      this.headers,
    );
    const lastTag = List<{name: string}>(result.data).first();
    return buildTagOptions(lastTag);
  }

  public async sendNewTag(tag: string): Promise<void> {
    await axios.post(
      `${this.baseUrl}/projects/${this.projectNo}/repository/tags`,
      {tag_name: tag, ref: this.branch},
      this.headers,
    );
  }

  public async removeTag(tag: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/projects/${this.projectNo}/repository/tags/${tag}`, this.headers);
  }

  public async getPipeline(tag: string): Promise<Pipeline> {
    const result = await axios.get(
      `${this.baseUrl}/projects/${this.projectNo}/pipelines?ref=${tag}`,
      this.headers,
    );
    return List<Pipeline>(result.data).first();
  }

  public async cancelPipeline(tag: string): Promise<void> {
    const pipeline = await this.getPipeline(tag);
    await axios.post(
      `${this.baseUrl}/projects/${this.projectNo}/pipelines/${pipeline.id}/cancel`,
      null,
      this.headers,
    );
  }
}
