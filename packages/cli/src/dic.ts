import { Container } from 'inversify';
import * as Interface from './interfaces';
import { DI } from './di';
import { Cli } from './cli';

/** Dependency Injection Container */
export const dic = new Container();

dic.bind<Interface.ICli>(DI.Cli).to(Cli);