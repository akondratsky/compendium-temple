import { container } from 'tsyringe';
import { Main } from './Main';

export const start = () => container.resolve(Main).start();
