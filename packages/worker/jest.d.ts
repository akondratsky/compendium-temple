import 'jest-extended';
import type { DependencyContainer } from 'tsyringe';

declare global {
  /**
   * Creates dependency container to inject all dependencies automatically
   * @param classes services to inject
   * @returns dependency container
   * @example ```ts
   *   const di = createTestDI(ConfigService, GuiService, AuthService, TaskRunnerService);
   *   di.resolve(ConfigService);
   * ```
   */
  export function createTestDI(...methods: ctor[]): DependencyContainer;
}
