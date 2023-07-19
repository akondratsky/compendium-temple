import 'reflect-metadata';
import { Lifecycle, container } from 'tsyringe';

import * as Interface from './interfaces';
import { Injectable } from './injectables';

import { Cli } from './services/Cli';
import { WorkerVersionManager } from './services/WorkerVersionManager';
import { ConfigurationManager } from './services/ConfigurationManager';
import { AutoUpdater } from './services/AutoUpdater';

container
  .register<Interface.ICli>(Injectable.Cli, { useClass: Cli })
  .register<Interface.IWorkerVersionManager>(Injectable.WorkerVersionManager, { useClass: WorkerVersionManager })
  .register<Interface.IConfigurationManager>(
    Injectable.ConfigurationManager,
    { useClass: ConfigurationManager },
    { lifecycle: Lifecycle.Singleton },
  )
  .register<Interface.IAutoUpdater>(Injectable.AutoUpdater, { useClass: AutoUpdater });

container.resolve<Interface.ICli>(Injectable.Cli).start();
