import { Space, Tag } from 'antd';
import { observer } from 'mobx-react-lite';
import { filter } from '../../../store/filter';

export const Packages = observer(() => {
  return (
    <Space wrap style={{ gap: 4, marginTop: 8 }}>
      {filter.packages.map((pkg) => (
        <Tag
          key={pkg.value}
          closable
          style={{ margin: 0 }}
          onClose={() => filter.removePackage(pkg.label)}
        >
          {pkg.label}
        </Tag>
      ))}
    </Space>
  )
});