import 'reflect-metadata';
import * as jestExtendedMatchers from 'jest-extended';
import 'jest-extended';
import { Lifecycle, container } from 'tsyringe';

expect.extend(jestExtendedMatchers);


global.createTestDI = (...classes) => {
  const di = container.createChildContainer();
  classes?.forEach((service) => {
    di.register(service, { useClass: service }, { lifecycle: Lifecycle.Singleton });
  });
  return di;
};
