import axios from "axios";
import {List} from "immutable";
import {Pipeline} from "./types/Pipeline";
import {getLastTag} from "./utils/getLastTag";

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

  public async getLastTag(): Promise<{name: string}> {
    const result = await axios.get(
      `${this.baseUrl}/projects/${this.projectNo}/repository/tags`,
      this.headers,
    );
    return getLastTag(result.data);
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
