import 'reflect-metadata';
import { dic } from './dic';
import { DI } from './di';
import { ICli } from './interfaces';

const cli = dic.get<ICli>(DI.Cli);

cli.start();
