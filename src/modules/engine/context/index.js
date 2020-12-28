import * as _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';
import { EngineObservable } from '@/modules/engine/core/engine.observable';
import { EngineScript } from '@/modules/engine/core/engine.script';
import { TemplateEngine } from '@/modules/engine/core/template.engine';

export default {
  services: { Engine, EngineObservable, EngineScript, TemplateEngine },
  libraries: { _ }
};

