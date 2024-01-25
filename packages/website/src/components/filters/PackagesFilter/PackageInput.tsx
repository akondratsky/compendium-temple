import { useCallback, useRef, useState } from 'react';
import { AutoComplete } from 'antd';
import { searchPackages } from '../../../services/packages';
import { search } from '../../../services/repos';
import { PkgOption, filter } from '../../../store/filter';
import { observer } from 'mobx-react-lite';

type PkgInputProps = {
  placeholder: string;
  onAdd: (pkg: PkgOption) => void;
};

export const PkgInput = observer(({ onAdd, placeholder }: PkgInputProps) => {
  const [value, setValue] = useState('');

  const searchHandler = (value: string) => {
    searchPackages(value).then((packages) => filter.pkgSuggestions.set(packages));
  };

  const autocompleteRef = useRef(null);

  const changeHandler = (value: string) => setValue(value);

  const selectHandler = useCallback((value: string, option: PkgOption) => {
    onAdd(option);
    setValue('');
    search.new();
  }, [onAdd]);

  return (
    <AutoComplete
      ref={autocompleteRef}
      style={{ width: '100%' }}
      notFoundContent="No packages found"
      value={value}
      placeholder={placeholder}
      onChange={changeHandler}
      options={[...filter.pkgSuggestions.options]}
      onSelect={selectHandler}
      onSearch={searchHandler}
    />
  )
});
