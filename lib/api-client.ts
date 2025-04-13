import { IVideo } from "@/models/Video";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

export type videoFormData = Omit<IVideo, "_id">

class ApiClient {
  private async myFetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.myFetch<IVideo[]>("/videos");
  }

  async getAVideo(id: string) {
    return this.myFetch<IVideo>(`/videos/${id}`);
  }

  async createVideo(videoData: videoFormData) {
    return this.myFetch("/videos", { method: "POST", body: videoData });
  }

}

export const apiClient = new ApiClient()
