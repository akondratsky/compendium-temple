import { inject, injectable } from 'tsyringe';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { upperCase } from 'lodash';
import { AuthService, IAuthService } from '../auth';
import { ConfigService, IConfigService } from '../config';
import { LoggerService } from '../logger';

export interface IHttpService {
  get<T>(url: string, config: AxiosRequestConfig<T>): Promise<AxiosResponse<T>>;
  post<T>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T>>;
  put<T>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T>>;
  patch<T>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T>>;
}

/**
 * Handling HTTP requests with authentication
 */
@injectable()
export class HttpService implements IHttpService {
  private readonly httpClient;

  constructor(
    @inject(ConfigService) private readonly config: IConfigService,
    @inject(AuthService) private readonly auth: IAuthService,
    @inject(LoggerService) private readonly logger: LoggerService,
  ) {
    this.httpClient = axios.create({
      baseURL: this.config.apiUrl,
    });
    this.httpClient.interceptors.response.use(
      (value) => value,
      (error) => {
        const method = upperCase(error.config.method);
        const url = `${error.config.baseURL}${error.config.url}`;
        const status = error.response.status;
        this.logger.error(`${method} ${url} request failed with status ${status}`);
        this.logger.info('Please try to restart the client.');
        process.exit();
      }
    );
  }

  private authorize() {
    this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${this.auth.token}`;
  }

  public async get<T>(url: string, config: AxiosRequestConfig<T>) {
    this.authorize();
    return this.httpClient.get(url, config);
  }

  public async post<T>(url: string, data?: T, config?: AxiosRequestConfig<T>) {
    this.authorize();
    return this.httpClient.post(url, data, config);
  }

  public async put<T>(url: string, data?: T, config?: AxiosRequestConfig<T>) {
    this.authorize();
    return this.httpClient.put(url, data, config);
  }

  public async patch<T>(url: string, data?: T, config?: AxiosRequestConfig<T>) {
    this.authorize();
    return this.httpClient.patch(url, data, config);
  }
}