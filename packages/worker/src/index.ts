import 'reflect-metadata';
import { container } from 'tsyringe';
import { Main } from './main';

/**
 * The only single method of `@compendium-temple/worker` used for running all jobs
 */
export const start = () => container.resolve(Main).start();
