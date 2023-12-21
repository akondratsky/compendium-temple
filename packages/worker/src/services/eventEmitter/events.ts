export enum WorkerEvent {
  // TaskRunnerService
  PauseTaskRunner = 'PAUSE_TASK_RUNNER',
  RunTaskRunner = 'RUN_TASK_RUNNER',
  ToggleTaskRunner = 'TOGGLE_TASK_RUNNER',

  // Authorization
  GithubAuthorization = 'GITHUB_AUTHORIZATION',

  // GUI
  Rerender = 'RERENDER',
  OpenAuthDialog = 'OPEN_AUTH_DIALOG',
  CloseAuthDialog = 'CLOSE_AUTH_DIALOG',
  GuiLog = 'GUI_LOG',
}

export type WorkerEventToPayload = {
  [WorkerEvent.OpenAuthDialog]: {
    url: string;
    code: string;
  };
  [WorkerEvent.GuiLog]: {
    level: 'info' | 'warn' | 'error' | 'log';
    message: string;
  };
};

