import { program } from 'commander';
export * from './AbstractWorker';

type CliOptions = {
  registry?: string;
}

export const start = async () => {
  program
    .option('-r, --registry <string>', 'registry URL', undefined)
    .action((params: CliOptions) => {
      console.log('not implemented yet', params);
    })
    .parse();
};

export default start;
