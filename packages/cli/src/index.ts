import 'reflect-metadata';
import { container } from 'tsyringe';
import { Cli } from './services/cli';

container.resolve(Cli).start();
