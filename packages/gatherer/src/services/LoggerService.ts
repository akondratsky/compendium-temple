import { singleton } from 'tsyringe';
import chalk from 'chalk'
@singleton()
export class LoggerService {
  public log(msg: string) {
    console.log(chalk.gray(msg));
  }

  public warn(msg: string) {
    console.log(chalk.yellow(msg));
  }

  public info(msg: string) {
    console.log(msg);
  }
}
