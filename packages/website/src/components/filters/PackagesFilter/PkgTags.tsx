import { Space, Tag } from 'antd';
import { PkgOption } from '../../../store/filter';
import { search } from '../../../services/repos';

type PkgTagsProps = {
  packages: PkgOption[];
  onRemove: (pkgLabel: string) => void;
}

export const PkgTags = ({ onRemove, packages }: PkgTagsProps) => {
  return (
    <Space wrap style={{ gap: 4, marginTop: 8 }}>
      {packages.map((pkg) => (
        <Tag
          key={pkg.value}
          closable
          style={{ margin: 0 }}
          onClose={() => {
            onRemove(pkg.label);
            search.new();
          }}
        >
          {pkg.label}
        </Tag>
      ))}
    </Space>
  );
};