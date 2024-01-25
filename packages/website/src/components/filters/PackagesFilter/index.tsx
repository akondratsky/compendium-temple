import { Button, Flex } from 'antd';
import { PkgInput } from './PackageInput';
import { PkgTags } from './PkgTags';
import { PkgOption } from '../../../store/filter';
import { search } from '../../../services/repos';

type PackagesFilterProps = {
  placeholder: string;
  packages: PkgOption[];
  onReset: () => void;
  onRemove: (pkgLabel: string) => void;
  onAdd: (pkg: PkgOption) => void;
}

export const PackagesFilter = ({ packages, onReset, onRemove, onAdd, placeholder }: PackagesFilterProps) => {
  const resetHandler = () => {
    onReset();
    search.new();
  };

  return (
    <Flex vertical justify='left'>
      <Flex>
        <PkgInput onAdd={onAdd} placeholder={placeholder} />
        <Button type="primary" style={{ marginLeft: 8 }} onClick={resetHandler}>Reset</Button>
      </Flex>
      <PkgTags packages={[...packages]} onRemove={onRemove} />
    </Flex>
  );
};
