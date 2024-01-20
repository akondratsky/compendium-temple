import 'reflect-metadata';
import { container } from 'tsyringe';
import { Cli } from './Cli';

container.resolve(Cli).start();
