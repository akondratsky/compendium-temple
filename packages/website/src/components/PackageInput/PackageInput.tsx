import { useCallback, useState } from 'react';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { searchPackages } from '../../services/packages';
import { DefaultOptionType } from 'antd/es/select';

export const PackageInput = ({ onSelect }: Partial<AutoCompleteProps>) => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [value, setValue] = useState('');

  const searchHandler = (value: string) => searchPackages(value).then(setOptions);
  const changeHandler = (value: string) => setValue(value);

  const selectHandler = useCallback((value: string, option: DefaultOptionType) => {
    setValue('');
    onSelect?.(value, option);
  }, [onSelect]);

  return (
    <AutoComplete
      style={{ width: '100%' }}
      notFoundContent="No packages found"
      value={value}
      placeholder="Search packages"
      onChange={changeHandler}
      options={options}
      onSelect={selectHandler}
      onSearch={searchHandler}
    />
  )
};