import chalk from 'chalk';

/**
 * @param condition if not true, prints message and exits the application
 * @param message error message
 */
export const validateOrExit = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(chalk.bold.red(message));
    process.exit(1);
  } 
};
