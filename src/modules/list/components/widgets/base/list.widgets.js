import Guid from '@/modules/list/components/widgets/guid';
import BaseWidget from '@/modules/list/components/widgets/base-widget';
import Integer from '@/modules/list/components/widgets/integer';
import DateTime from '@/modules/list/components/widgets/datetime';
import Reference from '@/modules/list/components/widgets/reference';

export const LIST_WIDGETS = {
  'uuid': { widget: Guid, width: 250, sortable: false },
  'boolean': { widget: BaseWidget, width: 30, sortable: true },
  'number': { widget: Integer, width: 250, sortable: true },
  'integer': { widget: Integer, width: 80, sortable: true },
  'datetime': { widget: DateTime, width: 175, sortable: true },
  'input': { widget: BaseWidget, width: 175, sortable: false },
  'reference': { widget: Reference, width: 175, sortable: false }
};

