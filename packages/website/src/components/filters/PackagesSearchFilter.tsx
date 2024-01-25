import { observer } from 'mobx-react-lite';
import { PackagesFilter } from './PackagesFilter';
import { filter } from '../../store/filter';

export const PackagesSearchFilter = observer(() => {
  return (
    <PackagesFilter
      placeholder="Search packages"
      onAdd={filter.searchPackages.add}
      onRemove={filter.searchPackages.remove}
      onReset={filter.searchPackages.reset}
      packages={[...filter.searchPackages.options]}
    />
  );
});