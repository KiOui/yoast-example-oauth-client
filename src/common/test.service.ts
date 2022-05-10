import ApiService from "@/common/api.service";
import { AxiosResponse } from "axios";

class TestService {
  apiService = ApiService;

  async getTestData(): Promise<string> {
    const result: AxiosResponse<string> = await this.apiService.get(
      `test-endpoint`
    );
    return result.data;
  }
}

export default TestService;
