import { observer } from 'mobx-react-lite';
import { PackagesFilter } from './PackagesFilter';
import { filter } from '../../store/filter';

export const PackagesIgnoreFilter = observer(() => {
  return (
    <PackagesFilter
      placeholder="Ignore packages"
      onAdd={filter.ignorePackages.add}
      onRemove={filter.ignorePackages.remove}
      onReset={filter.ignorePackages.reset}
      packages={[...filter.ignorePackages.options]}
    />
  );
});