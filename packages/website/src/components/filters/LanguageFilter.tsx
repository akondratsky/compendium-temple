import { Button, Flex, Select } from 'antd'
import { observer } from 'mobx-react-lite';
import { filter } from '../../store/filter';
import { search } from '../../services/repos';

const options = ['JavaScript', 'TypeScript'].map(lng => ({ label: lng, value: lng }));
const resetLanguage = () => {
  filter.setLanguage(null);
  search.new();
};

export const LanguageFilter = observer(() => {
  return (
    <Flex align='center'>
      <Select
        value={filter.language}
        onChange={(value) => {
          filter.setLanguage(value);
          search.new();
        }}
        placeholder="Filter by language"
        style={{ width: '100%' }}
        options={options}
      />
      <Button
        size="middle"
        type="primary"
        style={{ marginLeft: 8 }}
        onClick={resetLanguage}
      >
        Reset
      </Button>
    </Flex>

  )
});
