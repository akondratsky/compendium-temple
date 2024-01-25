import { Button, Flex } from 'antd';
import { PackageInput } from './PackageInput';
import { Packages } from './Packages';
import { filter } from '../../../store/filter';
import { search } from '../../../services/repos';

const resetHandler = () => {
  filter.resetPackages();
  search.new();
};

export const PackageFilter = () => {
  return (
    <Flex vertical justify='left'>
      <Flex>
        <PackageInput />
        <Button type="primary" style={{ marginLeft: 8 }} onClick={resetHandler}>Reset</Button>
      </Flex>
      <Packages />
    </Flex>
  );
};
