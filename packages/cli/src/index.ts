import 'reflect-metadata';
import { dic } from './dic';
import { Injectable } from './injectables';
import { ICli } from './interfaces';

dic.get<ICli>(Injectable.Cli).start();


