import { Container } from 'inversify';
import * as Interface from './interfaces';
import { Injectable } from './injectables';
import { Cli } from './services/Cli';

/** Dependency Injection Container */
export const dic = new Container();

dic.bind<Interface.ICli>(Injectable.Cli).to(Cli);
