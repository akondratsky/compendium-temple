import { Button, Flex } from 'antd';
import { PackageInput } from './PackageInput';
import { Packages } from './Packages';
import { filter } from '../../../store/filter';

export const PackageFilter = () => {
  return (
    <Flex vertical justify='left'>
      <Flex>
        <PackageInput />
        <Button type="primary" style={{ marginLeft: 8 }} onClick={filter.resetPackages}>Reset</Button>
      </Flex>
      <Packages />
    </Flex>
  );
};
