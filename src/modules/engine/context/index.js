import * as _ from 'lodash';
import { Engine } from '@/modules/engine/core/engine';
import { EngineObservable } from '@/modules/engine/core/engine.observable';
import { EngineScript } from '@/modules/engine/core/engine.script';
import { TemplateEngine } from '@/modules/engine/core/template.engine';
import { ModelService } from '@/modules/engine/services/model.service';
import { RestQuery } from '@/modules/engine/services/rest.query';
import { EngineForm } from '@/modules/form/engine-api/engine.form';
import { FormWidgetService } from '@/modules/form/services/form.widget.service';

export default {
  services: {
    Engine,
    EngineObservable,
    EngineScript,
    TemplateEngine,
    ModelService,
    RestQuery,
    EngineForm,
    FormWidgetService,
  },
  libraries: { _ }
};

