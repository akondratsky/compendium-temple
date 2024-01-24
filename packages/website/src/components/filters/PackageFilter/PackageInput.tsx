import { useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AutoComplete } from 'antd';
import { searchPackages } from '../../../services/packages';
import { PkgOption, filter } from '../../../store/filter';

export const PackageInput = observer(() => {
  const [value, setValue] = useState('');

  const searchHandler = (value: string) => {
    searchPackages(value).then((packages) => filter.setPkgSuggestions(packages));
  };

  const changeHandler = (value: string) => setValue(value);

  const selectHandler = useCallback((value: string, option: PkgOption) => {
    setValue('');
    filter.addPackage(option)
  }, []);

  return (
    <AutoComplete
      style={{ width: '100%' }}
      notFoundContent="No packages found"
      value={value}
      placeholder="Filter by packages"
      onChange={changeHandler}
      options={[...filter.pkgSuggestions]}
      onSelect={selectHandler}
      onSearch={searchHandler}
    />
  )
});